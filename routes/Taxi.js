/*
API: Taxi.js 
Definition: 
Defines web service end points. Only one's defined in this example. 
eg: /taxi/find endpoint
*/
module.exports = function(app, database){
    var routePrefix = '/rides'; 
    var messages = require(__dirname + '/../messages.js');
    
    function getTimesByTod(tod){
        var times;
        switch (tod) {
            case 'day':
                times={start:"08:00:00", end:"19:00:00"}
                break;
            case 'night':
                times={start:"19:01:00",end:"23:59:00"}
                break;
            default:
                times={start:"00:00:00", end:"23:59:00"}
        }
        return times;
    }
    
    app.post(routePrefix + "/find", function(req, res){
        var data = req.body;
        if(!data){
            res.status(200).json({code:422,errors:[{message:messages.noData}]});
            return;
        }
        
        var polylines = data.polylines;
        var dateStart = data.dateStart;
        var dateEnd = data.dateEnd;
        var tod = getTimesByTod(data.tod);
        
        database.api.Taxi.find(polylines, (dateStart + " " + tod.start), (dateEnd  + " " + tod.end)).then(function(result){
            if(result === null || result === undefined){
                res.status(200).json({code:9,errors:[{message:messages.object.findError}]});
                return;
            }
            
    		res.json({data:result});
        }).catch(function(err){
            if(err !== null){
                  res.status(200).json({code:9,errors:[{message:messages.object.actionError}]});
                  return;
            }
        });
    });
}
