/* global describe, it, before */

import chai from 'chai';
import test from 'assert';
import wurd from '../lib/wurd.js';

chai.expect();

const expect = chai.expect;

let lib;

/*describe('Given an instance of my library',  () => {
  before(() => {
    lib = new Library();
  });
  describe('when I need the name', () => {
    it('should return the name', () => {
      expect(lib.name).to.be.equal('Library');
    });
  });
});*/

describe('connect', function() {
  it('returns a client', function() {
    let client = wurd.connect('appname');

    test.ok(client.load);
    test.ok(client.startEditor);
    test.ok(client.get);
  });
});