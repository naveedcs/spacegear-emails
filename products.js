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

module.exports.recent = (event, context, callback) => {

  var d = new Date();
  d.setMonth(d.getMonth() - 2);
  let recentProps = {
    published_at_min: d.toISOString(),
    published_status: 'published'
  }

  let recentProducts;

  shopify.product.list(recentProps)
    .then((products) => {

      let sortedProducts = {
        products: _.sortBy(products, ['published_at'])
      };
      console.log(JSON.stringify(sortedProducts));

      nunjucks.render('recent-products.njk', sortedProducts, (err, render) => {
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

    });



  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
