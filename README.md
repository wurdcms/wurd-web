# Wurd CMS client for the browser
Load content from the Wurd CMS in the browser.  If rendering on the server, use the API or [wurd-node](https://github.com/wurdcms/wurd-node-v3).

## Example
```javascript
import wurd from 'wurd-web';

wurd.connect('myApp');

wurd.load('homepage,common')
  .then(content => {
    console.log(content); // { homepage: { title: 'Hello world' }, common: {...} }

    console.log(wurd.get('homepage.title')); // 'Hello world'
  });
```

See more in the [examples](https://github.com/wurdcms/wurd-web/tree/master/examples) folder or run them with `npm run examples`.


## Installation
Using NPM:
```
npm install wurd-web
```

Directly in the browser:
```
<script src="https://unpkg.com/wurd-web/dist/wurd.js"></script>
```
