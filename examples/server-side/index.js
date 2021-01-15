const express = require('express');
const fetch = require('node-fetch');
const { Wurd } = require('../../dist/wurd');

const app = express();


// Set up the Wurd CMS
app.use((req, res, next) => {
  const { edit, lang } = req.query;

  // Use the 'example' Wurd project
  req.wurd = new Wurd('example', {
    editMode: edit !== undefined, // Add `edit` to the querystring to enter 'edit mode'
    lang, // Add `lang=es` to the querystring to switch to Spanish
    log: true, // Log requests and cache hits/misses
    fetch, // Only required in Node if it is not already available on the global scope
  });

  next();
});

app.get('/', async (req, res) => {
  // Load shared content (`nav`) and current page content (`home`)
  const cms = await req.wurd.load(['nav', 'home']);

  res.send(`
    <!-- Use text() to get content: -->
    <title>${cms.text('home.meta.title')}</title>

    <!-- Use el() to create editable text regions: -->
    <h1>${cms.el('home.title', { name: 'John' })}</h1>

    <!-- Replace content dynamically ('{{name}}' will become 'John'): -->
    ${cms.el('home.welcome.intro', { name: 'John' })}

    <!-- Include the editor script to make the page editable (only in edit mode): -->
    ${cms.includeEditor()}
  `);
});

// Blog post: Example of loading content dynamically
app.get('/blog/:slug', async (req, res) => {
  const { slug } = req.params;
  const postId = `blog_${slug}`;
  const cms = await req.wurd.load(['nav', postId]);

  if (!cms.get(postId)) return res.sendStatus(404);

  res.send(`
    <title>${cms.text(`${postId}.meta.title`)}</title>

    <!-- Use block() to access nested content -->
    ${cms.block(postId, post => `
      <h1>${post.el('title')}</h1>
      ${post.el('content', null, { markdown: true })}
    `)}

    ${cms.includeEditor()}
  `);
});


const server = app.listen(process.env.PORT || 5000);

console.log(`Listening on ${server.address().port}`);
