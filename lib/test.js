'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TestClass = function TestClass() {
  _classCallCheck(this, TestClass);

  this.x = 5;
  console.log('INSTANTIATE TEST');
};

var test = module.exports = exports = new TestClass();