'use strict';

const nunjucks = require('nunjucks');
nunjucks.configure('templates', { autoescape: true });

const Shopify = require('shopify-api-node');
const shopify = new Shopify({
  shopName: 'nasagear',
  apiKey: '5a9a81bd80b36a252883208e0760b6ab',
  password: '4013c702b6cbc1beb1e1741207dd255f'
});

const _ = require('lodash');

module.exports.cart = (event, context, callback) => {

  let checkoutToken = event.pathParameters.cartId;
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
      bigCheckout.line_items = _.zipWith(products, bigCheckout.line_items, (detail, basic) => {
        basic.body_html = detail.body_html;
        basic.images = detail.images;
        basic.image = detail.image;
        return basic;
      });
      console.log(JSON.stringify(bigCheckout));
      nunjucks.render('abandon-one.njk', bigCheckout, (err, render) => {
        if (err) {
          console.log(err);
        }

        let response = {
          statusCode: 200,
          headers: {
            'Content-Type': 'text/html'
          },
          body: render
        }

        callback(null, response);
      })
    })
    .catch((err) => {
      console.log('ERR: ', err);
    });


  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
