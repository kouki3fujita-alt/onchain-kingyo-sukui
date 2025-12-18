export type GameResultType = 'success' | 'failure' | 'timeout';

export interface FishType {
    id: string;
    name: string;
    rarity: 'Common' | 'Rare' | 'Legendary' | 'Bugged';
    strength: number;        // 1-100
    speed: number;           // 1-10
    color: string;
    image?: string;
    behavior: string;
    catchRate: number;       // 0-1
}

export interface PoiState {
    durability: number;      // 0-100
    initialDurability: number;
    tearLevel: number;       // 0-3
    isBroken: boolean;
}

export interface GameResult {
    type: GameResultType;
    fishCaught?: FishType;
    failureReason?: string;
    poiFinalDurability: number;
    playDuration: number;
    tokenId?: number;
}

export interface Position {
    x: number;
    y: number;
}

export interface Fish {
    type: FishType;
    position: Position;
    velocity: Position;
    targetPosition?: Position;
}

export interface Poi {
    position: Position;
    durability: number;
}

export interface GameState {
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

