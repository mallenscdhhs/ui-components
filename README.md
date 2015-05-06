# UI Components
[![Travis Build Status][build-badge]][build]
[![NPM version][npm-badge]][npm]

UI component library for producing HTML output from JSON configuration. This library is built with [Facebook's React](http://facebook.github.io/react/) and [Twitter Bootstrap](http://getbootstrap.com).

## Usage
This library contains many UI controls for building interactive UIs. You can use each component individually by including the main module and referencing off of that:

```javascript
var Components = require('@scdhhs/ui-components');
var Field = Components.elements.field;

React.render(
  <Field type="text" name="foo" label="Foo"/>,
  myMountPoint
);
```
See `src/main.js` for available components.

Using ES6 with [babel](http://babel.io) you can simply do:
```javascript
import {
  Field,
  Form,
  Fieldset,
  Action
} from '@scdhhs/ui-components';

React.render(
  <Field type="text" name="foo" label="Foo"/>,
  myMountPoint
);
```

### Rendering UI With Factory

One of the key benefits of this library is the ability to render complete UIs from JSON configuration files. To use this feature you must have a JSON configuration that follows our component schema, and pass that configuration to `Components.factory` method.

```javascript
var Components = require('@scdhhs/ui-components');
var config = {
  type: "page",
  child: "test-form",
  config: {
    title: "Hello"
  },
  components: {
    test-form: {
      type: "form",
      child: "test-field"
    }
    test-field: {
      type: "field",
      config: {
        type: "text",
        name: "test",
        label: "Test"
      }
    }
  }
};

var html = Components.factory(config);

React.render(html, myMountPoint);
```
Would render:
```html
<section class="page">
  <header>
    <h3>Hello</h3>
  </head>
  <form>
    <div class="form-group">
      <label for="">Test</label>
      <input type="text" name="test" id="test-field"/>
    </div>
  </form>
</section>
```

### Component Schema
Every UI component configuration must adhere to the same schema:
```javascript
{
  /**
   * The type of component to render. Name will be all
   * lowercase.
   * @type {string}
   */
  type: "component_type_string",
  /**
   * The key to the direct descendent of this component.
   * @type {string}
   */
  child: "pointer_to_child_component",
  /**
   * The key to the next sibling of this component.
   * @type {string}
   */
  next: "pointer_to_next_sibline_component",
  /**
   * If this is a top-level component that contains all others(e.g., page), then you must provide a binary tree of all sub components. Each component's key will be its "id" property, whatever that may be.
   * @type {object}
   */
  components: { },
  /**
   * Any number of key/value pairs to be passed to the React component as props.
   * @type {object}
   */
  config: { }
}
```

## Development
This project requires the following to be installed on your local machine:

* [nodejs](http://nodejs.org)

After you have installed the prerequisite software you must clone this repo to your local machine. From the project root directory run the following:
```bash
$ npm install
```

If you recieve any errors try verifying that you have the latest
version of `npm` installed: `$ npm --version`. You should have version ^2.7.4. If not, run `$ npm install -g npm`.

## Compiling
All components should be placed into their own `.jsx` file within the **/src** directory, and named using [PascalCase](http://c2.com/cgi/wiki?PascalCase). Mixins should also be placed into **/src** as well.

### Compiling JSX and Building the Distributables
To run the build tasks manually you can issue the following command: `$ npm run build`.

## Testing
This library uses [karma](http://karma-runner.github.io/0.12/index.html) and [jasmine 2.0](http://jasmine.github.io/2.0/introduction.html) for unit testing. In order to run the tests issue the the following command `$ npm test`. All unit tests should be placed in the **/test/unit** directory, and named according to the component being tested, e.g.: `foo-spec.js` for a component named `Foo.jsx`. All specs should include the suffix `-spec` in order to be picked up automatically by karma. You may use JSX syntax in your tests- they will be automagically converted to JS for you by karma.
