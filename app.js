var express = require('express'),
    requireNew = require('require-new'),
    cors = require('cors'),
    app = express(),
    server = require('http').Server(app),
    bodyParser = require('body-parser'),
    basicAuth = require('basic-auth'),
     api = require('pokemon-go-node-api');
server.listen(8080);
// app.use(cors());
app.use(express.static(__dirname + '/public'));


app.all('*', function(req, res,next) {
    /**
     * Response settings
     * @type {Object}
     */
      var responseSettings = {
        "AccessControlAllowOrigin":'https://pogowatch.com';,
        "AccessControlAllowHeaders": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
        "AccessControlAllowMethods": "POST, GET, PUT, DELETE, OPTIONS",
        "AccessControlAllowCredentials": true
    };

    /**
     * Headers
     */
    res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
    res.header("Access-Control-Allow-Origin",  responseSettings.AccessControlAllowOrigin);
    res.header("Access-Control-Allow-Headers", (req.headers['access-control-request-headers']) ? req.headers['access-control-request-headers'] : "x-requested-with");
    res.header("Access-Control-Allow-Methods", (req.headers['access-control-request-method']) ? req.headers['access-control-request-method'] : responseSettings.AccessControlAllowMethods);

    
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }


});


app.get('/', function (req, res, next) {
 
  res.sendfile(__dirname + '/public');
  next();
});



// function unauthorized(res){
//   res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
//   return res.send(401);
// };


// app.get('/api/profile', function (req, res) {
    // var user = basicAuth(req);
    // if(!user || !user.name || !user.pass){
    //   return unauthorized(res);
    // }
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

app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// app.enable('trust proxy');
// app.set('trust proxy', 'loopback');


app.post('/api/account', function (req, res) {
    // var users = basicAuth(req);
    // if(!users || !users.name || !users.pass){
    //   return unauthorized(res);
    // }

    var responseSettings = {
        "AccessControlAllowOrigin":'https://pogowatch.com',
        "AccessControlAllowHeaders": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
        "AccessControlAllowMethods": "POST, GET, PUT, DELETE, OPTIONS",
        "AccessControlAllowCredentials": true
    };

    /**
     * Headers
     */
    res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
    res.header("Access-Control-Allow-Origin",  responseSettings.AccessControlAllowOrigin);
    res.header("Access-Control-Allow-Headers", (req.headers['access-control-request-headers']) ? req.headers['access-control-request-headers'] : "x-requested-with");
    res.header("Access-Control-Allow-Methods", (req.headers['access-control-request-method']) ? req.headers['access-control-request-method'] : responseSettings.AccessControlAllowMethods);



  var user = req.body.username, pass = req.body.password, loc = req.body.loc, auth = req.body.auth;

    var a = new api.Pokeio();

    var location = {
    type: 'coords',
    coords: {
    longitude: Number(loc.longitude),
    latitude: Number(loc.latitude),
    altitude: 0
    }

};


    a.init(user, pass, location, auth, function(err) {
    if (err) throw err;

    console.log('1[i] Current location: ' + a.playerInfo.locationName);
    console.log('1[i] lat/long/alt: : ' + a.playerInfo.latitude + ' ' + a.playerInfo.longitude + ' ' + a.playerInfo.altitude);

    a.GetProfile(function(err, profile, profiledetails) {
        if (err) throw err;

        console.log('1[i] Username: ' + profile.username);
        console.log('1[i] Poke Storage: ' + profile.poke_storage);
        console.log('1[i] Item Storage: ' + profile.item_storage);

        res.send({ "username": profile.username, "storage": profile.poke_storage, "istorage": profile.item_storage, "stardust": profile.currency[1].amount, "pokecoins": profile.currency[0].amount, "player": profiledetails});

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








