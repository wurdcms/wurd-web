/* global globalThis,afterEach,beforeEach */
//globalThis.fetch = require('node-fetch');
const test = require('assert');
const sinon = require('sinon');

import wurd from './';
import Store from './store';
import Block from './block';

const Wurd = wurd.Wurd;

const same = test.strictEqual;


describe('Wurd', function () {
  afterEach(sinon.restore);


  describe('connect', function () {
    it('returns a client, which is also the default library instance', function () {
      const client = wurd.connect('appname');

      test.ok(client instanceof Wurd);
      test.ok(wurd instanceof Wurd);

      same(client, wurd);
    });

    it('configures the client', function () {
      const client = wurd.connect('appname');

      same(client.app, 'appname');
      same(client.draft, false);
      same(client.editMode, false);
      same(client.debug, undefined);

      test.ok(client.store instanceof Store);
      test.ok(client.content instanceof Block);

      same(client.content.wurd, client);
    });

    describe('with options', function () {
      
    });
  });


  describe('load', function () {
    let client;

    beforeEach(function () {
      client = new Wurd('foo');
      sinon.stub(client, 'fetchContent').resolves({
        main: { title: 'My App' },
        home: { title: 'Welcome' },
      });
    });

    it('fetches content', function (done) {
      client.load('main')
        .then((cms) => {
          same(client.fetchContent.callCount, 1);
          same(client.fetchContent.args[0][0], 'https://api-v3.wurd.io/apps/foo/content/main?');

          // Resolves the top-level Block for accessing content
          same(cms, client.content);
          same(cms.text('main.title'), 'My App');

          done();
        })
        .catch(done);
    });

    it('can fetch multiple containers at once', function (done) {
      client.load(['main', 'home'])
        .then((cms) => {
          same(client.fetchContent.args[0][0], 'https://api-v3.wurd.io/apps/foo/content/main,home?');

          same(cms.text('main.title'), 'My App');
          same(cms.text('home.title'), 'Welcome');

          done();
        })
        .catch(done);
    });

    it('can override default options', function (done) {
      const options = {
        lang: 'fr',
        draft: true,
      };

      client.load(['main', 'home'], options)
        .then((cms) => {
          same(client.fetchContent.callCount, 1);
          same(client.fetchContent.args[0][0], 'https://api-v3.wurd.io/apps/foo/content/main,home?draft=1&lang=fr');

          done();
        })
        .catch(done);
    });
  });

});
