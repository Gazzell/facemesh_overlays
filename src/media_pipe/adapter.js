/* eslint-disable no-underscore-dangle */
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { detectorConfig } from './config';
import { baseReferencePoints, baseReferenceImageSize } from './referencePoints/baseReferencePoints';
import { OneEuroFilterStabilizer } from '../utils/oneEuroFilterStabilizer';

let detector = null;

export class MediaPipeAdapter {
  _face = null;

  _stabilizer;

  _element;

  stabilizePoints = true;

  static async loadLibraryFiles() {
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
  }

  initialize({ videoOrImageSource }) {
    const { element } = videoOrImageSource;
    
    if(!element || !detector) {
      return;
    }

    this._element = element;

    this._stabilizer = new OneEuroFilterStabilizer();
  }

  async update(deltaTime) {
    this._face = null;

    if (detector) {
      const isVideoInput = this._element instanceof HTMLVideoElement;
      const faces = await detector.estimateFaces(this._element, {
        flipHorizontal: isVideoInput,
        staticImageMode: !isVideoInput,
      });

      if (!faces.length) {
        return;
      }

      this._face = this.stabilizePoints ? this._stabilizer.apply(faces[0].keypoints, deltaTime * 1000) : faces[0].keypoints;
    }
  }

  get face() {
    return this._face;
  }

  get hasTrackingFace() {
    return !!this._face;
  }

  static get baseReferencePoints() {
    return baseReferencePoints;
  }

  static get baseReferenceImageSize() {
    return baseReferenceImageSize;
  }


  static dispose() {
    detector?.dispose();
    detector = null;
  }
}
