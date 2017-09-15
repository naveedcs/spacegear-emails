const Shopify = require('shopify-api-node');
const shopify = new Shopify({
  shopName: 'nasagear',
  apiKey: '5a9a81bd80b36a252883208e0760b6ab',
  password: '4013c702b6cbc1beb1e1741207dd255f'
});

const _ = require('lodash');

let checkoutToken = '9070b0c38379b0897048153a87e215f9';
let bigCheckout = new Object();

shopify.checkout.list()
  .then((checkouts) => {
    let ourCheckout = _.find(checkouts, ['token', checkoutToken]);
    bigCheckout = ourCheckout;
    let ids = '';
    _.forEach(ourCheckout.line_items, (item) => {
      ids += item.product_id + ',';
    })

    return shopify.product.list({ ids });
  })
  .then((products) => {
    bigCheckout.line_items = _.unionBy(bigCheckout.line_items, products, "product_id");
    console.log(bigCheckout);
  })
  .catch((err) => {
    console.log('ERR: ', err);
  })

