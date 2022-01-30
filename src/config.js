const config = {
  'environment': process.env.NODE_ENV,
  'backend': {
    'uri': process.env.REACT_APP_BACKEND_URI || 'http://localhost:8080'
  }
};

module.exports = config;