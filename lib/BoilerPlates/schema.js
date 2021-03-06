/*
 *  File: __schemaFileName__
 *  Type: Schema
 *  Generated by: Mongoose-Fixture (v__version__)
 *
 *
 */

module.exports = function(mongoose, conn){

    var exportSchema = mongoose.Schema({
        /*
           this is an example, fillin with
           your own schema data
           NOTE: `id` was excluded, by default mongoose
           will use the standard mongo ObjectID so only
           define an `id` if you wish to override mongos default
        */
        name:{type:String},
        tags:{type:Array},
        score:{type:Number}
    });

    // mongoose-fixture schemas return this consumable format
    // which allows for you to easily register your models
    // into mongoose/conn
    return {name:'__schemaName__', schema:exportSchema};
};
