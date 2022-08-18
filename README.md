# Browser Javascript client for the Wurd CMS
Wurd is a service that lets you integrate a CMS into any website or app in minutes.  This client makes it easy to load content into the browser for client-side applications.

If you're using React, check out [wurd-react](https://github.com/wurdcms/wurd-react) as it includes easy to use components for setting up editors and content at once.

If rendering on the server, use the API or [wurd-node](https://github.com/wurdcms/wurd-node).


## Example
```javascript
import wurd from 'wurd-web';

wurd.connect('myApp', { editMode: true });

wurd.load('homepage,shared')
  .then(content => {
    //Use getters for accessing content
    content.text('homepage.title'); // 'Hello world'

    // Use blocks for accessing subsections of content
    var page = content.block('homepage');

    page.text('title'); // 'Hello world'

    page.map('team', item => {
      item.text('name'); // 'John Smith'
    });
  });
```

See more in the [examples](https://github.com/wurdcms/wurd-web/tree/master/examples) folder or run them with `npm run example`.


## Installation
Using NPM:
```
npm install wurd-web
```

Directly in the browser:
```
<script src="https://unpkg.com/wurd-web/dist/wurd.min.js"></script>
```

## Usage
1. Create a Wurd account and app.
2. Connect to a Wurd app with `wurd.connect('appName', {editMode: true})`. 
3. Load top level 'sections' of content you'll be using with `wurd.load('section')`.
4. In your views/templates etc., get content with `wurd.get('section.item')`.
5. To make regions editable, simply add the `data-wurd` attributes to the HTML.  For example (using Mustache style template tags):

```html
<h1 data-wurd="homepage.title">{{wurd.get('homepage.title')}}</h1>
```
