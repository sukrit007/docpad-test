(function (site) {
  'use strict';

  // site is the exposed global variable.
  // Other modules should extend the varible

  $('html').removeClass('no-js');

  site.fakeTestValue = 'fake test value';

  console.log(site);

})(window.site = window.site || {});
