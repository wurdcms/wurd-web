const test = require('assert');
const sinon = require('sinon');

import wurd from './';
import Store from './store';
import Block from './block';

const Wurd = wurd.Wurd;

const same = test.strictEqual;


describe('Wurd', function() {
  let originalLocalStorage;

  beforeEach(function() {
    originalLocalStorage = global.localStorage;

    global.localStorage = {
      setItem: sinon.stub(),
      getItem: sinon.stub().returns('{}'),
      removeItem: sinon.stub(),
    };
  });

  afterEach(function() {
    sinon.restore();

    global.localStorage = originalLocalStorage;
  });


  describe('connect', function() {
    it('returns a client, which is also the default library instance', function() {
      let client = wurd.connect('appname');

      test.ok(client instanceof Wurd);
      test.ok(wurd instanceof Wurd);

      same(client, wurd);
    });

    it('configures the client', function() {
      let client = wurd.connect('appname');

      same(client.app, 'appname');
      same(client.draft, false);
      same(client.editMode, false);
      same(client.debug, undefined);

      test.ok(client.store instanceof Store);
      test.ok(client.content instanceof Block);

      same(client.content.wurd, client);
    });

    describe('with options', function() {
      
    });
  });

  describe('#load()', function () {
    let client;

    beforeEach(function () {
      client = wurd.connect('appname', {
        debug: true,
        onLoad: sinon.stub(),
      });

      // Set cached content
      client.store.rawContent = {
        lorem: { title: 'Lorem' },
        dolor: { title: 'Dolor' },
      };

      // Set uncached content
      sinon.spy(client, '_fetchSections');
      sinon.stub(client, '_fetch').resolves({
        ipsum: { title: 'Ipsum' },
        amet: { title: 'Amet' }
      });

      sinon.stub(client.store, 'clear');

      sinon.stub(console, 'info');
    });

    it('resolves the main content Block', function (done) {
      client.load(['lorem', 'ipsum'])
        .then(content => {
          test.ok(content instanceof Block);

          same(content.id(), null);
          same(content.get('lorem.title'), 'Lorem');

          done();
        }).catch(done);
    });

    it('loads content from cache and server', function (done) {
      client.load(['lorem','ipsum','dolor','amet'])
        .then(content => {
          // Should only call to server for missing sections
          same(client._fetchSections.callCount, 1);
          test.deepEqual(client._fetchSections.args[0][0], ['ipsum', 'amet']);
          
          test.deepEqual(console.info.args, [
            ['Wurd: from cache:', ['lorem', 'dolor']],
            ['Wurd: from server:', ['ipsum', 'amet']],
          ]);

          // Should return the main content Block
          test.deepEqual(content.get(), {
            lorem: { title: 'Lorem' },
            ipsum: { title: 'Ipsum' },
            dolor: { title: 'Dolor' },
            amet: { title: 'Amet' }
          });

          // Should pass the main content Block to the onLoad() callback
          same(client.onLoad.callCount, 1);
          same(client.onLoad.args[0][0], content);

          done();
        }).catch(done);
    });

    it('does not fetch from server if all content is available', function (done) {
      client.load(['lorem', 'dolor'])
        .then(content => {
          // Should not call to server
          same(client._fetchSections.callCount, 0);
          
          test.deepEqual(console.info.args, [
            ['Wurd: from cache:', ['lorem', 'dolor']],
          ]);
          
          // Should return the main content Block
          test.deepEqual(content.get(), {
            lorem: { title: 'Lorem' },
            dolor: { title: 'Dolor' },
          });

          // Should pass the main content Block to the onLoad() callback
          same(client.onLoad.callCount, 1);
          same(client.onLoad.args[0][0], content);

          done();
        }).catch(done);
    });

    it('works with an array of sectionNames', function (done) {
      client.load(['lorem', 'ipsum'])
        .then(content => {
          test.deepEqual(content.get('lorem.title'), 'Lorem');
          test.deepEqual(content.get('ipsum.title'), 'Ipsum');

          test.deepEqual(console.info.args, [
            ['Wurd: from cache:', ['lorem']],
            ['Wurd: from server:', ['ipsum']],
          ]);

          done();
        }).catch(done);
    })

    it('works with a comma separated string', function (done) {
      client.load('dolor,amet')
        .then(content => {
          test.deepEqual(content.get('dolor.title'), 'Dolor');
          test.deepEqual(content.get('amet.title'), 'Amet');

          test.deepEqual(console.info.args, [
            ['Wurd: from cache:', ['dolor']],
            ['Wurd: from server:', ['amet']],
          ]);

          done();
        }).catch(done);
    })
    
    it('skips cache if in editMode', function (done) {
      client.editMode = true;
      
      client.load(['lorem','ipsum','dolor','amet'])
        .then(content => {
          // Should call server for all sections
          same(client._fetchSections.callCount, 1);
          test.deepEqual(client._fetchSections.args[0][0], ['lorem', 'ipsum', 'dolor', 'amet']);
          
          test.deepEqual(console.info.args, [
            ['Wurd: from server:', ['lorem', 'ipsum', 'dolor', 'amet']],
          ]);

          // Should clear the cache so content is up to date when out of editMode again
          same(client.store.clear.callCount, 1);

          // Should return the main content Block
          test.deepEqual(content.get(), {
            lorem: { title: 'Lorem' },
            ipsum: { title: 'Ipsum' },
            dolor: { title: 'Dolor' },
            amet: { title: 'Amet' }
          });

          // Should pass the main content Block to the onLoad() callback
          same(client.onLoad.callCount, 1);
          same(client.onLoad.args[0][0], content);

          done();
        }).catch(done);
    });
  });


  describe('#_fetchSections()', function () {
    let client;

    beforeEach(function () {
      client = new Wurd('myapp');

      sinon.stub(client, '_fetch').resolves({
        common: { brand: 'MyApp' },
        main: { title: 'Welcome' },
      });
    });

    it('fetches content from the server', function (done) {
      client._fetchSections(['common', 'main'])
        .then(json => {
          same(client._fetch.callCount, 1);
          same(client._fetch.args[0][0], 'https://api.wurd.io/apps/myapp/content/common,main?');

          test.deepEqual(json, {
            common: { brand: 'MyApp' },
            main: { title: 'Welcome' },
          });

          done();
        }).catch(done);
    });

    it('works in draft mode', function (done) {
      client.draft = true;

      client._fetchSections(['common', 'main'])
        .then(json => {
          same(client._fetch.callCount, 1);
          same(client._fetch.args[0][0], 'https://api.wurd.io/apps/myapp/content/common,main?draft=true');

          done();
        }).catch(done);
    });

    it('works with a different language', function (done) {
      client.lang = 'es';

      client._fetchSections(['common', 'main'])
        .then(json => {
          same(client._fetch.callCount, 1);
          same(client._fetch.args[0][0], 'https://api.wurd.io/apps/myapp/content/common,main?lang=es');

          done();
        }).catch(done);
    });
  })

});
