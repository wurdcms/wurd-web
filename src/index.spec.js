const test = require('assert');
const sinon = require('sinon');

const wurd = require('./');
const Wurd = wurd.Wurd;
const Store = require('./store');
const Block = require('./block');

const same = test.strictEqual;


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

});
