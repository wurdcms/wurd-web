const test = require('assert');
const sinon = require('sinon');

import wurd from './';
import Block from './block';

const Wurd = wurd.Wurd;

const same = test.strictEqual;


describe('Block', function() {
  afterEach(function() {
    sinon.restore();
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
    let liveWurd, draftWurd;

    beforeEach(function() {
      const rawContent = {
        a: {
          a: 'AA',
          b: {
            a: 'ABA',
            b: 'ABB'
          }
        }
      };

      liveWurd = new Wurd('live', {
        rawContent
      });

      draftWurd = new Wurd('draft', {
        draft: true, 
        rawContent
      });

      sinon.stub(console, 'warn');
    });

    describe('when item exists', function() {
      it('returns the content', function() {
        const liveBlock = new Block(liveWurd);
        const draftBlock = new Block(draftWurd);

        same(liveBlock.get('a.a'), 'AA');
        test.deepEqual(liveBlock.get('a.b'), { a: 'ABA', b: 'ABB' });

        same(draftBlock.get('a.a'), 'AA');
        test.deepEqual(draftBlock.get('a.b'), { a: 'ABA', b: 'ABB' });
      });

      it('returns the content for child blocks', function() {
        const liveBlock = new Block(liveWurd, 'a.b');
        const draftBlock = new Block(draftWurd, 'a.b');

        same(liveBlock.get('a'), 'ABA');
        same(liveBlock.get('b'), 'ABB');
        test.deepEqual(liveBlock.get(), { a: 'ABA', b: 'ABB' });

        same(draftBlock.get('a'), 'ABA');
        same(draftBlock.get('b'), 'ABB');
        test.deepEqual(draftBlock.get(), { a: 'ABA', b: 'ABB' });
      });
    });

    describe('when item is missing', function() {
      it('returns undefined', function() {
        const liveBlock = new Block(liveWurd, null);
        const draftBlock = new Block(draftWurd, null);

        same(liveBlock.get('a.foo'), undefined);
        same(draftBlock.get('a.foo'), undefined);
      });

      describe('in draft mode', function() {
        it('logs a warning if section has not been loaded');
      });
    });
  });


  describe('#text()', function() {
    let liveBlock, draftBlock;

    beforeEach(function() {
      const rawContent = {
        a: {
          a: 'AA',
          b: {
            a: 'ABA',
            b: 'ABB'
          },
          c: 'Hello {{name}}, today is {{day}}'
        }
      };

      liveBlock = new Block(new Wurd('live', {rawContent}), null);

      draftBlock = new Block(new Wurd('draft', {rawContent, draft: true}), null);

      sinon.stub(console, 'warn');
    });

    describe('when item exists', function() {
      it('returns the text content', function() {
        same(liveBlock.text('a.a'), 'AA');

        same(draftBlock.text('a.a'), 'AA');
      });
    });

    describe('when item is missing', function() {
      it('returns empty string in live mode', function() {
        same(liveBlock.text('a.foo'), '');
      });

      it('returns path in draft mode', function() {
        same(draftBlock.text('a.foo'), '[a.foo]');
      });
    });

    describe('when item is not text', function() {
      it('prints a warning to the console', function() {
        liveBlock.text('a.b');

        same(console.warn.callCount, 1);

        same(console.warn.args[0][0], 'Tried to get object as string: a.b');
      });

      it('returns empty string in live mode', function() {
        same(liveBlock.text('a.b'), '');
      });

      it('returns path in draft mode', function() {
        same(draftBlock.text('a.b'), '[a.b]');
      });
    });

    describe('with vars argument', function() {
      it('replaces {{mustache}} style placeholders with vars', function() {
        same(liveBlock.text('a.c', { name: 'John', day: 'Monday' }), 'Hello John, today is Monday');
        
        same(draftBlock.text('a.c', { name: 'John', day: 'Monday' }), 'Hello John, today is Monday');
      });
    });
  });


  describe('#markdown()', function() {
    const client = new Wurd('appname', {
      rawContent: {
        home: { title: 'Welcome *{{name}}*' }
      },
    });

    const block = new Block(client, null);

    it('parses markdown', function() {
      same(
        block.markdown('home.title', { name: 'Bob' }),
        '<p>Welcome <em>Bob</em></p>\n'
      );
    });

    it('accepts "inline" option', function() {
      same(
        block.markdown('home.title', { name: 'Bob' }, { inline: true }),
        'Welcome <em>Bob</em>'
      );
    });
  });


  describe('#map()', function() {

  });


  describe('#block()', function() {

  });

});
