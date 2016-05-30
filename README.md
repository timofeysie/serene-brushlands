# An Art Collection App

This project is an AngularJS app running off of a NodeJS server program.
It uses Sass styelsheets with Compass for compiling them.
For login and authentication we use Auth0.
It uses Firebase and the angular-fire lib to persist data.
It was created using the official angular-seed.

Functionally it manages a collection of artwork uploaded from a Word document.
It has an inspection mode which should be used in conjunction with NFC tags.


## Routes
View 1 is a list of paintings.  It also handles a list of the locations of each work and a data table page.
View 2 is an artist bio.
View 3 is an artwork.  It also has the crud functions.


## Unit Tests

Unit testing is carried out with Jasmine.
Open the unit-tests/SpecRunner.html file in a browser to run the tests.


##JSDocs

The documentation for the project is generated with the following command:
```
$ jsdoc -c conf.json -d docs
```
The documentation will then be generated in to the docs directory.  Open the index.html page in a browser to view the docs.


## 3D Buttons
Button classes are set up like this:
button *button-color* button-pill

The button *color* types are: 
(non for grey)
button-primary    - blue #79d4ec dark #4cc6e6
button-action     - green #9bbb52 dark #809c3e
button-highlight  - brown #e1a85a dark #d9912f
button-caution    - md red #d67465 dark #cb503d
button-royal      - dk red #c74428 dark #9d351f


## Development
We are using Sass with Compass.  To watch the .scss files, run the following command:
```
$ compass watch
```
This will compile the file in the scss directory to plain css in the app/stylesheet directory.  
The styling for the app should be done in the scss/styles.scss file.

To start the server, in another termial run:
```
$ node index.js
```
The app will then be running at http://localhost:5000/

To commite changes and push:
```
$ git add .
$ git commit -a -m "Message about what you changed"
$ git push heroku master
```


# Getting started notes

