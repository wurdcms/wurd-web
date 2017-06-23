# Wurd CMS client for the browser
This is meant for client-side applications where you will load the content in the browser.
If rendering on the server, use wurd-node.

## Example
```
var wurd = require('wurd-web').connect('myApp');

wurd.load('homepage,common')
  .then(content => {
    console.log(content); // { homepage: { title: 'Hello world' }, common: {...} }

    console.log(wurd.get('homepage.title')); // 'Hello world'
  });
```


## Install
```
npm install wurd-web
```

## Run examples
```
npm run examples
```