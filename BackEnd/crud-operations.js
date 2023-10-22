const admin = require("firebase-admin");
const firebaseConfig = require("./firebase-config");
const axios = require("axios");

admin.initializeApp({
  credential: admin.credential.cert(
    "./users-15823-firebase-adminsdk-a79qc-6e7a6e39be.json"
  ),
  databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
  storageBucket: `${firebaseConfig.storageBucket}`,
});

async function uploadImage(file) {
  const storageBucket = admin.storage().bucket();

  const storageFilePath = `images/${file.originalname}`;

  const buffer = file.buffer;

  const fileRef = storageBucket.file(storageFilePath);

  try {
    await fileRef.save(buffer);
  } catch (err) {
    console.log("Error uploading file:", err);
    throw err;
  }

  const [url] = await fileRef.getSignedUrl({
    action: "read",
    expires: "01-01-2100",
  });

  return url;
}

async function shortenUrl(url, userId) {
  const res = await axios.get("https://tinyurl.com/api-create.php?url=" + url);

  const shortenedUrl = res.data;

  await admin.firestore().collection("urls").add({
    originalUrl: url,
    shortenedUrl,
    userId,
  });

  return shortenedUrl;
}

async function readImage(docId) {
  const imageRef = admin.firestore().collection("urls").doc(docId);
  const snapshot = await imageRef.get();

  if (snapshot.exists) {
    const data = snapshot.data();
    return data.shortenedUrl;
  } else {
    throw new Error("Document not found");
  }
}

//// It UPDATE searching for the document id very well

// async function updateImage(userId, newImageData) {
//   const storageBucket = admin.storage().bucket();
//   const storageFilePath = `images/${newImageData.originalname}`;
//   const buffer = newImageData.buffer;
//   const fileRef = storageBucket.file(storageFilePath);

//   try {
//     // Save the new image to storage
//     await fileRef.save(buffer);
//   } catch (err) {
//     console.error('Error uploading new image:', err);
//     throw err;
//   }

//   // Generate a signed URL for the new image
//   const [newImageUrl] = await fileRef.getSignedUrl({ action: 'read', expires: '01-01-2100' });

//   // Generate a shortened URL for the new image URL
//   const newImageShortenedUrl = await shortenUrl(newImageUrl, userId);

//   // Update the Firestore document for the user with the new image URL and new shortened URL
//   const userDocRef = admin.firestore().collection('urls').doc(userId);
//   await userDocRef.update({
//     originalUrl: newImageUrl,
//     shortenedUrl : newImageShortenedUrl,

//   });

//   return { newImageUrl, newImageShortenedUrl };
// }

async function updateImage(userId, newImageData) {
  const storageBucket = admin.storage().bucket();
  const storageFilePath = `images/${newImageData.originalname}`;
  const buffer = newImageData.buffer;
  const fileRef = storageBucket.file(storageFilePath);

  try {
    await fileRef.save(buffer);
  } catch (err) {
    console.error("Error uploading new image:", err);
    throw err;
  }

  const [newImageUrl] = await fileRef.getSignedUrl({
    action: "read",
    expires: "01-01-2100",
  });

  const newImageShortenedUrl = await shortenUrl(newImageUrl, userId);

  const userCollectionRef = admin.firestore().collection("urls");
  const query = userCollectionRef.where("userId", "==", userId);
  const querySnapshot = await query.get();

  querySnapshot.forEach(async (doc) => {
    await doc.ref.update({
      originalUrl: newImageUrl,
      shortenedUrl: newImageShortenedUrl,
    });
  });

  return { newImageUrl, newImageShortenedUrl };
}

async function deleteImage(docId) {
  const imageRef = admin.firestore().collection("urls").doc(docId);

  await imageRef.delete();
}

module.exports = {
  uploadImage,
  readImage,
  updateImage,
  deleteImage,
  shortenUrl,
};
