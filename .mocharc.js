module.exports = {
  spec: 'test/pathCoverage/**/*.test.js',
  require: ['test/pathCoverage/httpServer.hooks.js'],
  timeout: 20000,
  reporter: 'mochawesome',
  'reporter-option': [
    'reportDir=mochawesome-report',
    'reportFilename=path-coverage',
    'html=true',
    'json=true',
    'overwrite=true'
  ]
};
