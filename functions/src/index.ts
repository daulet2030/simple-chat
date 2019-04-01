const functions = require('firebase-functions');

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

var db = admin.firestore();

exports.onUserStatusChanged = functions.database
  .ref('.info/connected') // Reference to the Firebase RealTime database key
  .onUpdate(event => {
    const usersRef = db.collection('/availableVotings'); // Create a reference to the Firestore Collection
    console.log(usersRef)
    return event.data.ref.once('status')
      .then(status => {
        // check if the value is 'offline'
        if (status === 'offline') {
          // Set the Firestore's document's online value to false
          console.log(status)
        }
      })
  });
