/*
 *  A basic object to help handle organizing and interfacing with
 *  settings needed to make mongoose-fixture load things correctly.
 *
 */
module.exports = function(params){
    var that = {};
    
    that.mongoConnection = params.mongoConnection;
    
    /*
    * When setting path check if base path is set, if not then assume paths set for schema/data-fixture is abs
    * Returns a diction of
    * basePath
    * schemaPath
    * dataFixturePath
    */
    that.paths = function(paths){
        var local = {};
        // operations to check if base is set, if so then append it to all subpaths
        // if not set then assume schema/data are set directly
        if(paths.basePath === '' || paths.basePath === undefined){
            // if base isn't defined then user has defined abs paths in each
            local = paths;
        // if basepath is a defined string
        } else if(paths.basePath){
            local.basePath = paths.basePath;
            local.schemaPath = paths.basePath+paths.schemaPath;
            local.dataFixturePath = paths.basePath+paths.dataFixturePath;
        }

        return local;
    }(params.paths);
    
    /* 
     * in charge of binding the fixtureListings into the config object based on the idicated key reference
     */
    that.fixtureListings = function(){
        var local={};
        // going to store fixtures in this local key-obj store 
        local._fixtures = {};

        local.set = function(key, fixtures){
            
            // check if the fixture has paths set, if not use default paths
            local._fixtures[key] = [];
            var fixture = {};
            for (var i in fixtures){
                fixture = fixtures[i];
                
                // going to set our global paths if none are defined for the fixture
                if(fixture.schemaPath === undefined || fixture.schemaPath === ''){
                    fixture.schemaPath = that.paths.schemaPath;
                }
                if(fixture.dataFixturePath === undefined || fixture.dataFixturePath === ''){
                    fixture.dataFixturePath = that.paths.dataFixturePath;
                }
                
                // add fixture
                local._fixtures[key].push(fixture);
            }
        };

        local.get = function(key){
            return local._fixtures[key];
        };
        
        return local;
    }();

    return that;
};


