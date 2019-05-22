const express = require("express");
const admin = require("firebase-admin");
const firestore = admin.firestore();
const router = express.Router();

router.get("/:id", function getUser(request, response) {
  var id = request.params.id;
  var profileRef = firestore.collection("profiles").doc(id);
  profileRef
    .get()
    .then(doc => {
      if (!doc.exists) {
        response.status(404).send("Not found.");
      } else {
        response.status(200).json(doc.data());
      }
    })
    .catch(err => {
      response.status(500).send("Internal server error.");
      //if (err)
      //    return response.status(500).send("Internal server error.");
      //else
      //    return response.status(500).send("Internal server error.");
    });
});

router.get("*", function(request, response) {
  res.status(404).send("This route does not exist.");
});

module.exports = router;
