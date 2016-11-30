var request = require('request');
var fs = require('fs');

request('https://nomadlist.com/api/v2/list/cities', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var json = JSON.parse(body);
    var cityNames = json.result.map(function(item){
        return item.info.city.name;
    });
        
    fs.writeFile("cityNames.txt", cityNames.join('\n'), function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });    
  }
});