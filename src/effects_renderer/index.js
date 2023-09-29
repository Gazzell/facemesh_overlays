import { FaceMesh } from './meshes/facemesh/faceMesh';
import * as THREE from 'three';
import { FACES } from './meshes/facemesh/face_geometry_data';

export class EffectsRenderer {
  _renderer;
  _loader;
  _camera;
  _scene;
  _faceMeshesGroup;
  _source;
  _baseReferenceData;

  constructor({ canvas }) {
    this._renderer = new THREE.WebGLRenderer({ canvas: canvas });
    this._renderer.setPixelRatio(window.devicePixelRatio);

    this._loader = new THREE.TextureLoader();
  }

  initialize({ videoOrImageSource, baseReferenceData }) {
    this._source = videoOrImageSource;
    this._baseReferenceData = baseReferenceData;
    
    const { width, height, element } = videoOrImageSource || { width: window.innerWidth, height: window.innerHeight };
    this._renderer.setSize(width, height);

    this._initScene(width, height);

    this._setupSceneBackground(element);

    this.addLayerEffect({ alphaMap: this._loader.load('assets/test.png') });
  }

  _initScene(width, height) {
    this._scene = new THREE.Scene();
    this._faceMeshesGroup = new THREE.Group();
    this._camera = new THREE.OrthographicCamera(-width * 0.5, width * 0.5, height * 0.5, -height * 0.5, -1000, 1000);
  }

  _setupSceneBackground(element) {
    if (!element) {
      return;
    }

    const sourceMode = element.nodeName === 'IMG' ? 'image' : 'webcam'
    if (sourceMode === 'webcam') {
      this._videoTexture = new THREE.VideoTexture(element);
      this._videoTexture.wrapS = THREE.RepeatWrapping;
      this._videoTexture.repeat.x = -1;
    } else {
      this._videoTexture = new THREE.Texture(element);
      this._videoTexture.needsUpdate = true;
    }

    this._videoTexture.colorSpace = THREE.SRGBColorSpace;
    this._scene.background = this._videoTexture;
  }

  addLayerEffect({ alphaMap }) {
    const face = new FaceMesh({
      source: this._source,
      baseReferenceData: this._baseReferenceData,
      faces: FACES,
      name: 'face',
      zIndex: 100,
      isMultimaterial: true,
    });

    const testMaterial = new THREE.MeshBasicMaterial({
      alphaMap: alphaMap,
      transparent: true,
      color: 0xff0000
    });
    face.material = testMaterial;
    
    this._faceMeshesGroup.add(face);
  }

  _activateFaces() {
    if(this._scene.children.some(child => child === this._faceMeshesGroup)) {
      return;
    }

    this._scene.add(this._faceMeshesGroup);
  }
  
  _deactivateFaces() {
    this._faceMeshesGroup.removeFromParent();
  }

  render(face) {
    if(face) {
      this._activateFaces();
      this._faceMeshesGroup.children.forEach(faceMesh => faceMesh.update(face));
    } else {
      this._deactivateFaces();
    }
    this._renderer.render(this._scene, this._camera);
  }
}