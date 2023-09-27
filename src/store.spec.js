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
        ttl: 10_000,
      });
    });

    it('loads from localStorage into the memory store', function () {
      global.localStorage.getItem.withArgs('customKey').returns(JSON.stringify({
        a: { a: 'AA' },
        b: { a: 'BA' },
        c: { a: 'CA' },
        _wurd: {
          savedAt: Date.now() - 9_000, // Not expired yet
        },
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

    it('returns all content if localStorage has expired and add _expired flag', function () {
      global.localStorage.getItem.returns(JSON.stringify({
        b: { a: 'BA' },
        _wurd: {
          savedAt: new Date() - 11_000, // expired
        },
      }));

      test.deepEqual(store.load(), {
        a: { a: 'AA' },
        b: { a: 'BA' },
        _expired: true,
      });
    });

    describe('with lang option', function () {
      it('returns memory content if localStorage is in a different language', function () {
        global.localStorage.getItem.returns(JSON.stringify({
          b: { a: 'BA' },
          _wurd: {
            lang: 'es',
            savedAt: new Date(),
          },
        }));
  
        test.deepEqual(store.load([], { lang: 'en' }), {
          a: { a: 'AA' },
        });
      });

      it('loads from localStorage if in the correct language', function () {
        global.localStorage.getItem.returns(JSON.stringify({
          b: { a: 'BA' },
          _wurd: {
            lang: 'es',
            savedAt: new Date(),
          },
        }));
  
        test.deepEqual(store.load([], { lang: 'es' }), {
          a: { a: 'AA' },
          b: { a: 'BA' },
        });
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
        ttl: 360000,
      });

      sinon.useFakeTimers(1234);
    });

    it('updates the content', function () {
      store.save({
        a: { a: 'AA2', b: 'AB2' },
        c: { a: 'CA2', b: 'CB2' },
      }, { lang: 'es' });

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
        _wurd: {
          savedAt: 1234, // sinon.fakeTimer value
          lang: 'es',
        },
      }));
    });
  });

});
