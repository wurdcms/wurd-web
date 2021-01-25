const test = require('assert');
const same = test.strictEqual;

import { replaceVars } from './utils';



describe('utils', function() {
  describe('#replaceVars()', function() {
    it('returns if not passed a string', function () {
      same(replaceVars(null), null);
      same(replaceVars(undefined), undefined);
      same(replaceVars(1), 1);
      test.deepEqual(replaceVars({ foo: 'bar' }), { foo: 'bar' });
    });

    it('replaces {{mustache}} style vars', function () {
      same(replaceVars('Hello {{name}}!', { name: 'Bob' }), 'Hello Bob!');
    });

    it('removes placeholders without a valuee', function () {
      const result = replaceVars('Hello {{firstName}} {{lastName}}!', {
        firstName: undefined,
        lastName: 'Smith',
      });

      same(result, 'Hello  Smith!');
    });
  });
});
