'use strict';

describe('artApp.version module', function() {
  beforeEach(module('artApp.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
