# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## コマンド

```bash
pnpm dev      # 開発サーバー起動 (localhost:3000)
pnpm build    # 本番ビルド
pnpm lint     # ESLint実行
```

## アーキテクチャ

**Dotto管理画面** - Firebase認証（admin権限必須）を使用したNext.js 16管理パネル

### 技術スタック

- Next.js 16 (App Router) + React 19
- Firebase Auth（Googleログイン）
- Tailwind CSS v4 + shadcn/ui (new-yorkスタイル)
- pnpmパッケージマネージャー

### プロジェクト構成

```
src/
├── app/           # Next.js App Routerページ
├── components/ui/ # shadcn/uiコンポーネント
├── contexts/      # Reactコンテキスト (AuthContext)
└── lib/           # ユーティリティ (firebase.ts, utils.ts)
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

**環境変数** (`.env.local`に設定):

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
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
