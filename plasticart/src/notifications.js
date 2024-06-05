const fetch = require('node-fetch');
const admin = require('firebase-admin');
admin.initializeApp();

const firestore = admin.firestore();

const sendNotification = async (token, title, body) => {
  const message = {
    to: token,
    notification: {
      title: title,
      body: body,
    },
  };

  const response = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      'Authorization': 'key=YOUR_SERVER_KEY',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    throw new Error('Failed to send notification');
  }

  const data = await response.json();
  console.log('Successfully sent message:', data);
};

// Listen for new uploads
const usersRef = firestore.collection('USER');
usersRef.onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === 'added') {
      const userId = change.doc.id;
      const userDoc = change.doc.data();
      const fcmToken = userDoc.fcmToken;

      if (fcmToken) {
        sendNotification(fcmToken, 'New Pickup', 'You have a new pickup assignment.');
      }
    }
  });
});
