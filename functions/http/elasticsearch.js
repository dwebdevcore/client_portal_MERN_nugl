// https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/quick-start.html
// https://github.com/firebase/functions-samples/blob/master/authorized-https-endpoint/functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const elasticsearch = require("elasticsearch");
const cors = require("cors")({ origin: true });

var log = console.log.bind(console);

var esConfig = {
  httpAuth: `${functions.config().elasticsearch.username}:${
    functions.config().elasticsearch.password
  }`, //"user:q8zwa369Fuf5",
  host: functions.config().elasticsearch.url, //"http://35.224.63.148/elasticsearch",
  log: "trace"
};

// prod
esConfig = {
  httpAuth: "user:q8zwa369Fuf5",
  host: "http://35.224.63.148/elasticsearch",
  log: "trace"
};

// dev
/*
esConfig = {
  httpAuth: "user:LukgcP4Wivj6",
  host: "http://35.193.170.13/elasticsearch",
  log: "trace"
};*/

var client = new elasticsearch.Client(esConfig);

const app = express();

const authenticate = (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    res.status(403).send("Unauthorized");
    return;
  }
  const idToken = req.headers.authorization.split("Bearer ")[1];
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedIdToken => {
      req.user = decodedIdToken;
      return next();
    })
    .catch(error => {
      res.status(403).send("Unauthorized");
    });
};

app.use(cors);

// GET /elasticsearch/suggest?q={string}
app.get("/suggest", (req, res) => {
  const q = req.query.q;
  console.log("incoming elasticsearch suggest search", q);
  return client
    .search({
      index: "listings",
      type: "listing",
      size: 10,
      from: 0,
      body: {
        _source: ["location"],
        suggest: {
          dispensaries: {
            prefix: q,
            completion: {
              field: "suggest",
              fuzzy: {
                fuzziness: 5
              }
            }
          }
        }
      }
    })
    .then(response => {
      console.log("elasticsearch suggest response", response);
      const flatten = list =>
        list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
      const suggestions = response.suggest.dispensaries.map(e => {
        const options = e.options;
        return options.map(option => {
          return {
            id: option._id,
            type: option._type,
            text: e.text,
            suggestion: option.text,
            location: option._source.location
          };
        });
      });
      res.status(200).json(flatten(suggestions));
      return Promise.resolve();
    });
});

// GET /elasticsearch/bounds?nw={geo_point}&se={geo_point}
app.get("/bounds", (req, res) => {
  const nw = req.query.nw.split(",");
  const se = req.query.se.split(",");
  const topLeft = { lat: parseFloat(nw[0]), lon: parseFloat(nw[1]) };
  const topRight = { lat: parseFloat(se[0]), lon: parseFloat(se[1]) };
  const current = req.query.loc.split(",");
  const currentLat = parseFloat(current[0]);
  const currentLon = parseFloat(current[1]);
  console.log("incoming elasticsearch bounds search", topLeft, topRight, {
    lat: currentLat,
    lon: currentLon
  });
  return client
    .search({
      index: "listings",
      type: "listing",
      size: 1000,
      from: 0,
      body: {
        query: {
          geo_bounding_box: {
            location: {
              top_left: topLeft,
              bottom_right: topRight
            }
          }
        },
        sort: [
          {
            _geo_distance: {
              location: {
                lat: currentLat,
                lon: currentLon
              },
              order: "asc",
              unit: "mi",
              distance_type: "plane"
            }
          }
        ]
      }
    })
    .then(response => {
      console.log("elasticsearch bounds response", response);
      res.status(200).json(
        response.hits.hits.map(e => {
          return { id: e._id, listing: e._source, distance: e.sort };
        })
      );
      return Promise.resolve();
    })
    .catch(error => {
      console.log("error", error);
    });
});

exports.onRequest = functions.https.onRequest(app);
