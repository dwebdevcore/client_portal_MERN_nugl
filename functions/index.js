const functions = require("firebase-functions");
const _ = require("lodash");
const requestPromise = require("request-promise");
const admin = require("firebase-admin");
const storage = require("@google-cloud/storage")();
const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
admin.initializeApp();

const firestore = admin.firestore();

const apiConfig = require("./api/config");

exports.elasticsearch = require("./http/elasticsearch").onRequest;
exports.google = require("./http/google").onRequest;
exports.convertImageToJPG = require("./storage/convertImageToJPG").imageToJPG;

exports.onReviewWrite = require("./database/aggregateRatings").onReviewWrite;
exports.indexAlgoliaOnListingWrite = require("./database/indexAlgoliaListings").onListingWrite;
exports.indexAlgoliaOnBrandWrite = require("./database/indexAlgoliaBrands").onBrandWrite;

exports.onListingWrite = functions.firestore
  .document("listings/{listingId}")
  .onWrite((change, context) => {
    const exists = change.after.exists;
    const listing = change.after.data();
    const listingId = context.params.listingId;
    const publish = Boolean(listing && listing.publish);

    console.log(
      `${publish ? "indexing" : "deleting"} listing`,
      listingId,
      listing
    );

    if (!exists) {
      const bucket = storage.bucket(adminConfig.storageBucket);
      //const bucket = storage.bucket("nugl-dev.appspot.com"); "nugl-da5c2.appspot.com"
      bucket
        .getFiles({ prefix: `listings/${listingId}/` })
        .then(results => {
          const files = results[0];
          files.forEach(file => {
            bucket.file(file.name).delete();
          });
          return Promise.resolve();
        })
        .catch(error => {});
    }

    const elasticsearchFields = [
      "id",
      "userId",
      "name",
      "type",
      "description",
      "phone",
      "photoUrl",
      "website",

      "address",
      "city",
      "state",
      "zip",
      "formattedAddress",
      "location",

      "hours",
      "products",
      "services",
      "strains",

      "facebook",
      "twitter",
      "instagram",
      "seed",

      "ratings"
    ];

    const elasticSearchConfig = functions.config().elasticsearch || {
      username: "user",
      password: "q8zwa369Fuf5",
      url: "http://35.224.63.148/elasticsearch/",
      static: true
    };

    const elasticSearchUrl =
      elasticSearchConfig.url + "listings/listing/" + listingId;
    const elasticSearchMethod = publish ? "POST" : "DELETE";

    console.log(elasticSearchUrl, elasticSearchMethod);

    let body = {};

    if (publish) {
      body = _.pick(listing, elasticsearchFields);
      body.id = listingId;
      body.location = {
        lat: listing.location._latitude,
        lon: listing.location._longitude
      };
      body.suggest = {
        input: [listing.name]
      };
      console.log("elasticsearch request body", body);
    }
    const elasticsearchRequest = {
      method: elasticSearchMethod,
      uri: elasticSearchUrl,
      auth: {
        username: elasticSearchConfig.username,
        password: elasticSearchConfig.password
      },
      json: true
    };
    if (publish) {
      elasticsearchRequest.body = body;
    }
    return requestPromise(elasticsearchRequest).then(response => {
      console.log("elasticsearch response", response);
      return Promise.resolve();
    });
  });

exports.onSeed = functions.database
  .ref("/listings/{listingId}")
  .onWrite((change, context) => {
    const listing = change.after.val();
    if (listing) {
      return firestore
        .collection("listings")
        .doc(listing.id)
        .set({
          address: listing.address,
          city: listing.city,
          description: listing.description,
          email: listing.email,
          formattedAddress: listing.formattedAddress,
          location: {
            Latitude: listing.latitude,
            Longitude: listing.longitude,
            latitude: listing.latitude,
            longitude: listing.longitude,
            _latitude: listing.latitude,
            _longitude: listing.longitude
          },
          /*hours: {
            monday: { open: false },
            tuesday: { open: false },
            wednesday: { open: false },
            thursday: { open: false },
            friday: { open: false },
            saturday: { open: false },
            sunday: { open: false }
          },*/
          name: listing.name,
          phone: listing.phone,
          publish: listing.publish,
          services: ["Store Front", "Delivery"],
          state: listing.state,
          strains: ["Indica", "Sativa"],
          type: listing.type,
          zip: listing.zip,
          userId: listing.userId,
          seed: listing.seed
        });
    }

    return Promise.resolve();
  });

exports.onDeleteSeed = functions.database
  .ref("/listings/{listingId}")
  .onDelete((snap, context) => {
    const oldListing = snap.val();
    return firestore
      .collection("listings")
      .doc(oldListing.id)
      .delete();
  });

// ---------------------------------------------------------
// REST api routing
// ---------------------------------------------------------
const express = require("express");
const jwt = require("jsonwebtoken");
const usersApi = require("./api/v1/users");
const authApi = require("./api/v1/auth");
const app = new express();

app.disable("x-powered-by");
app.set("tokenSecret", apiConfig.secret);
app.use("/v1/auth", authApi);

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
app.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    res.status(403).send("Unauthorized");
    return;
  }
  var token = req.headers.authorization.split("Bearer ")[1];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get("tokenSecret"), function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: "Failed to authenticate token."
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: "No token provided."
    });
  }
});

app.use("/v1/users", usersApi);

app.get("*", function(request, response) {
  response.status(404).send("This route does not exist.");
});

exports.api = functions.https.onRequest(app);
