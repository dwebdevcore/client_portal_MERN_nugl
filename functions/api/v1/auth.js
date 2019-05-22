const express = require("express");
const apiConfig = require("./../config");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/accesstoken", function getToken(req, res) {
  const key = req.body.apikey;
  if (!key) {
    res.json({ success: false, message: "Api key value is missing." });
  } else {
    //verify apiKey if exists
    //todo: store api keys in secured location (db, firestore?)
    if (key === "1ec6f951-b026-4b0b-ad0b-007d375915a2") {
      try {
        // create a token
        var expiration = 86400; // expires in 24 hours
        var payload = {
          iis: "nugl.com",
          aud: "nugl apps",
          iat: Math.floor(Date.now() / 1000) - 30
        };
        var token = jwt.sign(payload, apiConfig.secret, {
          expiresIn: expiration
        });
        res.json({
          success: true,
          token: token,
          expiresIn: expiration
        });
      } catch (e) {
        res.status(500).json({ e });
      }
    } else {
      res.json({
        success: false,
        message: "Invalid api key."
      });
    }
  }
});

module.exports = router;
