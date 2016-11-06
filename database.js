( function () {
    "use strict";
    var config = {database:{
        "db":'dvae7kprug2ic',
        "username":'rhbqgfvvastkht',
        "password": 'xobPuWVbMSsHTcN0ar87e2SeJx',
        "host": 'ec2-54-243-208-195.compute-1.amazonaws.com',
        "port":5432,
        "dialect":'postgres'
    }
  };
  var Sequelize = require('sequelize');
  //-------Sequelize Configuration-------------------
  var sequelize = new Sequelize(config.database.db ,config.database.username ,config.database.password , {
       host: config.database.host,
       port:config.database.port,
       dialectOptions: {
        ssl: true
      },
      dialect:config.database.dialect,
      pool:{max:6,min:0,idle:10000}
  });
  

//------ MODEL DEFINITIONS---------------
//No models to be loaded since we're performing raw Geospatial queries
//------END OF MODEL DEFINITIONS---------------

    var apis = {};
    sequelize.sync({force:false}).then(function(){
        require('./apis')(sequelize, apis);
    });

  //--------------
  module.exports = {
    api:apis
  };
})()
