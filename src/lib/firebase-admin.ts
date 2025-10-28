
import * as admin from 'firebase-admin';

// This is a global cache for the initialized Firebase Admin app.
// It prevents re-initializing the app on every hot-reload.
let adminApp: admin.app.App;

export async function initializeFirebaseAdmin() {
  if (admin.apps.length > 0 && adminApp) {
    return adminApp;
  }

  // The `credential` is automatically inferred from the GOOGLE_APPLICATION_CREDENTIALS
  // environment variable in the App Hosting environment.
  adminApp = admin.initializeApp();
  
  return adminApp;
}
