import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";

let adminApp: App;
let adminAuth: Auth;

function getAdminApp(): App {
  if (getApps().length === 0) {
    const projectId =
      process.env.FIREBASE_PROJECT_ID ??
      process.env.PROJECT_ID ??
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      adminApp = initializeApp(projectId ? { projectId } : undefined);
    } else {
      const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
        /\\n/g,
        "\n",
      );

      if (!projectId || !clientEmail || !privateKey) {
        adminApp = initializeApp(projectId ? { projectId } : undefined);
      } else {
        adminApp = initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
      }
    }
  } else {
    adminApp = getApps()[0];
  }

  return adminApp;
}

export function getAdminAuth(): Auth {
  if (!adminAuth) {
    adminAuth = getAuth(getAdminApp());
  }
  return adminAuth;
}
