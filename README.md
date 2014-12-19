# UI Components
[ ![Codeship Status for scdhhs/ui-component-library](https://codeship.com/projects/bc98cc50-690e-0132-45b4-265187a17dc6/status?branch=master)](https://codeship.com/projects/53475)
UI component library for producing HTML output from JSON configuration. This library uses [Facebook's React](http://facebook.github.io/react/).

## Getting Started
This project requires the following to be installed on your local machine:

* [nodejs](http://nodejs.org)
* [bower](http://bower.io)
* [gulp](http://gulpjs.com/)
* [karma](http://karma-runner.github.io/0.12/index.html)

After you have installed the prerequisite software you must clone this repo to your local machine. From the project root directory type:
```bash
$ npm install
$ bower install
```
## Development
All components should be placed into their own `.jsx` file within the **/src** directory, and named using [PascalCasing](http://c2.com/cgi/wiki?PascalCase). Mixins should also be placed into **/src** as well.

### Compiling JSX and Building the Distributables
Durring development you can run the `gulp watch` task in order to rebuild all assets when source code changes. This will compile JSX code, create the environment builds(AMD, CJS, browser), and place all assets into the **/dist** directory. 

To run the build tasks manually you can issue the following command: `$ npm run build`.

## Testing
This library uses [karma](http://karma-runner.github.io/0.12/index.html) and [jasmine 2.0](http://jasmine.github.io/2.0/introduction.html) for unit testing. In order to run the tests issue the the following command `$ npm test`. All unit tests should be placed in the **/test/unit** directory, and named according to the component being tested, e.g.: `foo-spec.js` for a component named `Foo.jsx`. All specs should include the suffix `-spec` in order to be picked up automatically by karma. You may use JSX syntax in your tests- they will be automagically converted to JS for you by karma.