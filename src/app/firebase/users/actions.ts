"use server";

import { getAdminAuth } from "@/lib/firebase-admin";
import { UserRecord } from "firebase-admin/auth";
import { StatusFilter } from "./constants";

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
  isDeveloper: boolean;
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
    isDeveloper: user.customClaims?.developer === true,
  };
}

export async function fetchFirebaseUser(
  uid: string
): Promise<{ user?: FirebaseUser; error?: string }> {
  try {
    const auth = getAdminAuth();
    const record = await auth.getUser(uid);
    return { user: formatUserRecord(record) };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "不明なエラーが発生しました";
    return { error: `Firebase ユーザーの取得に失敗しました: ${message}` };
  }
}

export interface SearchUsersResult {
  users: FirebaseUser[];
  totalCount: number;
}

export async function searchUsers(
  query: string,
  statusFilter: StatusFilter = "all"
): Promise<SearchUsersResult> {
  const auth = getAdminAuth();
  const allUsers: FirebaseUser[] = [];

  // 全ユーザーを取得
  let pageToken: string | undefined;
  do {
    const listUsersResult = await auth.listUsers(1000, pageToken);
    allUsers.push(...listUsersResult.users.map(formatUserRecord));
    pageToken = listUsersResult.pageToken;
  } while (pageToken);

  // フィルタリング
  const filteredUsers = allUsers.filter((user) => {
    // テキスト検索
    if (query) {
      const q = query.toLowerCase();
      const matchesName = user.displayName?.toLowerCase().includes(q);
      const matchesEmail = user.email?.toLowerCase().includes(q);
      const matchesUid = user.uid.toLowerCase().includes(q);
      if (!matchesName && !matchesEmail && !matchesUid) {
        return false;
      }
    }

    // ステータスフィルタ
    switch (statusFilter) {
      case "admin":
        return user.isAdmin;
      case "developer":
        return user.isDeveloper;
      case "enabled":
        return !user.disabled;
      case "disabled":
        return user.disabled;
      case "verified":
        return user.emailVerified;
      case "unverified":
        return !user.emailVerified;
      default:
        return true;
    }
  });

  return {
    users: filteredUsers,
    totalCount: allUsers.length,
  };
}

export interface UpdateClaimResult {
  success: boolean;
  updatedCount: number;
  errors: string[];
}

export async function updateAdminClaim(
  userIds: string[],
  grant: boolean
): Promise<UpdateClaimResult> {
  const auth = getAdminAuth();
  const errors: string[] = [];
  let updatedCount = 0;

  for (const uid of userIds) {
    try {
      const user = await auth.getUser(uid);
      const currentClaims = user.customClaims || {};

      if (grant) {
        await auth.setCustomUserClaims(uid, { ...currentClaims, admin: true });
      } else {
        const { admin: _, ...restClaims } = currentClaims;
        await auth.setCustomUserClaims(uid, restClaims);
      }
      updatedCount++;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "不明なエラーが発生しました";
      errors.push(`${uid}: ${message}`);
    }
  }

  return {
    success: errors.length === 0,
    updatedCount,
    errors,
  };
}

export async function updateDeveloperClaim(
  userIds: string[],
  grant: boolean
): Promise<UpdateClaimResult> {
  const auth = getAdminAuth();
  const errors: string[] = [];
  let updatedCount = 0;

  for (const uid of userIds) {
    try {
      const user = await auth.getUser(uid);
      const currentClaims = user.customClaims || {};

      if (grant) {
        await auth.setCustomUserClaims(uid, { ...currentClaims, developer: true });
      } else {
        const { developer: _, ...restClaims } = currentClaims;
        await auth.setCustomUserClaims(uid, restClaims);
      }
      updatedCount++;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "不明なエラーが発生しました";
      errors.push(`${uid}: ${message}`);
    }
  }

  return {
    success: errors.length === 0,
    updatedCount,
    errors,
  };
}


export async function updateUserDisabledStatus(
  userIds: string[],
  disabled: boolean
): Promise<UpdateClaimResult> {
  const auth = getAdminAuth();
  const errors: string[] = [];
  let updatedCount = 0;

  for (const uid of userIds) {
    try {
      await auth.updateUser(uid, { disabled });
      updatedCount++;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "不明なエラーが発生しました";
      errors.push(`${uid}: ${message}`);
    }
  }

  return {
    success: errors.length === 0,
    updatedCount,
    errors,
  };
}
