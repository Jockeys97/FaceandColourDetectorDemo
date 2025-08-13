import { CLARIFAI_CONFIG, buildApiUrl, httpJson, resolveModelVersion } from '../config/api';

export async function clarifaiPredict(modelId, versionId, imageUrl) {
  const url = buildApiUrl(modelId, versionId);
  const payload = {
    user_app_id: {
      user_id: CLARIFAI_CONFIG.USER_ID,
      app_id: CLARIFAI_CONFIG.APP_ID
    },
    inputs: [
      {
        data: {
          image: {
            url: imageUrl
          }
        }
      }
    ]
  };

  const isDev = process.env.NODE_ENV === 'development';
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  if (!isDev) {
    headers['Authorization'] = `Key ${CLARIFAI_CONFIG.PAT}`;
  }
  return httpJson(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });
}

export async function detectFaces(imageUrl) {
  const modelId = CLARIFAI_CONFIG.MODELS.FACE_DETECTION.ID;
  const versionId = await resolveModelVersion(
    modelId,
    CLARIFAI_CONFIG.MODELS.FACE_DETECTION.VERSION_ID
  );
  const result = await clarifaiPredict(modelId, versionId, imageUrl);
  const outputs = result?.outputs?.[0];
  const regions = outputs?.data?.regions || [];
  return { result, regions };
}

export default {
  detectFaces,
  clarifaiPredict
};
