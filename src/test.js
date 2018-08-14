
class TestClass {
  constructor() {
    this.x = 5;
    console.log('INSTANTIATE TEST');
  }
}

var test = module.exports = exports = new TestClass;
