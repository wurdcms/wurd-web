const test = require('assert');
const sinon = require('sinon');
const wurd = require('./');
const Wurd = wurd.Wurd;

const same = test.strictEqual;


describe('Wurd', function() {
  afterEach(function() {
    sinon.restore();
  });


  /*describe('#get()', function() {
    let wurdLive;
    let wurdDraft;

    beforeEach(function() {
      let content = {
        a: {
          a: 'AA',
          b: {
            a: 'ABA',
            b: 'ABB'
          }
        }
      };

      wurdLive = new Wurd();
      wurdLive.content = content;

      wurdDraft = new Wurd();
      wurdDraft.draft = true;
      wurdDraft.content = content;

      sinon.stub(console, 'warn');
    });

    describe('when item exists', function() {
      it('returns the content', function() {
        same(wurdLive.get('a.a'), 'AA');
        test.deepEqual(wurdLive.get('a.b'), { a: 'ABA', b: 'ABB' });

        same(wurdDraft.get('a.a'), 'AA');
        test.deepEqual(wurdDraft.get('a.b'), { a: 'ABA', b: 'ABB' });
      });
    });

    describe('when item is missing', function() {
      it('returns undefined', function() {
        same(wurdLive.get('a.foo'), undefined);
        same(wurdDraft.get('a.foo'), undefined);
      });
    });
  });


  describe('#text()', function() {
    let wurdLive;
    let wurdDraft;

    beforeEach(function() {
      let content = {
        a: {
          a: 'AA',
          b: {
            a: 'ABA',
            b: 'ABB'
          },
          c: 'Hello {{name}}, today is {{day}}'
        }
      };

      wurdLive = new Wurd();
      wurdLive.content = content;

      wurdDraft = new Wurd();
      wurdDraft.draft = true;
      wurdDraft.content = content;

      sinon.stub(console, 'warn');
    });

    describe('when item exists', function() {
      it('returns the text content', function() {
        same(wurdLive.text('a.a'), 'AA');

        same(wurdDraft.text('a.a'), 'AA');
      });
    });

    describe('when item is missing', function() {
      it('returns empty string in live mode', function() {
        same(wurdLive.text('a.foo'), '');
      });

      it('returns path in draft mode', function() {
        same(wurdDraft.text('a.foo'), '[a.foo]');
      });
    });

    describe('when item is not text', function() {
      it('prints a warning to the console', function() {
        wurdLive.text('a.b');

        same(console.warn.callCount, 1);

        same(console.warn.args[0][0], 'Tried to get object as string: a.b');
      });

      it('returns empty string in live mode', function() {
        same(wurdLive.text('a.b'), '');
      });

      it('returns path in draft mode', function() {
        same(wurdDraft.text('a.b'), '[a.b]');
      });
    });

    describe('with vars argument', function() {
      it('replaces {{mustache}} style placeholders with vars', function() {
        same(wurdLive.text('a.c', { name: 'John', day: 'Monday' }), 'Hello John, today is Monday');
        
        same(wurdDraft.text('a.c', { name: 'John', day: 'Monday' }), 'Hello John, today is Monday');
      });
    });
  });*/

});
