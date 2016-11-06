/*
Aggreagates all data source interface methods into one object
interface file that compiles all API accessors used to interface with the database backend
*/
/*
Aggreagates all data base handler objects, assuming the create, update, find, delete, etc. operations would be generally defined at the data source level with a certain prefix
eg: /taxi/find, /taxi/create, etc
*/
module.exports = function(sequelize, api) {
   if(!api)return;

    var fs = require('fs');
    fs.readdirSync(__dirname).forEach(function(file) {
        if (file === "index.js" || file.substr(file.lastIndexOf('.') + 1) !== 'js')
            return;
        var name = file.substr(0, file.indexOf('.'));
        require('./' + name)(sequelize, api);
    });
}
