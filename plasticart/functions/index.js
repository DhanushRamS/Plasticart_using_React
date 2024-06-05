const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.sendNewUploadNotification = functions.firestore
    .document("USER/{userId}/PICKUP/{pickupId}")
    .onCreate(async (snap, context) => {
      const newValue = snap.data();
      const userId = context.params.userId;

      // Get the FCM token for the user
      const userRef = admin.firestore().collection("users").doc(userId);
      const userDoc = await userRef.get();
      const fcmToken = userDoc.data().fcmToken;

      const payload = {
        notification: {
          title: "New Pickup",
          body: `You have a new pickup assignment: ${newValue.prediction}`,
        },
      };

      if (fcmToken) {
        admin
            .messaging()
            .sendToDevice(fcmToken, payload)
            .then((response) => {
              console.log("Successfully sent message:", response);
            })
            .catch((error) => {
              console.error("Error sending message:", error);
            });
      }
    });
