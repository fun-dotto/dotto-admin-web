# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## コマンド

```bash
pnpm dev    # 開発サーバー起動 (localhost:3000)
pnpm build  # 本番ビルド（prebuildでOpenAPI型生成を自動実行）
pnpm lint   # ESLint実行
```

## アーキテクチャ

**Dotto管理画面** - Firebase認証（admin権限必須）を使用したNext.js 16管理パネル

### 技術スタック

- Next.js 16 (App Router) + React 19
- Firebase Auth（Googleログイン）
- Tailwind CSS v4 + shadcn/ui (new-yorkスタイル)
- openapi-typescript + openapi-fetch（型安全なAPIクライアント）
- pnpmパッケージマネージャー

### プロジェクト構成

```
src/
├── app/           # Next.js App Routerページ
├── components/ui/ # shadcn/uiコンポーネント
├── contexts/      # Reactコンテキスト (AuthContext)
├── lib/           # ユーティリティ (firebase.ts, api.ts, utils.ts)
└── types/         # 生成された型定義 (openapi.d.ts)
openapi/
└── openapi.yaml   # OpenAPI定義（Admin BFF Service）
```

### 主要パターン

**認証フロー** (`src/contexts/AuthContext.tsx`):

- Firebase AuthでGoogle OAuth使用
- Firebaseトークンに`admin: true`カスタムクレームが必須
- 管理者権限がないユーザーは自動的にサインアウトされエラー表示

**UIコンポーネント**:

- shadcn/ui追加: `pnpm dlx shadcn@latest add <component>`
- className結合には`@/lib/utils`の`cn()`を使用
- `@/`パスエイリアス → `./src/*`

**APIクライアント** (`src/lib/api.ts`):

- `openapi-fetch`による型安全なHTTPクライアント
- OpenAPI定義（`openapi/openapi.yaml`）から`openapi-typescript`で型を自動生成
- 生成された型は`src/types/openapi.d.ts`（gitignore対象、`prebuild`で自動生成）
- ベースURLは`NEXT_PUBLIC_API_BASE_URL`環境変数で設定

```typescript
import { api } from "@/lib/api";

const { data, error } = await api.GET("/v1/announcements");
```

**環境変数** (`.env.local`に設定):

```
# Firebase クライアント用
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID

# API
NEXT_PUBLIC_API_BASE_URL
```

### Firebaseユーザー一覧ページ

**パス**: `/firebase/users`

**ファイル構成**:

```
src/app/firebase/users/
├── page.tsx              # SSRページ（ユーザー取得）
├── UsersPageClient.tsx   # クライアントコンポーネント（UI・ページネーション）
├── actions.ts            # Server Actions（Firebase Admin SDK操作）
└── constants.ts          # ページサイズ定数

src/components/users/
└── UserTable.tsx         # ユーザー一覧テーブルコンポーネント
```

**機能**:

- Firebase Admin SDKでユーザー一覧を取得・表示
- ページネーション対応（URLパラメータで履歴管理）
- 表示件数変更（10/20/50/100件）
- ユーザー情報表示: アバター、名前、メール、UID、ステータス（管理者/有効/無効/メール認証済）、作成日時、最終ログイン

**データ型** (`FirebaseUser`):

```typescript
interface FirebaseUser {
  uid: string;
  email: string | undefined;
  displayName: string | undefined;
  photoURL: string | undefined;
  disabled: boolean;
  emailVerified: boolean;
  creationTime: string | undefined;
  lastSignInTime: string | undefined;
  isAdmin: boolean; // customClaims.admin === true
}
```

### スタイリング

- 日本語UI (lang="ja", Noto Sans JPフォント)
- ダークモード対応（`.dark`クラス）
- oklch()カラーシステム（CSS変数は`globals.css`で定義）

## 実装時に順守すること

- UI は shadcn/ui のコンポーネントを使用する
- UI のスタイルは tailwind-css によってコントロールする
- page.tsx は Server-side Rendering する
- ファイルは細かい単位で分割する
- できるだけ小さい単位でgit commitする
- コミットメッセージは日本語で記述する
