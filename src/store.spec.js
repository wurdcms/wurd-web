const test = require('assert');
const sinon = require('sinon');

import wurd from './';
import Store from './store';

const Wurd = wurd.Wurd;

const same = test.strictEqual;

global.localStorage = {
  setItem: sinon.stub(),
  getItem: sinon.stub().returns('{}'),
};


describe('store', function() {
  afterEach(sinon.restore);


  describe('#get()', function() {
    const store = new Store({
      main: {
        a: 'A',
        b: {
          a: 'BA',
          b: 'BB',
        },
        c: {
          a: {
            a: 'CAA',
          },
        },
      }
    });

    it('returns nested values', function() {
      test.deepEqual(store.get('main'), {
        a: 'A',
        b: {
          a: 'BA',
          b: 'BB',
        },
        c: {
          a: {
            a: 'CAA',
          },
        },
      });
      
      same(store.get('main.a'), 'A');

      test.deepEqual(store.get('main.b'), { a: 'BA', b: 'BB' });
      same(store.get('main.b.a'), 'BA');
      same(store.get('main.b.b'), 'BB');

      test.deepEqual(store.get('main.c'), { a: { a: 'CAA' } });
    });

    it('returns undefined for invalid values', function () {
      same(store.get('main.z.a'), undefined);
    });

    /* it('returns whole content without a path', function () {
      same(store.get(), {

      });
    }); */
  });


  describe('#loadSections()', function () {
    const store = new Store({
      a: { a: 'AA' },
    }, {
      storageKey: 'customKey',
    });

    it('loads from localStorage into the memory store', function () {
      const expiry = Date.now() + 1000;

      global.localStorage.getItem.returns(JSON.stringify({
        a: { a: 'AA' },
        b: { a: 'BA' },
        c: { a: 'CA' },
        _expiry: expiry,
      }));

      // Returns the content
      test.deepEqual(store.loadSections(), {
        a: { a: 'AA' },
        b: { a: 'BA' },
        c: { a: 'CA' },
      });

      // Loads to store for use by get()
      test.deepEqual(store.rawContent, {
        a: { a: 'AA' },
        b: { a: 'BA' },
        c: { a: 'CA' },
      });
    });
  });


  describe('#saveSections()', function () {
    let store;

    beforeEach(function () {
      store = new Store({
        a: { a: 'AA' },
        b: { a: 'BA' },
        c: { a: 'CA' },
      });
    });

    it('updates the content', function () {
      store.saveSections({
        a: { a: 'AA2', b: 'AB2' },
        c: { a: 'CA2', b: 'CB2' },
      });

      test.deepEqual(store.rawContent, {
        a: { a: 'AA2', b: 'AB2' },
        b: { a: 'BA' },
        c: { a: 'CA2', b: 'CB2' },
      });
    });
  });

});
