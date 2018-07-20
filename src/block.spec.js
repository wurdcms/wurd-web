const test = require('assert');
const sinon = require('sinon');

const Block = require('./block');
//const Wurd = wurd.Wurd;

const same = test.strictEqual;


describe('Wurd', function() {
  afterEach(function() {
    sinon.restore();
  });


  describe('#get()', function() {
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

      this.liveBlock = new Block('live', null, content);

      this.draftBlock = new Block('draft', null, content, {
        draft: true
      });

      sinon.stub(console, 'warn');
    });

    describe('when item exists', function() {
      it('returns the content', function() {
        const {liveBlock, draftBlock} = this;

        same(liveBlock.get('a.a'), 'AA');
        test.deepEqual(liveBlock.get('a.b'), { a: 'ABA', b: 'ABB' });

        same(draftBlock.get('a.a'), 'AA');
        test.deepEqual(draftBlock.get('a.b'), { a: 'ABA', b: 'ABB' });
      });
    });

    describe('when item is missing', function() {
      it('returns undefined', function() {
        const {liveBlock, draftBlock} = this;

        same(liveBlock.get('a.foo'), undefined);
        same(draftBlock.get('a.foo'), undefined);
      });
    });
  });


  describe('#text()', function() {
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

      this.liveBlock = new Block('live', null, content);

      this.draftBlock = new Block('draft', null, content, {
        draft: true
      });

      sinon.stub(console, 'warn');
    });

    describe('when item exists', function() {
      it('returns the text content', function() {
        const {liveBlock, draftBlock} = this;

        same(liveBlock.text('a.a'), 'AA');

        same(draftBlock.text('a.a'), 'AA');
      });
    });

    describe('when item is missing', function() {
      it('returns empty string in live mode', function() {
        const {liveBlock} = this;

        same(liveBlock.text('a.foo'), '');
      });

      it('returns path in draft mode', function() {
        const {draftBlock} = this;

        same(draftBlock.text('a.foo'), '[a.foo]');
      });
    });

    describe('when item is not text', function() {
      it('prints a warning to the console', function() {
        const {liveBlock} = this;

        liveBlock.text('a.b');

        same(console.warn.callCount, 1);

        same(console.warn.args[0][0], 'Tried to get object as string: a.b');
      });

      it('returns empty string in live mode', function() {
        const {liveBlock} = this;

        same(liveBlock.text('a.b'), '');
      });

      it('returns path in draft mode', function() {
        const {draftBlock} = this;

        same(draftBlock.text('a.b'), '[a.b]');
      });
    });

    describe('with vars argument', function() {
      it('replaces {{mustache}} style placeholders with vars', function() {
        const {liveBlock, draftBlock} = this;

        same(liveBlock.text('a.c', { name: 'John', day: 'Monday' }), 'Hello John, today is Monday');
        
        same(draftBlock.text('a.c', { name: 'John', day: 'Monday' }), 'Hello John, today is Monday');
      });
    });
  });

});
