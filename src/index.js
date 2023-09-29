import * as THREE from 'three'
import { EffectsRenderer } from './effects_renderer';
import { createCamera } from './input/webcam';
import { MediaPipeAdapter } from './MediaPipe/adapter';


const canvas = document.querySelector('canvas.webgl');
const effectsRenderer = new EffectsRenderer({ canvas });
const mediaPipeAdapter = new MediaPipeAdapter();

const init = async () => {
  
  const sourceElement = await createCamera();
  await MediaPipeAdapter.loadLibraryFiles();
  
  mediaPipeAdapter.initialize({ videoOrImageSource: sourceElement });
  
  effectsRenderer.initialize({
    videoOrImageSource: sourceElement,
    baseReferenceData: {
      points: MediaPipeAdapter.baseReferencePoints,
      imageSize: MediaPipeAdapter.baseReferenceImageSize
    }
  });

  tick();
}


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick =  async () =>
{
    const deltaTime = clock.getDelta();

    await mediaPipeAdapter.update(deltaTime);

    // Render
  effectsRenderer.render(mediaPipeAdapter.face);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

init();
