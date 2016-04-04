// Karma configuration
// Generated on Fri Nov 20 2015 01:49:35 GMT+1100 (AEDT)

module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',
    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],
    // list of files / patterns to load in the browser
    files: [
        'app/bower_components/angular/angular.js',
        'app/bower_components/angular-mocks/angular-mocks.js',
        'app/bower_components/angular-route/angular-route.js',
        'bower_components/auth0-lock/build/auth0-lock.js',
        'vendor/auth0/auth0-angular.js',
        'vendor/angular-storage/angular-storage.js',
        'vendor/angular-jwt/angular-jwt.js',
        'app/app.js',
        'app/components/navbar/navbar.js',
        'app/view1/view1.js',
        'app/view2/view2.js',
        'app/view3/view3.js',
        'app/view3/add.js',
        'app/components/version/version.js',
        'app/components/version/version-directive.js',
        'app/components/version/interpolate-filter.js',
        'app/home/home.js',
        'app/login/login.js',
        'app/view1/locations.js',
        'app/view1/data.js',
        'app/components/directives/tableDots.js',
        'app/view1/view1_test.js',
        'app/view1/locations_test.js',
        'app/view1/data_test.js',
    ],
    // list of files to exclude
    exclude: [
    ],
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],
    // web server port
    port: 9876,
    // enable / disable colors in the output (reporters and logs)
    colors: true,
    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,
    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,
    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity
  })
}
