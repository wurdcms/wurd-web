const test = require('assert');
const sinon = require('sinon');
const wurd = require('./');
const Wurd = wurd.Wurd;

const same = test.strictEqual;


describe('Wurd', function() {
  beforeEach(function() {
    this.sinon = sinon.sandbox.create();
  });

  afterEach(function() {
    this.sinon.restore();
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

      same(client.appName, 'appname');
      same(client.draft, false);
      same(client.editMode, false);
      same(client.debug, undefined);
      test.deepEqual(client.content, {});
    });

    describe('with options', function() {
      
    });
  });


  describe('#get()', function() {
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

      this.sinon.stub(console, 'warn');
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
      describe('without backup content', function() {
        it('returns undefined in live mode', function() {
          same(wurdLive.get('a.foo'), undefined);
        });

        it('returns path in draft mode', function() {
          same(wurdDraft.get('a.foo'), '[a.foo]');
        });
      });

      describe('with backup content', function() {
        it('returns the backup content', function() {
          same(wurdLive.get('a.foo', 'Lorem ipsum'), 'Lorem ipsum');

          same(wurdDraft.get('a.foo', 'Lorem ipsum'), 'Lorem ipsum');
        });
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
          }
        }
      };

      wurdLive = new Wurd();
      wurdLive.content = content;

      wurdDraft = new Wurd();
      wurdDraft.draft = true;
      wurdDraft.content = content;

      this.sinon.stub(console, 'warn');
    });

    describe('when item exists', function() {
      it('returns the text content', function() {
        same(wurdLive.text('a.a'), 'AA');

        same(wurdDraft.text('a.a'), 'AA');
      });
    });

    describe('when item is missing', function() {
      describe('without backup content', function() {
        it('returns empty string in live mode', function() {
          same(wurdLive.text('a.foo'), '');
        });

        it('returns path in draft mode', function() {
          same(wurdDraft.text('a.foo'), '[a.foo]');
        });
      });

      describe('with backup content', function() {
        it('returns the backup content', function() {
          same(wurdLive.text('a.foo', 'Lorem ipsum'), 'Lorem ipsum');

          same(wurdDraft.text('a.foo', 'Lorem ipsum'), 'Lorem ipsum');
        });
      });
    });

    describe('when item is not text', function() {
      it('prints a warning to the console', function() {
        wurdLive.text('a.b');

        same(console.warn.callCount, 1);

        same(console.warn.args[0][0], 'Tried to get object as string: a.b');
      });

      describe('without backup content', function() {
        it('returns empty string in live mode', function() {
          same(wurdLive.text('a.b'), '');
        });

        it('returns path in draft mode', function() {
          same(wurdDraft.text('a.b'), '[a.b]');
        });
      });

      describe('with backup content', function() {
        it('returns backup content', function() {
          same(wurdLive.text('a.b', 'Lorem ipsum'), 'Lorem ipsum');

          same(wurdDraft.text('a.b', 'Lorem ipsum'), 'Lorem ipsum');
        });
      });
    });
  });

});
