/*
Aggreagates all web service end points (ie: routes) assuming the routes would be split into multiple files for organization.
Typically web service endpoints are defined in multiple files that represent the objects they interact with 
 
eg: /taxi/find which is defined in Taxi.js, ... or other files that may be added such as for instance Driver.js and containing the web API's for /driver/create, /driver/find, etc (if it were defined)
*/

module.exports = function(app, apis) {
   if(!app)return;

    var fs = require('fs');

    fs.readdirSync(__dirname).forEach(function(file) {
        if (file === "index.js" || file.substr(file.lastIndexOf('.') + 1) !== 'js')
            return;
        var name = file.substr(0, file.indexOf('.'));
        require('./' + name)(app, apis);
    });
}
