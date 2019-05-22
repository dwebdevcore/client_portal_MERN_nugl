const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firestore = admin.firestore();

const categories = [
  "price",
  "knowledge",
  "variety",
  "security",
  "parking",
  "quality",
  "customerService",
  "cleanliness",
  "atmosphere",
  "average"
];

exports.onReviewWrite = functions.firestore
  .document("reviews/{reviewId}")
  .onWrite((change, context) => {
    const review = change.after.data();
    const listingRef = firestore.collection("listings").doc(review.listingId);
    return firestore.runTransaction(transaction => {
      return transaction
        .get(listingRef)
        .then(listingDoc => {
          const listing = listingDoc.data();
          let ratings = listing.ratings || {};
          categories.forEach(category => {
            const categoryRating = review.ratings[category];
            if (!categoryRating) {
              return;
            }
            const newCount = (ratings[`${category}Count`] || 0) + 1;
            const oldRatingTotal =
              (ratings[`${category}Average`] || 0) *
              (ratings[`${category}Count`] || 0);
            const newAverage = (oldRatingTotal + categoryRating) / newCount;
            ratings[`${category}Average`] = newAverage;
            ratings[`${category}Count`] = newCount;
          });
          return transaction.update(listingRef, {
            ratings: ratings
          });
        })
        .catch(error => {
          console.log(error);
        });
    });
  });
