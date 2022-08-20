const test = require('assert');
const sinon = require('sinon');

import wurd from './';
import Store from './store';

const Wurd = wurd.Wurd;

const same = test.strictEqual;


describe('store', function() {
  let originalLocalStorage;

  beforeEach(function() {
    originalLocalStorage = global.localStorage;

    global.localStorage = {
      setItem: sinon.stub(),
      getItem: sinon.stub().returns('{}'),
    };
  });

  afterEach(function() {
    sinon.restore();

    global.localStorage = originalLocalStorage;
  });


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


  describe('#load()', function () {
    let store;

    beforeEach(function (){
      store = new Store({
        a: { a: 'AA' },
      }, {
        storageKey: 'customKey',
      });
    });

    it('loads from localStorage into the memory store', function () {
      const expiry = Date.now() + 1000;

      global.localStorage.getItem.withArgs('customKey').returns(JSON.stringify({
        a: { a: 'AA' },
        b: { a: 'BA' },
        c: { a: 'CA' },
        _expiry: expiry,
      }));

      // Returns the content
      test.deepEqual(store.load(), {
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

    it('returns memory content if there is no localStorage', function () {
      global.localStorage.getItem.returns('{}');

      test.deepEqual(store.load(), {
        a: { a: 'AA' },
      });
    });

    it('returns memory content if localStorage has expired', function () {
      global.localStorage.getItem.returns(JSON.stringify({
        b: { a: 'BA' },
        _expiry: new Date() - 10000,
      }));

      test.deepEqual(store.load(), {
        a: { a: 'AA' },
      });
    });
  });


  describe('#save()', function () {
    let store;

    beforeEach(function () {
      store = new Store({
        a: { a: 'AA' },
        b: { a: 'BA' },
        c: { a: 'CA' },
      }, {
        storageKey: 'customKey',
        maxAge: 360000,
      });

      sinon.useFakeTimers(1234);
    });

    it('updates the content', function () {
      store.save({
        a: { a: 'AA2', b: 'AB2' },
        c: { a: 'CA2', b: 'CB2' },
      });

      test.deepEqual(store.rawContent, {
        a: { a: 'AA2', b: 'AB2' },
        b: { a: 'BA' },
        c: { a: 'CA2', b: 'CB2' },
      });

      same(global.localStorage.setItem.callCount, 1);
      same(global.localStorage.setItem.args[0][0], 'customKey');
      same(global.localStorage.setItem.args[0][1], JSON.stringify({
        a: { a: 'AA2', b: 'AB2' },
        b: { a: 'BA' },
        c: { a: 'CA2', b: 'CB2' },
        _expiry: 361234, // maxAge + sinon.fakeTimer value
      }));
    });
  });

});
