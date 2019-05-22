const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firestore = admin.firestore();
const _ = require("lodash");
const algoliasearch = require("algoliasearch");

const ALGOLIA_APP_ID = functions.config().algolia.app_id;
const ALGOLIA_API_KEY = functions.config().algolia.api_key;

const algolia = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

const index = algolia.initIndex(functions.config().algolia.listings_index);

exports.onListingWrite = functions.firestore
  .document("listings/{listingId}")
  .onWrite((change, context) => {
    const deleted = change.after.exists;
    const listing = change.after.data();
    const listingId = context.params.listingId;
    const publish = Boolean(listing && listing.publish);

    const fields = [
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

    let algoliaObject = {};

    if (!publish) {
      index.deleteObject(listingId, function(err, content) {
        if (err) throw err;
        console.log(content);
      });
    } else {
      algoliaObject = _.pick(listing, fields);
      algoliaObject.objectID = listingId;
      algoliaObject._geoloc = {
        lat: listing.location._latitude,
        lng: listing.location._longitude
      };

      return index
        .saveObjects([algoliaObject])
        .then(() => {
          console.log("Contacts imported into Algolia");
          return Promise.resolve();
        })
        .catch(error => {
          console.error("Error when importing contact into Algolia", error);
        });
    }

    return Promise.resolve();
  });
