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

export type StatusFilter = "all" | "admin" | "enabled" | "disabled" | "verified" | "unverified";

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
