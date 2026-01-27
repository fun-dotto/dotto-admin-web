"use server";

import { getAdminAuth } from "@/lib/firebase-admin";
import { UserRecord } from "firebase-admin/auth";

export interface FirebaseUser {
  uid: string;
  email: string | undefined;
  displayName: string | undefined;
  photoURL: string | undefined;
  disabled: boolean;
  emailVerified: boolean;
  creationTime: string | undefined;
  lastSignInTime: string | undefined;
  isAdmin: boolean;
}

function formatUserRecord(user: UserRecord): FirebaseUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    disabled: user.disabled,
    emailVerified: user.emailVerified,
    creationTime: user.metadata.creationTime,
    lastSignInTime: user.metadata.lastSignInTime,
    isAdmin: user.customClaims?.admin === true,
  };
}

export async function fetchUsers(): Promise<FirebaseUser[]> {
  const auth = getAdminAuth();
  const listUsersResult = await auth.listUsers(1000);
  return listUsersResult.users.map(formatUserRecord);
}
