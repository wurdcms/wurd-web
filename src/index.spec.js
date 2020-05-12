/* global globalThis,afterEach,beforeEach */
//globalThis.fetch = require('node-fetch');
const test = require('assert');
const sinon = require('sinon');

import wurd from './';
import Store from './store';
import Cache from './cache/memory';
import Block from './block';

const Wurd = wurd.Wurd;

const same = test.strictEqual;

const testContent = {
  a: {
    a: 'AA',
    b: {
      a: 'ABA',
      b: 'ABB'
    },
    c: 'Hello {{name}}, today is {{day}}'
  }
};


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

      // test.ok(client.store instanceof Store);
      // test.ok(client.content instanceof Block);
      test.ok(client.store instanceof Store);

      // same(client.content.wurd, client);
    });

    describe('with options', function () {
      
    });
  });


  describe('load', function () {
    let client;

    beforeEach(function () {
      client = new Wurd('foo', {
        cache: new Cache()
      });

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

          // Resolves the client as a top-level block
          same(cms, client);
          same(cms.id(), null);
          same(cms.id('main.title'), 'main.title');
          same(cms.text('main.title'), 'My App');

          done();
        })
        .catch(done);
    });

    it('can fetch multiple containers at once', function (done) {
      client.load(['main', 'home'])
        .then((cms) => {
          same(client.fetchContent.callCount, 1);
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

    it('avoids fetching from server if the cache is available', function (done) {
      // First load
      client.load(['main', 'home'])
        .then((cms) => {
          same(client.fetchContent.callCount, 1);

          // Second load
          client.load(['main', 'home'])
            .then((cms) => {
              same(client.fetchContent.callCount, 1);

              done();
            });
        })
        .catch(done);
    });
  });

  describe('#id()', function() {
    describe('with no path argument', function() {
      it('returns the block path', function() {
        const block = new Block(new Wurd('foo'), 'sectionName');

        same(block.id(), 'sectionName');
      });
    });

    describe('with path argument', function() {
      it('returns the full item path, with the block path', function() {
        const block = new Block(new Wurd('foo'), 'sectionName');

        same(block.id('itemName'), 'sectionName.itemName');
        same(block.id('itemName.childItemName'), 'sectionName.itemName.childItemName');
      });
    });
  });


  describe('#get()', function() {
    let cms;

    beforeEach(function() {
      cms = new Wurd('foo', {
        rawContent: testContent,
      });
    });

    describe('when item exists', function() {
      it('returns the content', function() {
        same(cms.get('a.a'), 'AA');
        test.deepEqual(cms.get('a.b'), { a: 'ABA', b: 'ABB' });
      });

      it('returns the content when scoped by path', function() {
        cms.path = 'a.b';

        same(cms.get('a'), 'ABA');
        same(cms.get('b'), 'ABB');
        test.deepEqual(cms.get(), { a: 'ABA', b: 'ABB' });
      });
    });

    describe('when item is missing', function() {
      it('returns undefined', function() {
        same(cms.get('a.foo'), undefined);
      });

      describe('in draft mode', function() {
        it('logs a warning if section has not been loaded');
      });
    });
  });


  describe('#text()', function() {
    let live, draft;

    beforeEach(function() {
      live = new Wurd('live', {
        rawContent: testContent,
      });

      draft = new Wurd('draft', {
        rawContent: testContent,
        draft: true
      });

      sinon.stub(console, 'warn');
    });

    describe('when item exists', function() {
      it('returns the text content', function() {
        same(live.text('a.a'), 'AA');
        same(draft.text('a.a'), 'AA');
      });
    });

    describe('when item is missing', function() {
      it('returns empty string in live mode', function() {
        same(live.text('a.foo'), '');
      });

      it('returns path in draft mode', function() {
        same(draft.text('a.foo'), '[a.foo]');
      });
    });

    describe('when item is not text', function() {
      it('prints a warning to the console', function() {
        live.text('a.b');

        same(console.warn.callCount, 1);
        same(console.warn.args[0][0], 'Tried to get object as string: a.b');
      });

      it('returns empty string in live mode', function() {
        same(live.text('a.b'), '');
      });

      it('returns path in draft mode', function() {
        same(draft.text('a.b'), '[a.b]');
      });
    });

    describe('with vars argument', function() {
      it('replaces {{mustache}} style placeholders with vars', function() {
        same(live.text('a.c', { name: 'John', day: 'Monday' }), 'Hello John, today is Monday');

        same(draft.text('a.c', { name: 'John', day: 'Monday' }), 'Hello John, today is Monday');
      });
    });
  });


  describe('#block()', function () {
    let cms;

    beforeEach(function () {
      cms = new Wurd('foo', {
        rawContent: testContent,
      });
    });

    it('returns a new instance scoped to the given path', function () {
      const block = cms.block('a.b');

      same(block.path, 'a.b');
      same(block.id(), 'a.b');
      same(block.id('a'), 'a.b.a');
      same(block.get('a'), 'ABA');
      same(block.get('b'), 'ABB');
    });

    it('works recursively', function () {
      // First child block
      const a = cms.block('a');

      same(a.id(), 'a');
      same(a.get('a'), 'AA');

      // Second child block
      const ab = a.block('b');

      same(ab.id(), 'a.b');
      same(ab.get('a'), 'ABA');
    });
  });

});
