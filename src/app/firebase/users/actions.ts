"use server";

import { getAdminAuth } from "@/lib/firebase-admin";
import { UserRecord } from "firebase-admin/auth";
import { DEFAULT_PAGE_SIZE } from "./constants";

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

export interface PaginatedUsersResult {
  users: FirebaseUser[];
  nextPageToken: string | undefined;
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

export async function fetchUsers(
  pageSize: number = DEFAULT_PAGE_SIZE,
  pageToken?: string
): Promise<PaginatedUsersResult> {
  const auth = getAdminAuth();
  const listUsersResult = await auth.listUsers(pageSize, pageToken);
  return {
    users: listUsersResult.users.map(formatUserRecord),
    nextPageToken: listUsersResult.pageToken,
  };
}

export interface SearchUsersResult {
  users: FirebaseUser[];
  totalCount: number;
}

export type StatusFilter = "all" | "admin" | "developer" | "enabled" | "disabled" | "verified" | "unverified";

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

export interface UpdateAdminClaimResult {
  success: boolean;
  updatedCount: number;
  errors: string[];
}

export async function updateAdminClaim(
  userIds: string[],
  grant: boolean
): Promise<UpdateAdminClaimResult> {
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
