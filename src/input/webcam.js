// not checking legacy getUserMedia implementations since code does not use them
const hasGetUserMedia = () => Boolean(window.navigator.mediaDevices && window.navigator.mediaDevices.getUserMedia);

/*
 * BUG: Android Webview without camera permissions is not reporting any error
 * but the camera is not available (promise does not resolve)
 * cameraNotAvailable param allows us to prevent camera initialization in this case.
 */
export const createCamera = async () => {
  if (!hasGetUserMedia()) {
    const error = new Error('No camera available');
    error.camera = 1;
    throw error;
  }

  const webcamElement = document.createElement('video'); // our webcam video
  webcamElement.id = '_webcam';
  webcamElement.playsInline = true;
  webcamElement.muted = true;
  webcamElement.style.width = '0px';
  webcamElement.style.height = '0px';
  webcamElement.style.position = 'absolute';

  try {
    const mediaStream = await window.navigator.mediaDevices.getUserMedia({
      video: {
        width: 1024,
        height: 768,
        frameRate: 60,
        facingMode: { ideal: 'user' },
      },
    });
    webcamElement.srcObject = mediaStream;
    await webcamElement.play();

    return {
      element: webcamElement,
      width: webcamElement.videoWidth,
      height: webcamElement.videoHeight,
    };
  } catch (rawError) {
    const error = new Error(rawError.message);
    error.camera = 2;
    throw error;
  }
};
