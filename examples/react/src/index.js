/**
 * Entry point for the build system which starts up the application and renders it to the DOM
 */

import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/app';

//Connect to Wurd CMS
import wurd from './wurd';


// Load initial content (e.g. app name, titles etc.)
// Additional content can be loaded later as required; for example loading content by page
wurd.load('react')
  .then(content => {
    ReactDOM.render(<App />, document.getElementById('root'));
  })
  .catch(err => console.error(err));
