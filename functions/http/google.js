const functions = require("firebase-functions");
const admin = require("firebase-admin");
const requestPromise = require("request-promise");
const express = require("express");
const cors = require("cors")({ origin: true });

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

// GET /google/geocode?type={placeId|address}&input={string}
app.get("/geocode", (req, res) => {
  const type = req.query.type;
  const input = encodeURIComponent(req.query.input);
  console.log("incoming google geocode", type, input);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?${type}=${input}&key=AIzaSyADbY_DXSxunwSxzRuFCKHdRNfeYoOepcI`;
  const googleRequest = {
    method: "GET",
    uri: url,
    json: true
  };
  return requestPromise(googleRequest).then(response => {
    console.log("google geocode response", response);
    if (response.status === "OK") {
      const addresses = response.results.map(result => {
        let location = {};
        const addressComponents = result.address_components.map(e => {
          location[e.types[0]] = e.short_name;
        });
        location["formattedAddress"] = result.formatted_address;
        location["location"] = result.geometry.location;
        return location;
      });
      res.status(200).json(addresses);
    } else {
      res.status(200).json([]);
    }
    return Promise.resolve();
  });
});

// https://developers.google.com/places/web-service/autocomplete#place_types     (regions) || geocode
// GET /google/autocomplete?input={string}
app.get("/autocomplete", (req, res) => {
  const input = req.query.input;
  console.log("incoming google autocomplete", input);
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=geocode&components=country:us&key=AIzaSyADbY_DXSxunwSxzRuFCKHdRNfeYoOepcI`;
  const googleRequest = {
    method: "GET",
    uri: url,
    json: true
  };
  return requestPromise(googleRequest).then(response => {
    console.log("google autocomplete response", response);
    if (response.status === "OK") {
      const predictions = response.predictions.map(result => {
        return {
          placeId: result.place_id,
          description: result.description
        };
      });
      res.status(200).json(predictions);
    } else {
      res.status(200).json([]);
    }
    return Promise.resolve();
  });
});

exports.onRequest = functions.https.onRequest(app);
