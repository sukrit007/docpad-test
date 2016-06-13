/* global describe */

//BDD
//Using describe and should

//This is a fake test. Please remove.
describe('main.js', function(){
  describe('when it loads,', function(){
    it('should set the global variable "site"', function(){
      window.site.should.not.equal(undefined);
    });
  });
});