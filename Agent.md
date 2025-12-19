# Agent.md - Development Guide for Onchain Kingyo-Sukui

This document provides comprehensive technical information for AI agents and developers working on the Onchain Kingyo-Sukui project.

## Table of Contents

1. [Project Architecture](#project-architecture)
2. [Development Environment](#development-environment)
3. [Code Structure](#code-structure)
4. [Game Engine Details](#game-engine-details)
5. [Smart Contract Architecture](#smart-contract-architecture)
6. [State Management](#state-management)
7. [Development Workflow](#development-workflow)
8. [Testing Guidelines](#testing-guidelines)
9. [Deployment Procedures](#deployment-procedures)
10. [Common Tasks](#common-tasks)
11. [Troubleshooting](#troubleshooting)

---

## Project Architecture

### Overview

Onchain Kingyo-Sukui is a full-stack blockchain game with three main components:

1. **Frontend Game Engine**: React + TypeScript + HTML5 Canvas
2. **Smart Contract**: Solidity ERC721 NFT contract on Base
3. **Integration Layer**: Ethers.js connecting frontend to blockchain

```
┌─────────────────────────────────────────┐
│         Frontend (React + Vite)         │
│  ┌───────────────────────────────────┐  │
│  │      GameEngine (Canvas)          │  │
│  │  - Fish Movement                  │  │
│  │  - Poi Physics                    │  │
│  │  - Collision Detection            │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │      UI Components                │  │
│  │  - Game Screens                   │  │
│  │  - Result Display                 │  │
│  │  - NFT Minting UI                 │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
              │
              │ Ethers.js v6
              │
┌─────────────────────────────────────────┐
│     Base Blockchain (L2 Ethereum)       │
│  ┌───────────────────────────────────┐  │
│  │      KingyoNFT Contract           │  │
│  │  - ERC721 Standard                │  │
│  │  - Daily Mint Limits              │  │
│  │  - Result Storage                 │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Technology Stack Rationale

- **React 18**: Modern UI with hooks and concurrent features
- **TypeScript**: Type safety and better developer experience
- **Vite**: Fast development server and optimized builds
- **Tailwind CSS**: Utility-first CSS for rapid UI development
- **Framer Motion**: Smooth animations for better UX
- **Hardhat**: Robust smart contract development environment
- **Base L2**: Low gas fees and fast transactions for better UX

---

## Development Environment

### Required Tools

```bash
Node.js: v18.0.0 or higher
npm: v9.0.0 or higher
Git: Latest version
MetaMask: Browser extension
```

### IDE Recommendations

- **VS Code** with extensions:
  - ESLint
  - Prettier
  - Solidity (by Juan Blanco)
  - Tailwind CSS IntelliSense

### Setup Steps

```bash
# 1. Clone and install
git clone <repo-url>
cd onchain-kingyo-sukui
npm install

# 2. Environment setup
cp .env.example .env
# Edit .env with your keys

# 3. Verify setup
npm run dev          # Should start on localhost:5173
npx hardhat compile  # Should compile contracts
```

---

## Code Structure

### Directory Layout

```
onchain-kingyo-sukui/
│
├── KingyoSukuiNFT/           # Smart Contracts
│   └── KingyoNFT.sol         # Main NFT contract
│
├── src/                      # Frontend Source
│   ├── App.tsx               # Root component with screen routing
│   ├── main.tsx              # Entry point
│   ├── index.css             # Global styles + Tailwind
│   │
│   ├── components/           # React Components
│   │   └── GameScreen.tsx    # Main game screen with canvas
│   │
│   ├── game/                 # Game Logic
│   │   └── GameEngine.ts     # Core game engine class
│   │
│   ├── types/                # TypeScript Definitions
│   │   └── index.ts          # Game types and interfaces
│   │
│   └── config/               # Configuration
│       └── (contract addresses, chain configs)
│
├── public/                   # Static Assets
│   ├── fish1.png - fish4.png # Fish sprites
│   └── poi_new.png           # Poi (scoop) image
│
├── hardhat.config.ts         # Hardhat configuration
├── vite.config.ts            # Vite build configuration
├── tailwind.config.js        # Tailwind CSS setup
├── tsconfig.json             # TypeScript compiler options
└── package.json              # Dependencies and scripts
```

### Key Files Explained

#### `src/App.tsx`
- **Purpose**: Main application component with screen state management
- **State Management**: Uses React useState for screen navigation
- **Screens**: `top`, `game`, `result`, `minting`, `nft-complete`, `gallery`
- **Pattern**: Simple state machine for screen transitions

#### `src/game/GameEngine.ts`
- **Purpose**: Core game logic and rendering
- **Pattern**: Class-based with encapsulated game state
- **Key Methods**:
  - `start()`: Initialize game loop
  - `update()`: Game state updates (60fps)
  - `render()`: Canvas drawing
  - `checkFocusAlignment()`: Collision and catch detection

#### `src/types/index.ts`
- **Purpose**: Centralized type definitions
- **Key Types**:
  - `GameState`: Complete game state
  - `Fish`: Fish entity with position and velocity
  - `GameResult`: Result data for NFT minting

#### `KingyoSukuiNFT/KingyoNFT.sol`
- **Purpose**: ERC721 NFT contract for game results
- **Inherits**: ERC721, ERC721URIStorage, Ownable
- **Key Features**:
  - Daily mint limits (10/day per user)
  - Result type tracking
  - IPFS metadata URIs

---

## Game Engine Details

### Game Loop Architecture

The game engine uses `requestAnimationFrame` for smooth 60fps rendering:

```typescript
private gameLoop = () => {
    if (!this.gameState.isRunning) return;
    
    this.update();    // Physics and logic
    this.render();    // Canvas drawing
    
    this.animationId = requestAnimationFrame(this.gameLoop);
};
```

### State Updates (`update()`)

1. **Time Management**: Track remaining time (30 seconds)
2. **Fish Movement**: Update fish positions based on velocity
3. **Boundary Checking**: Bounce fish off canvas edges
4. **Collision Detection**: Check poi-fish proximity
5. **Focus Tracking**: Monitor hold time for catching

### Rendering Pipeline (`render()`)

1. **Clear Canvas**: `ctx.clearRect()`
2. **Draw Fish**: 
   - Load sprite images
   - Apply rotation based on velocity
   - Draw at current position
3. **Draw Poi**: Center poi image at cursor position
4. **Draw Focus Ring**: Visual feedback when near fish

### Catch Mechanics

```typescript
// Catch conditions:
1. Poi within 50px of fish center
2. Hold position for 0.5 seconds
3. Poi durability > 0 (not implemented in MVP)

// Implementation:
private checkFocusAlignment() {
    const focusDist = 50;
    for (const fish of this.gameState.fishes) {
        const dist = Math.sqrt(
            Math.pow(poi.position.x - fish.position.x, 2) +
            Math.pow(poi.position.y - fish.position.y, 2)
        );
        
        if (dist < focusDist) {
            if (!this.gameState.focusMode) {
                // Start focus
                this.gameState.focusMode = true;
                this.gameState.focusStartTime = Date.now();
            } else {
                // Check hold time
                const holdTime = (Date.now() - focusStartTime) / 1000;
                if (holdTime > 0.5) {
                    this.catchFish(fish);
                }
            }
        }
    }
}
```

### Fish AI Behavior

Currently implemented: **Random movement with boundary bounce**

```typescript
fish.position.x += fish.velocity.x;
fish.position.y += fish.velocity.y;

// Bounce at boundaries
if (fish.position.x < 0 || fish.position.x > width) 
    fish.velocity.x *= -1;
if (fish.position.y < 0 || fish.position.y > height) 
    fish.velocity.y *= -1;
```

**Future enhancements**:
- Flee behavior when poi approaches
- Schooling behavior (boids algorithm)
- Different behavior patterns per fish rarity

---

## Smart Contract Architecture

### KingyoNFT Contract

#### Inheritance Chain
```
Ownable → ERC721 → ERC721URIStorage → KingyoNFT
```

#### State Variables

```solidity
Counters.Counter private _tokenIdCounter;          // Auto-increment token IDs
mapping(address => uint256) public dailyMintCount; // Mints today
mapping(address => uint256) public lastMintDate;   // Last mint date (days)
uint256 public constant MAX_DAILY_MINTS = 10;      // Daily limit
```

#### Key Functions

**mintResult()**
```solidity
function mintResult(
    address to,              // Recipient address
    string memory _tokenURI, // IPFS metadata URI
    string memory result     // "Success", "Failure", "Timeout"
) public onlyOwner returns (uint256)
```
- Checks daily mint limit
- Mints NFT to user
- Sets token URI
- Updates daily count
- Emits `KingyoMinted` event

**canMintToday()**
```solidity
function canMintToday(address user) public view returns (bool)
```
- Checks if new day (resets count)
- Checks if under MAX_DAILY_MINTS

**Daily Limit Logic**

The contract uses `block.timestamp / 1 days` to determine the current day:

```solidity
uint256 today = block.timestamp / 1 days;

if (lastMintDate[user] < today) {
    // New day - reset count
    dailyMintCount[user] = 1;
    lastMintDate[user] = today;
} else {
    // Same day - increment
    dailyMintCount[user]++;
}
```

This resets at 00:00 UTC daily.

#### Events

```solidity
event KingyoMinted(
    address indexed player,
    uint256 indexed tokenId,
    string result,
    string tokenURI
);
```

---

## State Management

### Frontend State

The app uses **local React state** (useState) with a simple state machine:

```typescript
type Screen = 'top' | 'game' | 'result' | 'minting' | 'nft-complete' | 'gallery';
const [currentScreen, setCurrentScreen] = useState<Screen>('top');
const [lastResult, setLastResult] = useState<GameResult | null>(null);
```

**State Flow**:
```
top → game → result → minting → nft-complete → top
```

### Game State

Managed by `GameEngine` class:

```typescript
interface GameState {
    isRunning: boolean;
    startTime: number;
    timeRemaining: number;
    fishes: Fish[];
    poi: Poi;
    focusMode: boolean;
    focusStartTime: number | null;
    focusTarget: Fish | null;
    focusRadius: number;
}
```

### Contract State

Stored on-chain:
- Token ownership (ERC721 standard)
- Token metadata URIs (IPFS links)
- Daily mint counts per user
- Last mint date per user

---

## Development Workflow

### Frontend Development

```bash
# 1. Start dev server
npm run dev

# 2. Make changes to src/
# Hot reload will update browser

# 3. Build for testing
npm run build
npm run preview

# 4. Lint code
npm run lint
```

### Smart Contract Development

```bash
# 1. Write/modify contracts in KingyoSukuiNFT/

# 2. Compile
npx hardhat compile

# 3. Test (when tests exist)
npx hardhat test

# 4. Deploy to testnet
npx hardhat run scripts/deploy.ts --network baseSepolia

# 5. Verify on BaseScan
npx hardhat verify --network baseSepolia DEPLOYED_ADDRESS
```

### Git Workflow

```bash
# 1. Create feature branch
git checkout -b feature/your-feature

# 2. Make changes and commit
git add .
git commit -m "feat: your feature description"

# 3. Push and create PR
git push origin feature/your-feature
```

---

## Testing Guidelines

### Frontend Testing (Not yet implemented)

Recommended setup:
- **Vitest** for unit tests
- **Testing Library** for component tests
- **Playwright** for E2E tests

Example test structure:
```typescript
describe('GameEngine', () => {
    it('should start game and begin countdown', () => {
        // Test implementation
    });
    
    it('should detect fish catch after 0.5s hold', () => {
        // Test implementation
    });
});
```

### Smart Contract Testing (Not yet implemented)

Recommended setup:
- **Hardhat Network** for local testing
- **Chai** for assertions
- **Ethers.js** for contract interaction

Example test structure:
```typescript
describe('KingyoNFT', () => {
    it('should mint NFT with correct metadata', async () => {
        // Test implementation
    });
    
    it('should enforce daily mint limit', async () => {
        // Test implementation
    });
});
```

---

## Deployment Procedures

### Frontend Deployment

**Recommended: Vercel**

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Production deployment
vercel --prod
```

**Environment Variables on Vercel**:
- Set contract addresses
- Set RPC URLs
- Set chain IDs

### Smart Contract Deployment

**Prerequisites**:
1. Base Sepolia ETH for testnet
2. Base ETH for mainnet
3. Private key in `.env`
4. BaseScan API key for verification

**Deployment Script** (`scripts/deploy.ts`):

```typescript
import { ethers } from "hardhat";

async function main() {
    const KingyoNFT = await ethers.getContractFactory("KingyoNFT");
    const kingyo = await KingyoNFT.deploy();
    await kingyo.deployed();
    
    console.log("KingyoNFT deployed to:", kingyo.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
```

**Deploy Commands**:

```bash
# Testnet
npx hardhat run scripts/deploy.ts --network baseSepolia

# Mainnet (⚠️ COSTS REAL MONEY)
npx hardhat run scripts/deploy.ts --network base

# Verify contract
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS>
```

**Post-Deployment**:
1. Save contract address
2. Update frontend config
3. Test minting functionality
4. Add contract address to README

---

## Common Tasks

### Adding a New Fish Type

1. **Add sprite image** to `public/`
2. **Update fish initialization** in `GameEngine.ts`:

```typescript
const newFish: Fish = {
    type: {
        id: 'legendary-koi',
        name: 'Legendary Koi',
        rarity: 'Legendary',
        strength: 90,
        speed: 1.5,
        color: '#FFD700',
        image: '/legendary-koi.png',
        behavior: 'flee',
        catchRate: 0.1
    },
    position: { x: Math.random() * width, y: Math.random() * height },
    velocity: { x: (Math.random() - 0.5) * 3, y: (Math.random() - 0.5) * 3 }
};
```

### Changing Game Parameters

Edit constants in `GameEngine.ts`:

```typescript
// Time limit
this.gameState.timeRemaining = 30; // seconds

// Catch distance
const focusDist = 50; // pixels

// Hold time for catch
if (holdTime > 0.5) { // seconds

// Number of fish
Array.from({ length: 15 }) // count
```

### Updating Daily Mint Limit

Edit `KingyoNFT.sol`:

```solidity
uint256 public constant MAX_DAILY_MINTS = 10; // Change this value
```

Then redeploy contract.

### Adding New Game Result Type

1. **Update type definition** in `src/types/index.ts`:

```typescript
export type GameResultType = 'success' | 'failure' | 'timeout' | 'perfect';
```

2. **Update result handling** in `GameEngine.ts`:

```typescript
private endGame(type: GameResultType, fish?: Fish) {
    this.onGameOver({
        type,
        fishCaught: fish?.type,
        poiFinalDurability: this.gameState.poi.durability,
        playDuration: 30 - this.gameState.timeRemaining
    });
}
```

3. **Update contract** if needed to store new result type

---

## Troubleshooting

### Common Issues

#### "Cannot find module 'ethers'"
```bash
npm install ethers@^6.8.1
```

#### Canvas not rendering fish
- Check if fish images are in `public/` folder
- Verify image paths in `GameEngine.ts`
- Check browser console for image loading errors

#### Contract deployment fails
- Ensure sufficient ETH in wallet
- Check network in hardhat.config.ts
- Verify RPC URL is correct
- Check private key format (no '0x' prefix in .env)

#### Daily mint limit not resetting
- Contract uses UTC time
- `block.timestamp / 1 days` resets at 00:00 UTC
- Check `lastMintDate` mapping on contract

#### Type errors in TypeScript
```bash
# Regenerate types
npm run build

# Clear cache
rm -rf node_modules/.vite
npm run dev
```

### Debugging Tips

**Frontend**:
```typescript
// Add console logs in GameEngine
console.log('Fish position:', fish.position);
console.log('Poi position:', poi.position);
console.log('Distance:', dist);
```

**Smart Contract**:
```solidity
// Add events for debugging
event Debug(string message, uint256 value);
emit Debug("Daily count", dailyMintCount[user]);
```

Use Hardhat console:
```typescript
import "hardhat/console.sol";
console.log("Minting to:", to);
```

---

## Performance Optimization

### Frontend

- **Canvas optimization**:
  - Limit draw calls
  - Use requestAnimationFrame
  - Avoid unnecessary state updates

- **Asset optimization**:
  - Compress images (PNG → WebP)
  - Use sprite sheets for fish
  - Lazy load components

### Smart Contract

- **Gas optimization**:
  - Use `uint256` for counters
  - Pack variables efficiently
  - Minimize storage writes

Current gas costs (estimated):
- Deploy: ~2,500,000 gas
- Mint: ~120,000 gas per NFT

---

## Security Considerations

### Smart Contract Security

1. **Reentrancy**: Not vulnerable (no external calls in sensitive functions)
2. **Access Control**: `onlyOwner` modifier protects mint function
3. **Integer Overflow**: Safe with Solidity 0.8.20 (built-in checks)
4. **Daily Limit**: Enforced on-chain, cannot be bypassed

### Frontend Security

1. **Input Validation**: Validate all user inputs
2. **XSS Prevention**: React auto-escapes by default
3. **Wallet Connection**: Use reputable libraries (ethers.js)

### Private Key Management

⚠️ **NEVER** commit `.env` file with private keys!

```bash
# Add to .gitignore
.env
.env.local
```

---

## Future Enhancements

### Planned Features

1. **Wallet Integration**:
   - Connect MetaMask
   - Display user's NFT collection
   - Show remaining daily mints

2. **IPFS Metadata**:
   - Generate SVG NFTs on-chain or off-chain
   - Upload metadata to IPFS
   - Dynamic NFT traits based on game results

3. **Leaderboard**:
   - Track fastest catches
   - Rarest fish caught
   - Total NFTs minted

4. **Advanced Fish AI**:
   - Flee from poi
   - Schooling behavior
   - Rarity-based behavior

5. **Gasless Minting**:
   - Meta-transactions
   - Relay service
   - Sponsored transactions

6. **Mobile Optimization**:
   - Touch controls
   - Responsive canvas
   - PWA support

---

## Resources

### Documentation

- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Hardhat Docs](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Base Docs](https://docs.base.org/)
- [Ethers.js Docs](https://docs.ethers.org/v6/)

### Tools

- [Remix IDE](https://remix.ethereum.org/) - Solidity IDE
- [BaseScan](https://basescan.org/) - Block explorer
- [OpenSea](https://opensea.io/) - NFT marketplace

### Community

- [Base Discord](https://discord.gg/buildonbase)
- [Ethereum Stack Exchange](https://ethereum.stackexchange.com/)

---

## Contributing

When contributing to this project:

1. Follow existing code style
2. Write meaningful commit messages
3. Test thoroughly before PR
4. Update documentation if needed
5. Add comments for complex logic

### Code Style

- **TypeScript**: Use strict mode
- **React**: Functional components with hooks
- **Solidity**: Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- **Naming**:
  - Components: PascalCase
  - Functions: camelCase
  - Constants: UPPER_SNAKE_CASE

---

## Contact

For questions or support, please open an issue on GitHub.

---

**Last Updated**: 2025-12-19
**Version**: 1.0.0
