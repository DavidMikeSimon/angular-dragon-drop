// Configuration for protractor running on Travis CI with Sauce Labs

exports.config = {
  sauceUser: "davidmikesimon",
  sauceKey: "519e8897-9a6d-4f2c-81a1-10132cab95d0",

  specs: [
    'test/spec/*.js',
  ],

  capabilities: {
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    build: process.env.TRAVIS_BUILD_NUMBER,
    name: 'angular-dragon-drop',
    tags: [].concat(
      process.env.TRAVIS_NODE_VERSION ? ["Node " + process.env.TRAVIS_NODE_VERSION ] : [],
      process.env.TRAVIS_JOB_NUMBER ? ["Job " + process.env.TRAVIS_JOB_NUMBER ] : []
    ),
    browserName: process.env.SAUCE_BROWSER,
    platform: process.env.SAUCE_PLATFORM,
    version: process.env.SAUCE_BROWSER_VERSION
  },

  jasmineNodeOpts: {
    isVerbose: true,
    showColors: true,
    includeStackTrace: true
  }
};