A Node.js app using [Express 4](http://expressjs.com/) supporting Angular with [Node on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs) article - check it out.

## Running Locally
Requires [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/).
From the root directory, run
```
$ npm install
$ node index.js
```
The app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku (no longer used)
```
$ git status (to see if you need to add any files)
$ git add . (if you have new fiels)
$ git commit -a -m "What' changed"
$ git push heroku master
$ heroku open (or refresh the browser)
```


## Documentation
# angular-seed — the seed for AngularJS apps

This project is an application skeleton for a typical [AngularJS](http://angularjs.org/) web app. The seed is here: [http://git-scm.com/](http://git-scm.com/).

* We get the tools we depend upon via `npm`, the [node package manager][npm].
* We get the angular code via `bower`, a [client-side code package manager][bower].

## Directory Layout

```
app/                    --> all of the source files for the application
  app.css               --> default stylesheet
  components/           --> all app specific modules
    version/              --> version related components
      version.js                 --> version module declaration and basic "version" value service
      version_test.js            --> "version" value service tests
      version-directive.js       --> custom directive that returns the current app version
      version-directive_test.js  --> version directive tests
      interpolate-filter.js      --> custom interpolation filter
      interpolate-filter_test.js --> interpolate filter tests
  view1/                --> the view1 view template and logic
    view1.html            --> the partial template
    view1.js              --> the controller logic
    view1_test.js         --> tests of the controller
  view2/                --> the view2 view template and logic
    view2.html            --> the partial template
    view2.js              --> the controller logic
    view2_test.js         --> tests of the controller
  app.js                --> main application module
  index.html            --> app layout file (the main html template file of the app)
  index-async.html      --> just like index.html, but loads js files asynchronously
karma.conf.js         --> config file for running unit tests with Karma
e2e-tests/            --> end-to-end tests
  protractor-conf.js    --> Protractor config file
  scenarios.js          --> end-to-end scenarios to be run by Protractor
```

## Testing

There are two kinds of tests in the angular-seed application: Unit tests and End to End tests.

### Unit Tests

We introduced unit tests written in the Mocha framework with a Chai assertion library.
Run these unit test like this:
```
$ karma start
```

The Jasmime Tests
The angular-seed app came preconfigured with unit tests. Currently these are no tests that are written in Jasmine.  The following are the notes for running them if tests are added.
[Jasmine][jasmine], which we run with the [Karma Test Runner][karma]. We provide a Karma
configuration file to run them.

* the configuration is found at `karma.conf.js`
* the unit tests are found next to the code they are testing and are named as `..._test.js`.

The easiest way to run the unit tests is to use the supplied npm script:

```
npm test
```

This script will start the Karma test runner to execute the unit tests. Moreover, Karma will sit and
watch the source and test files for changes and then re-run the tests whenever any of them change.
This is the recommended strategy; if your unit tests are being run every time you save a file then
you receive instant feedback on any changes that break the expected code functionality.

You can also ask Karma to do a single run of the tests and then exit.  This is useful if you want to
check that a particular version of the code is operating as expected.  The project contains a
predefined script to do this:

```
npm run test-single-run
```


### End to end testing

The angular-seed app comes with end-to-end tests, again written in [Jasmine][jasmine]. These tests
are run with the [Protractor][protractor] End-to-End test runner.  It uses native events and has
special features for Angular applications.

* the configuration is found at `e2e-tests/protractor-conf.js`
* the end-to-end tests are found in `e2e-tests/scenarios.js`

Protractor simulates interaction with our web app and verifies that the application responds
correctly. Therefore, our web server needs to be serving up the application, so that Protractor
can interact with it.

```
npm start
```

In addition, since Protractor is built upon WebDriver we need to install this.  The angular-seed
project comes with a predefined script to do this:

```
npm run update-webdriver
```

This will download and install the latest version of the stand-alone WebDriver tool.

Once you have ensured that the development web server hosting our application is up and running
and WebDriver is updated, you can run the end-to-end tests using the supplied npm script:

```
npm run protractor
```

This script will execute the end-to-end tests against the application being hosted on the
development server.


## Updating Angular

Previously we recommended that you merge in changes to angular-seed into your own fork of the project.
Now that the angular framework library code and tools are acquired through package managers (npm and
bower) you can use these tools instead to update the dependencies.

You can update the tool dependencies by running:

```
npm update
```

This will find the latest versions that match the version ranges specified in the `package.json` file.

You can update the Angular dependencies by running:

```
bower update
```

This will find the latest versions that match the version ranges specified in the `bower.json` file.


## Loading Angular Asynchronously

The angular-seed project supports loading the framework and application scripts asynchronously.  The
special `index-async.html` is designed to support this style of loading.  For it to work you must
inject a piece of Angular JavaScript into the HTML page.  The project has a predefined script to help
do this.

```
npm run update-index-async
```

This will copy the contents of the `angular-loader.js` library file into the `index-async.html` page.
You can run this every time you update the version of Angular that you are using.


## Serving the Application Files

While angular is client-side-only technology and it's possible to create angular webapps that
don't require a backend server at all, we recommend serving the project files using a local
webserver during development to avoid issues with security restrictions (sandbox) in browsers. The
sandbox implementation varies between browsers, but quite often prevents things like cookies, xhr,
etc to function properly when an html page is opened via `file://` scheme instead of `http://`.

For more information on AngularJS please check out http://angularjs.org/

[git]: http://git-scm.com/
[bower]: http://bower.io
[npm]: https://www.npmjs.org/
[node]: http://nodejs.org
[protractor]: https://github.com/angular/protractor
[jasmine]: http://jasmine.github.io
[karma]: http://karma-runner.github.io
[travis]: https://travis-ci.org/
[http-server]: https://github.com/nodeapps/http-server

For more information about using Node.js on Heroku, see these Dev Center articles:
- [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)

## Problems

Cannot find module
SO:  multiple folders named "emitter" that contained the indexof module also had a gitignore file that made git ignore the module, no idea why that was even there, but deleting them fixed the problem
SO: you're missing the __dirname that you have everywhere else.
SO: running a one-off copy of your dyno to have it list the directory contents – this would allow you to check if your file is where you'd expect it to be. (Heroku has more information on this here.) For example:
$ heroku run 'ls -al'
SO:
$ heroku config:set NODE_ENV=production
$ heroku config:set NODE_PATH=lib

These, whereas helpful, did not fix the problem.  Cheerio had to be added to the list of dependencies in package.json.  Previously is was part of dev dependencies.

