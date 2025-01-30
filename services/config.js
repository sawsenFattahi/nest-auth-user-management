module.exports = {
  mongodb: {
    server: 'mongodb',
    port: 27017,
    user: 'um',
    password: 'um-password',
  },
  site: {
    host: '0.0.0.0',
    port: 8081,
  },
  useBasicAuth: true, // Enable basic authentication
  basicAuth: {
    username: 'um', // Username for basic auth
    password: 'um-password', // Password for basic auth
  },
  ssl: {
    enabled: false,
  },
};
