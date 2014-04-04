/*
 *  File: ProductsUpdateMock.js
 *  Generated by: Mongoose-Fixture (v0.2.0)
 *
 */

var async = require('async');

// @callback must be returned
// expects (err, object)
// object can be an array of data-documents, or a kwarg['dataFixtures']
module.exports = function(mongoose, conn, rootCallback){

    // standard callback error
    var error = null;

    // create your data documents using object-literals
    var fixture = [];

    // load model
    var productModel = conn.model('Product');
    var updateStub = productModel.findOne({name:'StubName'});
    async.series([
         // load product
        function(callback){
            updateStub.exec(function(err, product){
                return callback(null, product);
            });
        }
    //////////
    // End series, invoke callback
    //////////
    ], function(err, results){
        // way series is called each callback iteration stores in an array
        // for this example only one item so access at [0]
        if(results.length > 0 && results[0] !== null){
            var product = results[0];
            product.name='ReplacedTestPass';
            return rootCallback(err, [product], 'update');
        } else {
            console.log('Error loading data, skipping update [',__filename,']');
        }
    });
};
