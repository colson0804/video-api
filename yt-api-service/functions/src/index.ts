/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { Firestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";
import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";
import { Storage } from "@google-cloud/storage";
import { onCall } from "firebase-functions/v2/https";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

initializeApp();

const firestore = new Firestore();
const storage = new Storage();

const rawVideoBucketName = "video-api-10eea-raw-videos";
const videoCollectionId = "videos";

export const createUser = functions.auth.user().onCreate((user) => {
  const userInfo = {
    uid: user.uid,
    email: user.email,
    photoUrl: user.photoURL,
  };

  firestore.collection("users").doc(user.uid).set(userInfo);
  logger.info(`User Created: ${JSON.stringify(userInfo)}`);
  return;
});

export const generateUploadUrl = onCall(
  { maxInstances: 1 },
  async (request) => {
    // Check if the user is authenticated
    if (!request.auth) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called while authenticated."
      );
    }

    const auth = request.auth;
    const data = request.data;
    const bucket = storage.bucket(rawVideoBucketName);

    // Generate a unique filename
    const filename = `${auth.uid}-${Date.now()}.${data.fileExtension}`;

    // Get a v4 signed URL for uploading file
    const [url] = await bucket.file(filename).getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000,
    });

    return { url, filename };
  }
);

export const getVideos = onCall({ maxInstances: 1 }, async () => {
  const snapshot = await firestore
    .collection(videoCollectionId)
    .limit(10)
    .get();
  snapshot.docs.map((doc) => doc.data());
});
