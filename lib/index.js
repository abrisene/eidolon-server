/*
 # index.js
 # App Index
 */

/**
 # Module Dependencies
 */

const config = require('./configs');
const server = require('./server');

const models = require('./models');
const { user } = require('./mail');


/**
 # Main
 */

const main = async () => {
  try {
    await config.init();
    await server();


    /*const p = new models.Product({
      name: 'Eidolon Test Product B',
      type: 'good',
    });

    await p.save();

    const s = await p.addSKU({
      price: 499
    });

    await s.save();

    console.log(p);*/

/*    setTimeout(async () => {
      p.name = 'Eidolon Test Product B v2';
      await p.save();
      console.log('P UPDATE');
    }, 5 * 1000);*/

    /*setTimeout(async () => {
      s.price = 9999;
      await s.save();
      console.log('S UPDATE');
    }, 30 * 1000);

    setTimeout(async () => {
      await s.remove();
      console.log('S REMOVE');
    }, 50 * 1000);

    setTimeout(async () => {
      await p.remove();
      console.log('P REMOVE');
    }, 60 * 1000);*/

    /*const products = await models.Product.find({});
    console.log(products);
    products.forEach(p => p.remove());*/

  } catch(err) {
    console.error(err);
  }
};

main();
