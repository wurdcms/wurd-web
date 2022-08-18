const test = require('assert');
const sinon = require('sinon');

import wurd from './';
import Store from './store';
import Block from './block';

const Wurd = wurd.Wurd;

const same = test.strictEqual;


global.localStorage = {
  getItem: sinon.fake.returns('{}'),
  setItem: sinon.fake(),
};


describe('Wurd', function() {
  afterEach(function() {
    sinon.restore();
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
      });

      // Set cached content
      client.store.rawContent = {
        lorem: { title: 'Lorem' },
        dolor: { title: 'Dolor' },
      };

      // Set uncached content
      sinon.stub(client, '_fetchSections').resolves({
        ipsum: { title: 'Ipsum' },
        amet: { title: 'Amet' }
      });

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
          test.deepEqual(content.get(), {
            lorem: { title: 'Lorem' },
            ipsum: { title: 'Ipsum' },
            dolor: { title: 'Dolor' },
            amet: { title: 'Amet' }
          });

          same(client._fetchSections.callCount, 1);
          test.deepEqual(client._fetchSections.args[0][0], ['ipsum', 'amet']);
          
          test.deepEqual(console.info.args, [
            ['Wurd: from cache:', ['lorem', 'dolor']],
            ['Wurd: from server:', ['ipsum', 'amet']],
          ]);

          done();
        }).catch(done);
    });

    it('does not fetch from server if all content is available', function (done) {
      client.load(['lorem', 'dolor'])
        .then(content => {
          test.deepEqual(content.get(), {
            lorem: { title: 'Lorem' },
            dolor: { title: 'Dolor' },
          });

          same(client._fetchSections.callCount, 0);
          
          test.deepEqual(console.info.args, [
            ['Wurd: from cache:', ['lorem', 'dolor']],
          ]);

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
  });


  describe('#_fetchSections()', function () {
    let client;

    beforeEach(function () {
      client = wurd.connect('myapp');

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
