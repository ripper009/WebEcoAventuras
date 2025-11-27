// backend/firebaseAdmin.js
const admin = require("firebase-admin");
const serviceAccount = require("./loginecoaventuras-firebase-adminsdk-nsd80-76227143ce.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { db };
