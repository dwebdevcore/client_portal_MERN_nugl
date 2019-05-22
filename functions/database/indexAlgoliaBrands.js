const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firestore = admin.firestore();
const _ = require("lodash");
const algoliasearch = require("algoliasearch");

const ALGOLIA_APP_ID = functions.config().algolia.app_id;
const ALGOLIA_API_KEY = functions.config().algolia.api_key;

const algolia = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

const index = algolia.initIndex(functions.config().algolia.brands_index);

exports.onBrandWrite = functions.firestore
  .document("brands/{brandId}")
  .onWrite((change, context) => {
    const deleted = change.after.exists;
    const brand = change.after.data();
    const brandId = context.params.brandId;
    const publish = Boolean(brand && brand.publish);

    const fields = [
      "id",
      "userId",
      "name",
      "type",
      "description",
      "phone",
      "photoUrl",
      "website",

      "products",
      "services",
      "strains",

      "facebook",
      "twitter",
      "instagram",

      "ratings"
    ];

    let algoliaObject = {};

    if (!publish) {
      index.deleteObject(brandId, function(err, content) {
        if (err) throw err;
        console.log(content);
      });
    } else {
      algoliaObject = _.pick(brand, fields);
      algoliaObject.objectID = brandId;
      return index
        .saveObjects([algoliaObject])
        .then(() => {
          console.log("Brand imported into Algolia");
          return Promise.resolve();
        })
        .catch(error => {
          console.error("Error when importing Brand into Algolia", error);
        });
    }

    return Promise.resolve();
  });
