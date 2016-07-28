var express = require('express'),
    requireNew = require('require-new'),
    app = express(),
    server = require('http').Server(app),
    bodyParser = require('body-parser'),
    basicAuth = require('basic-auth'),
     api = require('pokemon-go-node-api');
server.listen(8080);
app.use(express.static(__dirname + '/public'));


app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public');
});


function unauthorized(res){
  res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
  return res.send(401);
};


// app.get('/api/profile', function (req, res) {
//     var user = basicAuth(req);
//     if(!user || !user.name || !user.pass){
//       return unauthorized(res);
//     }
//     var api = requireNew('pokemon-go-node-api');
//     api.GetAccessToken(user.name, user.pass, function(err, token) {
//         if(err){
//           res.send(err);
//           return null;
//         }
//       api.GetApiEndpoint(function(err, api_endpoint) {
//           if (err){
//             console.log(err);
//             res.send({"error": "RPC server offline"})
//             return null;
//           };

//           api.GetProfile(function(err, profile) {
//               if (err) console.log(err);
//               res.send({"token": token, "endpoint": api_endpoint, "username": profile.username, "storage": profile.poke_storage, "istorage": profile.item_storage, "stardust": profile.currency[1].amount, "pokecoins": profile.currency[0].amount});
//               if (profile.currency[0].amount == null) {
//                   var poke = 0
//               } else {
//                   var poke = profile.currency[0].amount
//               }
//           })
//       });
//     });
// });


// app.get('/api/gettoken', function (req, res) {
//   var user = basicAuth(req);
//   if(!user || !user.name || !user.pass){
//     return unauthorized(res);
//   }
//   var api = requireNew('pokemon-go-node-api');
//   api.GetAccessToken(user.name, user.pass, function(err, token) {
//     res.send({"token": token});
//   });
// });


app.get('/api/account', function (req, res) {
    var user = basicAuth(req);
    if(!user || !user.name || !user.pass){
      return unauthorized(res);
    }

    var a = new api.Pokeio();

    var location1 = {
    type: 'name',
    name:'Times Square'
};

    a.init(user.name, user.pass, location1, "google", function(err) {
    if (err) throw err;

    console.log('1[i] Current location: ' + a.playerInfo.locationName);
    console.log('1[i] lat/long/alt: : ' + a.playerInfo.latitude + ' ' + a.playerInfo.longitude + ' ' + a.playerInfo.altitude);

    a.GetProfile(function(err, profile) {
        if (err) throw err;

        console.log('1[i] Username: ' + profile.username);
        console.log('1[i] Poke Storage: ' + profile.poke_storage);
        console.log('1[i] Item Storage: ' + profile.item_storage);

        res.sendStatus(200,{ "username": profile.username, "storage": profile.poke_storage, "istorage": profile.item_storage, "stardust": profile.currency[1].amount, "pokecoins": profile.currency[0].amount});

        var poke = 0;
        if (profile.currency[0].amount) {
            poke = profile.currency[0].amount;
        }

        console.log('1[i] Pokecoin: ' + poke);
        console.log('1[i] Stardust: ' + profile.currency[1].amount);

    });
});



    // api.init(user.name, user.pass, "Times Square", "google", function(err) {
    //     if(err){
    //       res.send(err);
    //       return null;
    //     }
      // api.GetApiEndpoint(function(err, api_endpoint) {
      //     if (err){
      //       console.log(err);
      //       res.send({"error": "RPC server offline"})
      //       return null;
      //     };

          // api.GetProfile(function(err, profile) {
          //     if (err) console.log(err);
          //     res.send({ "username": profile.username, "storage": profile.poke_storage, "istorage": profile.item_storage, "stardust": profile.currency[1].amount, "pokecoins": profile.currency[0].amount});
          //     if (profile.currency[0].amount == null) {
          //         var poke = 0
          //     } else {
          //         var poke = profile.currency[0].amount
          //     }
          // });
      // });
    // });
});








