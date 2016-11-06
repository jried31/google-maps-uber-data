/*
API: Taxi.js 
Definition: Middle layer interface that performs the Geospatial SQL data queries, given the parameters passed in from the web service layer. The database connector logic is wrapped in this level only
*/

module.exports = function(sequelize,api){
   var Taxi = {
      find:function(polylines, dateStart,dateEnd){
          
    	return new Promise(function(resolve, reject){
    	    
    	    var queryString = "SELECT pickup_time, lat_pickup,lon_pickup,lat_dropoff,lon_dropoff FROM \"Taxi\" WHERE pickup_time >= '" + dateStart + "' AND pickup_time <= '" + dateEnd + "'"
    	    if(polylines !== undefined && polylines.length > 0){
    	        queryString += " AND ST_Within(pickup_point::geometry, ST_GeomFromText('POLYGON(("+ polylines + "))',4326))";
    	    }
    	    //queryString += " LIMIT 1000;"
            sequelize.query(queryString, { type: sequelize.QueryTypes.SELECT}).then(function(data) {
                resolve(data);
            }).catch(function(error){
                reject(error);
            });
    	});
      }
   };
   api.Taxi = Taxi;
}
