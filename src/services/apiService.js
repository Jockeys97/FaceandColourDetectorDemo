import { CLARIFAI_CONFIG } from '../config/api';

export async function clarifaiPredict(modelId, versionId, imageInput) {
  // Always use Vercel backend for GitHub Pages, only use dev proxy for localhost
  const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  const payload = {
    user_app_id: {
      user_id: CLARIFAI_CONFIG.USER_ID,
      app_id: CLARIFAI_CONFIG.APP_ID
    },
    inputs: [
      {
        data: {
          image: imageInput?.base64
            ? { base64: imageInput.base64 }
            : { url: imageInput.url }
        }
      }
    ]
  };

  if (isLocalDev) {
    // Development: use local proxy
    const url = `/api/clarifai/v2/models/${modelId}/versions/${versionId}/outputs`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  } else {
    // Production (including GitHub Pages): use Vercel function
    const response = await fetch('https://faceand-colour-detector-demo-75kb.vercel.app/api/clarifai-proxy', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        modelId,
        versionId,
        payload
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    return response.json();
  }
}

export async function detectFaces(imageUrl) {
  const modelId = CLARIFAI_CONFIG.MODELS.FACE_DETECTION.ID;
  const versionId = CLARIFAI_CONFIG.MODELS.FACE_DETECTION.VERSION_ID;
  const result = await clarifaiPredict(modelId, versionId, { url: imageUrl });
  const outputs = result?.outputs?.[0];
  const regions = outputs?.data?.regions || [];
  return { result, regions };
}

export async function detectFacesBase64(imageBase64) {
  const modelId = CLARIFAI_CONFIG.MODELS.FACE_DETECTION.ID;
  const versionId = CLARIFAI_CONFIG.MODELS.FACE_DETECTION.VERSION_ID;
  const result = await clarifaiPredict(modelId, versionId, { base64: imageBase64 });
  const outputs = result?.outputs?.[0];
  const regions = outputs?.data?.regions || [];
  return { result, regions };
}

export async function recognizeColors(imageUrl) {
  const modelId = CLARIFAI_CONFIG.MODELS.COLOR_RECOGNITION.ID;
  const versionId = CLARIFAI_CONFIG.MODELS.COLOR_RECOGNITION.VERSION_ID;
  const result = await clarifaiPredict(modelId, versionId, { url: imageUrl });
  const outputs = result?.outputs?.[0];
  const colors = outputs?.data?.colors || [];
  return { result, colors };
}

export async function recognizeColorsBase64(imageBase64) {
  const modelId = CLARIFAI_CONFIG.MODELS.COLOR_RECOGNITION.ID;
  const versionId = CLARIFAI_CONFIG.MODELS.COLOR_RECOGNITION.VERSION_ID;
  const result = await clarifaiPredict(modelId, versionId, { base64: imageBase64 });
  const outputs = result?.outputs?.[0];
  const colors = outputs?.data?.colors || [];
  return { result, colors };
}

const apiService = {
  detectFaces,
  detectFacesBase64,
  recognizeColors,
  recognizeColorsBase64,
  clarifaiPredict
};

export default apiService;
