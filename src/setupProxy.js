const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  const target = 'https://api.clarifai.com';
  const commonOptions = {
    target,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: (path) => path.replace(/^\/api(?:\/clarifai)?/, ''),
    onProxyReq: (proxyReq) => {
      const pat = process.env.REACT_APP_CLARIFAI_PAT;
      if (pat) proxyReq.setHeader('Authorization', `Key ${pat}`);
    }
  };

  app.use('/api/clarifai', createProxyMiddleware(commonOptions));
  app.use('/api', createProxyMiddleware(commonOptions));
};


