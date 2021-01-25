const test = require('assert');
const same = test.strictEqual;

import { replaceVars } from './utils';



describe('utils', function() {
  describe('#replaceVars()', function() {
    it('replaces {{mustache}} style vars', function() {
      same(replaceVars('Hello {{name}}!', { name: 'Bob' }), 'Hello Bob!');
    });
  });
});
