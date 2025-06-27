# Gemini Generated Chat App

- [English](#gemini-generated-chat-app)
- [日本語](#gemini生成チャットアプリ)

---

A real-time chat application built with SvelteKit and Firebase, demonstrating user authentication and real-time messaging capabilities.

## Features

*   **User Authentication**: Users can sign up, log in, and log out using Firebase Authentication.
*   **Real-time Chat**: Messages are sent and received in real-time using Firebase Firestore.
*   **Chat Room Management**: Users can create new chat rooms and join existing ones.
*   **Usernames**: Messages display the sender's username.

## Technologies Used

*   **Frontend Framework**: [SvelteKit](https://kit.svelte.dev/)
*   **Backend/Database/Authentication**: [Firebase](https://firebase.google.com/) (Authentication and Firestore)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool**: [Vite](https://vitejs.dev/)

## Setup

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or pnpm

### Firebase Project Setup

1.  **Create a Firebase Project**: Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  **Enable Authentication**: In your Firebase project, navigate to "Authentication" and enable "Email/Password" sign-in method.
3.  **Enable Firestore Database**: In your Firebase project, navigate to "Firestore Database" and create a new database. Choose a location (e.g., `nam5` as seen in `firebase.json`).
4.  **Get Firebase Configuration**: In your Firebase project settings, find your web app's configuration (SDK setup and configuration).

    ```javascript
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };
    ```

### Environment Variables

Create a `.env` file in the root of the `gemini-generated-chat-app` directory and add your Firebase configuration:

```
PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"
```

### Installation

Navigate to the `gemini-generated-chat-app` directory and install the dependencies:

```bash
cd gemini-generated-chat-app
pnpm install
```

## Running the Application

### Development Mode

To run the application in development mode with hot-reloading:

```bash
pnpm dev
```

The application will typically be available at `http://localhost:5173`.

### Building for Production

To build the application for production:

```bash
pnpm build
```

### Previewing Production Build

To preview the production build locally:

```bash
pnpm preview
```

### Running with Firebase Emulators

To run the application using Firebase Emulators for local development and testing:

1.  **Start Firebase Emulators**: In a separate terminal, navigate to the project root and run:

    ```bash
    firebase emulators:start
    ```

    This will start the Authentication and Firestore emulators (and any others you configured).

2.  **Run the Application**: In another terminal, start the SvelteKit development server as usual:

    ```bash
    pnpm dev
    ```

    The application will automatically connect to the running emulators when in development mode.

### Deploying with GitHub Actions

This project is configured to automatically deploy to Firebase Hosting via GitHub Actions when changes are pushed to the `release` branch.

**Setup Steps:**

1.  **Firebase Service Account Key**: Obtain a Firebase service account key from your Firebase project settings (`Project settings` -> `Service accounts` -> `Generate new private key`).
2.  **GitHub Secrets**: Add the content of the downloaded JSON key file as a GitHub Secret named `FIREBASE_SERVICE_ACCOUNT_YOUR_PROJECT_ID` (replace `YOUR_PROJECT_ID` with your actual Firebase project ID in uppercase, e.g., `FIREBASE_SERVICE_ACCOUNT_GEMINI_GENERATED_CHAT_APP`).
3.  **Firebase Public Environment Variables**: Also add the following Firebase public environment variables as GitHub Secrets, using the values from your `.env` file:
    *   `PUBLIC_FIREBASE_API_KEY`
    *   `PUBLIC_FIREBASE_AUTH_DOMAIN`
    *   `PUBLIC_FIREBASE_PROJECT_ID`
    *   `PUBLIC_FIREBASE_STORAGE_BUCKET`
    *   `PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
    *   `PUBLIC_FIREBASE_APP_ID`
4.  **Trigger Deployment**: Push your changes to the `release` branch:

    ```bash
    git push origin release
    ```

    The GitHub Actions workflow will automatically build and deploy your application to Firebase Hosting. You can monitor the deployment status in your GitHub repository's `Actions` tab.

## Project Structure

```
gemini-generated-chat-app/
├── src/
│   ├── lib/                # Reusable components and utilities
│   │   └── components/     # Svelte components
│   └── routes/             # SvelteKit routes (pages and layouts)
│       ├── chat/           # Chat room specific routes
│       │   └── [roomId]/   # Dynamic route for chat rooms
│       ├── create-room/    # Route for creating new chat rooms
│       ├── login/          # Login page
│       └── signup/         # Sign up page
└── static/                 # Static assets (e.g., favicon)
```

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is open source and available under the [MIT License](LICENSE).

---

# Gemini生成チャットアプリ

SvelteKitとFirebaseで構築されたリアルタイムチャットアプリケーションで、ユーザー認証とリアルタイムメッセージング機能を示します。

## 機能

*   **ユーザー認証**: Firebase Authenticationを使用して、ユーザーはサインアップ、ログイン、ログアウトができます。
*   **リアルタイムチャット**: Firebase Firestoreを使用して、メッセージがリアルタイムで送受信されます。
*   **チャットルーム管理**: ユーザーは新しいチャットルームを作成したり、既存のチャットルームに参加したりできます。
*   **ユーザー名**: メッセージには送信者のユーザー名が表示されます。

## 使用技術

*   **フロントエンドフレームワーク**: [SvelteKit](https://kit.svelte.dev/)
*   **バックエンド/データベース/認証**: [Firebase](https://firebase.google.com/) (AuthenticationとFirestore)
*   **言語**: [TypeScript](https://www.typescriptlang.org/)
*   **ビルドツール**: [Vite](https://vitejs.dev/)

## セットアップ

### 前提条件

*   Node.js (LTSバージョンを推奨)
*   npm または pnpm

### Firebaseプロジェクトのセットアップ

1.  **Firebaseプロジェクトの作成**: [Firebase Console](https://console.firebase.google.com/)にアクセスし、新しいプロジェクトを作成します。
2.  **認証の有効化**: Firebaseプロジェクトで「Authentication」に移動し、「Email/Password」サインイン方法を有効にします。
3.  **Firestoreデータベースの有効化**: Firebaseプロジェクトで「Firestore Database」に移動し、新しいデータベースを作成します。場所を選択します（例: `firebase.json`に記載されている`nam5`）。
4.  **Firebase設定の取得**: Firebaseプロジェクトの設定で、ウェブアプリの設定（SDKセットアップと設定）を見つけます。

    ```javascript
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };
    ```

### 環境変数

`gemini-generated-chat-app`ディレクトリのルートに`.env`ファイルを作成し、Firebaseの設定を追加します。

```
PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"
```

### インストール

`gemini-generated-chat-app`ディレクトリに移動し、依存関係をインストールします。

```bash
cd gemini-generated-chat-app
pnpm install
```

## アプリケーションの実行

### 開発モード

ホットリロード付きで開発モードでアプリケーションを実行するには:

```bash
pnpm dev
```

アプリケーションは通常、`http://localhost:5173`で利用できます。

### 本番環境向けビルド

本番環境向けにアプリケーションをビルドするには:

```bash
pnpm build
```

### 本番ビルドのプレビュー

ローカルで本番ビルドをプレビューするには:

```bash
pnpm preview
```

### Firebaseエミュレータでの実行

ローカル開発およびテストのためにFirebaseエミュレータを使用してアプリケーションを実行するには：

1.  **Firebaseエミュレータの起動**: 別のターミナルで、プロジェクトのルートに移動し、以下を実行します。

    ```bash
    firebase emulators:start
    ```

    これにより、AuthenticationおよびFirestoreエミュレータ（および設定したその他のエミュレータ）が起動します。

2.  **アプリケーションの実行**: 別のターミナルで、通常通りSvelteKit開発サーバーを起動します。

    ```bash
pnpm dev
```

    開発モードの場合、アプリケーションは実行中のエミュレータに自動的に接続します。

### GitHub Actionsでのデプロイ

このプロジェクトは、`release` ブランチにプッシュされた変更をトリガーとして、GitHub Actionsを介してFirebase Hostingに自動的にデプロイするように設定されています。

**セットアップ手順:**

1.  **Firebaseサービスアカウントキー**: Firebaseプロジェクトの設定（`プロジェクトの設定` -> `サービスアカウント` -> `新しい秘密鍵を生成`）からFirebaseサービスアカウントキーを取得します。
2.  **GitHub Secrets**: ダウンロードしたJSONキーファイルの内容を、`FIREBASE_SERVICE_ACCOUNT_YOUR_PROJECT_ID` という名前のGitHub Secretとして追加します（`YOUR_PROJECT_ID` は実際のFirebaseプロジェクトIDを大文字にしたものに置き換えてください。例: `FIREBASE_SERVICE_ACCOUNT_GEMINI_GENERATED_CHAT_APP`）。
3.  **Firebase公開環境変数**: また、`.env` ファイルの値を使用して、以下のFirebase公開環境変数をGitHub Secretsとして追加します。
    *   `PUBLIC_FIREBASE_API_KEY`
    *   `PUBLIC_FIREBASE_AUTH_DOMAIN`
    *   `PUBLIC_FIREBASE_PROJECT_ID`
    *   `PUBLIC_FIREBASE_STORAGE_BUCKET`
    *   `PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
    *   `PUBLIC_FIREBASE_APP_ID`
4.  **デプロイのトリガー**: `release` ブランチに変更をプッシュします。

    ```bash
    git push origin release
    ```

    GitHub Actionsワークフローは、アプリケーションを自動的にビルドし、Firebase Hostingにデプロイします。デプロイ状況は、GitHubリポジトリの`Actions`タブで監視できます。

## プロジェクト構造

```
gemini-generated-chat-app/
├── src/
│   ├── lib/                # 再利用可能なコンポーネントとユーティリティ
│   │   └── components/     # Svelteコンポーネント
│   └── routes/             # SvelteKitルート（ページとレイアウト）
│       ├── chat/           # チャットルーム固有のルート
│       │   └── [roomId]/   # チャットルームの動的ルート
│       ├── create-room/    # 新しいチャットルームを作成するためのルート
│       ├── login/          # ログインページ
│       └── signup/         # サインアップページ
└── static/                 # 静的アセット（例: ファビコン）
```

## 貢献

貢献を歓迎します！お気軽にissueを開いたり、プルリクエストを送信してください。

## ライセンス

このプロジェクトはオープンソースであり、[MITライセンス](LICENSE)の下で利用可能です。