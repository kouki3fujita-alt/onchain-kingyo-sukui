# 🐟 Onchain Kingyo-Sukui (金魚すくい)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A blockchain-powered Japanese goldfish scooping game where every play result becomes an NFT memory on Base blockchain.

[English](#english) | [日本語](#japanese)

---

## English

### 🎯 Overview

Onchain Kingyo-Sukui is a web-based game that brings the traditional Japanese festival game "Kingyo-Sukui" (goldfish scooping) to the blockchain. Players scoop goldfish using a virtual "poi" (paper scoop), and every game result—success, failure, or timeout—is minted as an NFT on Base blockchain, creating permanent onchain memories.

### ✨ Features

- **🎮 Interactive Gameplay**: Smooth HTML5 Canvas-based game with realistic fish movements
- **⏱️ Time Challenge**: 30-second time limit to catch goldfish
- **🎣 Focus Mechanic**: Hold your poi near a fish for 0.5 seconds to catch it
- **🖼️ NFT Minting**: All game results are minted as ERC721 NFTs
- **📊 Daily Limits**: Maximum 10 plays per day per wallet address
- **⛽ Gasless Experience**: Gas fees covered by the application (coming soon)
- **🎨 Beautiful UI**: Modern, responsive design with Tailwind CSS and Framer Motion

### 🛠️ Technology Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Ethers.js v6

**Blockchain:**
- Solidity 0.8.20
- Hardhat
- OpenZeppelin Contracts
- Base (Layer 2 Ethereum)

**Smart Contract:**
- ERC721 NFT standard
- Daily mint limits per user
- Metadata stored on IPFS

### 🎮 Game Mechanics

1. **Start**: Click "すくう" (Scoop) to begin
2. **Movement**: Move your mouse/touch to control the poi (paper scoop)
3. **Catching**: Hold the poi near a goldfish for 0.5 seconds
4. **Time Limit**: Complete within 30 seconds
5. **Results**:
   - **Success**: Caught a goldfish
   - **Failure**: Poi broke (durability reached 0)
   - **Timeout**: Time ran out

### 🚀 Getting Started

#### Prerequisites

- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Base Sepolia testnet ETH (for testing)

#### Installation

```bash
# Clone the repository
git clone https://github.com/kouki3fujita-alt/onchain-kingyo-sukui.git
cd onchain-kingyo-sukui

# Install dependencies
npm install
```

#### Development

```bash
# Start the development server
npm run dev

# Open http://localhost:5173 in your browser
```

#### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

#### Smart Contract Development

```bash
# Compile contracts
npx hardhat compile

# Run tests (if available)
npx hardhat test

# Deploy to Base Sepolia
npx hardhat run scripts/deploy.ts --network baseSepolia

# Deploy to Base Mainnet
npx hardhat run scripts/deploy.ts --network base
```

### 📝 Smart Contract Details

**Contract Name**: `KingyoNFT`  
**Standard**: ERC721 with URI Storage  
**Network**: Base (Mainnet & Sepolia Testnet)

#### Key Features:

- **Daily Mint Limits**: 10 NFTs per wallet per day
- **Result Storage**: Stores game result metadata (Success/Failure/Timeout)
- **IPFS Metadata**: Token URIs point to IPFS for decentralized storage
- **Owner Controls**: Only contract owner can mint (for gasless experience)

#### Contract Functions:

```solidity
// Mint a game result NFT
function mintResult(address to, string memory _tokenURI, string memory result) 
    public onlyOwner returns (uint256)

// Check if user can mint today
function canMintToday(address user) public view returns (bool)

// Get remaining mints for today
function remainingMintsToday(address user) public view returns (uint256)

// Get next available mint time
function nextMintAvailableAt(address user) public view returns (uint256)
```

### 📁 Project Structure

```
onchain-kingyo-sukui/
├── KingyoSukuiNFT/
│   └── KingyoNFT.sol           # ERC721 NFT contract
├── src/
│   ├── App.tsx                 # Main application component
│   ├── components/
│   │   └── GameScreen.tsx      # Game screen component
│   ├── game/
│   │   └── GameEngine.ts       # Core game logic
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   └── config/                # Configuration files
├── public/                    # Static assets (fish images, poi)
├── hardhat.config.ts          # Hardhat configuration
├── package.json               # Dependencies and scripts
└── vite.config.ts             # Vite configuration
```

### 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Private key for deployment (DO NOT COMMIT!)
PRIVATE_KEY=your_private_key_here

# BaseScan API key for verification
BASESCAN_API_KEY=your_basescan_api_key
```

### 🌐 Networks

- **Base Mainnet**: Chain ID 8453
- **Base Sepolia**: Chain ID 84532

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### 📄 License

This project is licensed under the MIT License.

### 🙏 Acknowledgments

- Traditional Japanese festival game "Kingyo-Sukui"
- Base blockchain team
- OpenZeppelin for secure smart contract libraries

---

## Japanese

### 🎯 概要

Onchain Kingyo-Sukui（オンチェーン金魚すくい）は、日本の伝統的な縁日の遊び「金魚すくい」をブロックチェーン上で再現したWebゲームです。プレイヤーは仮想の「ポイ」を使って金魚をすくい、成功・失敗・タイムアウトのすべての結果がBaseブロックチェーン上でNFTとして記録され、永続的なオンチェーンメモリーとなります。

### ✨ 特徴

- **🎮 インタラクティブなゲームプレイ**: HTML5 Canvasベースの滑らかなゲーム体験
- **⏱️ タイムチャレンジ**: 30秒以内に金魚をキャッチ
- **🎣 フォーカスメカニクス**: 金魚の近くで0.5秒間ポイを保持してキャッチ
- **🖼️ NFTミント**: すべてのゲーム結果がERC721 NFTとして記録
- **📊 デイリーリミット**: ウォレットアドレスごとに1日最大10回プレイ可能
- **⛽ ガスレス体験**: ガス代はアプリケーション負担（実装予定）
- **🎨 美しいUI**: Tailwind CSSとFramer Motionによるモダンなデザイン

### 🛠️ 技術スタック

**フロントエンド:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Ethers.js v6

**ブロックチェーン:**
- Solidity 0.8.20
- Hardhat
- OpenZeppelin Contracts
- Base（Layer 2 Ethereum）

**スマートコントラクト:**
- ERC721 NFT標準
- ユーザーごとの日次ミント制限
- IPFSメタデータストレージ

### 🎮 ゲームメカニクス

1. **開始**: 「すくう」ボタンをクリック
2. **移動**: マウスまたはタッチで「ポイ」を操作
3. **キャッチ**: 金魚の近くで0.5秒間ポイを保持
4. **制限時間**: 30秒以内にクリア
5. **結果**:
   - **成功**: 金魚をキャッチ
   - **失敗**: ポイが破れた（耐久度0）
   - **タイムアウト**: 時間切れ

### 🚀 セットアップ

#### 必要要件

- Node.js 18以上とnpm
- MetaMaskまたは互換性のあるWeb3ウォレット
- Base Sepolia テストネット ETH（テスト用）

#### インストール

```bash
# リポジトリのクローン
git clone https://github.com/kouki3fujita-alt/onchain-kingyo-sukui.git
cd onchain-kingyo-sukui

# 依存関係のインストール
npm install
```

#### 開発

```bash
# 開発サーバーの起動
npm run dev

# ブラウザで http://localhost:5173 を開く
```

#### ビルド

```bash
# 本番環境用ビルド
npm run build

# ビルドのプレビュー
npm run preview
```

#### スマートコントラクト開発

```bash
# コントラクトのコンパイル
npx hardhat compile

# テストの実行（利用可能な場合）
npx hardhat test

# Base Sepoliaへのデプロイ
npx hardhat run scripts/deploy.ts --network baseSepolia

# Base Mainnetへのデプロイ
npx hardhat run scripts/deploy.ts --network base
```

### 📝 スマートコントラクト詳細

**コントラクト名**: `KingyoNFT`  
**標準規格**: ERC721 with URI Storage  
**ネットワーク**: Base（メインネット & Sepoliaテストネット）

#### 主な機能:

- **日次ミント制限**: ウォレットごとに1日10個のNFT
- **結果保存**: ゲーム結果メタデータ（成功/失敗/タイムアウト）を保存
- **IPFSメタデータ**: 分散型ストレージのためIPFSを使用
- **オーナー管理**: ガスレス体験のためオーナーのみがミント可能

#### コントラクト関数:

```solidity
// ゲーム結果NFTのミント
function mintResult(address to, string memory _tokenURI, string memory result) 
    public onlyOwner returns (uint256)

// 今日ミント可能かチェック
function canMintToday(address user) public view returns (bool)

// 本日の残りミント回数を取得
function remainingMintsToday(address user) public view returns (uint256)

// 次のミント可能時刻を取得
function nextMintAvailableAt(address user) public view returns (uint256)
```

### 📁 プロジェクト構造

```
onchain-kingyo-sukui/
├── KingyoSukuiNFT/
│   └── KingyoNFT.sol           # ERC721 NFTコントラクト
├── src/
│   ├── App.tsx                 # メインアプリケーションコンポーネント
│   ├── components/
│   │   └── GameScreen.tsx      # ゲーム画面コンポーネント
│   ├── game/
│   │   └── GameEngine.ts       # コアゲームロジック
│   ├── types/
│   │   └── index.ts           # TypeScript型定義
│   └── config/                # 設定ファイル
├── public/                    # 静的アセット（魚の画像、ポイ）
├── hardhat.config.ts          # Hardhat設定
├── package.json               # 依存関係とスクリプト
└── vite.config.ts             # Vite設定
```

### 🔧 環境変数

ルートディレクトリに`.env`ファイルを作成:

```env
# デプロイ用の秘密鍵（コミット厳禁！）
PRIVATE_KEY=your_private_key_here

# 検証用のBaseScan APIキー
BASESCAN_API_KEY=your_basescan_api_key
```

### 🌐 ネットワーク

- **Base Mainnet**: Chain ID 8453
- **Base Sepolia**: Chain ID 84532

### 🤝 コントリビューション

コントリビューションを歓迎します！プルリクエストをお気軽にお送りください。

### 📄 ライセンス

このプロジェクトはMITライセンスの下でライセンスされています。

### 🙏 謝辞

- 日本の伝統的な縁日の遊び「金魚すくい」
- Baseブロックチェーンチーム
- 安全なスマートコントラクトライブラリを提供するOpenZeppelin

---

Made with ❤️ for preserving memories onchain
