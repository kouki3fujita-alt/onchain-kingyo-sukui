import { GameState, Fish, Poi, GameResult, GameResultType, Position } from '../types';

export class GameEngine {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private animationId: number | null = null;
    public gameState: GameState;
    private onGameOver: (result: GameResult) => void;
    private fishImages: HTMLImageElement[] = [];

    constructor(canvas: HTMLCanvasElement, onGameOver: (result: GameResult) => void) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.onGameOver = onGameOver;

        this.poiImage = new Image();
        this.poiImage.src = '/poi_new.png';

        // Load fish images
        const fishSources = ['/fish1.png', '/fish2.png', '/fish3.png', '/fish4.png'];
        this.fishImages = fishSources.map(src => {
            const img = new Image();
            img.src = src;
            return img;
        });
        this.poiImage.src = '/poi_new.png';

        // Initial state
        this.gameState = {
            isRunning: false,
            startTime: 0,
            timeRemaining: 30,
            fishes: this.initFishes(canvas.width, canvas.height),
            poi: { position: { x: canvas.width / 2, y: canvas.height / 2 }, durability: 100 },
            focusMode: false,
            focusStartTime: null,
            focusTarget: null,
            focusRadius: 50
        };
    }

    private initFishes(width: number, height: number): Fish[] {
        // Mock fishes
        return Array.from({ length: 15 }).map((_, i) => {
            const imageIndex = Math.floor(Math.random() * 4);
            return {
                type: {
                    id: `fish-${i}`,
                    name: 'Goldfish',
                    rarity: 'Common',
                    strength: 30,
                    speed: 2 + Math.random() * 2,
                    color: '#FF6B6B',
                    image: `/fish${imageIndex + 1}.png`,
                    behavior: 'normal',
                    catchRate: 0.7
                },
                position: { x: Math.random() * width, y: Math.random() * height },
                velocity: { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 }
            };
        });
    }

    start() {
        this.gameState.isRunning = true;
        this.gameState.startTime = Date.now();
        this.gameLoop();
    }

    stop() {
        this.gameState.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    updatePoiPosition(pos: Position) {
        this.gameState.poi.position = pos;
    }

    private gameLoop = () => {
        if (!this.gameState.isRunning) return;

        this.update();
        this.render();

        this.animationId = requestAnimationFrame(this.gameLoop);
    };

    private update() {
        const now = Date.now();
        const elapsed = (now - this.gameState.startTime) / 1000;

        this.gameState.timeRemaining = Math.max(0, 30 - elapsed);

        if (this.gameState.timeRemaining === 0) {
            this.endGame('timeout');
            return;
        }

        // Update fishes
        const { width, height } = this.canvas;
        this.gameState.fishes.forEach(fish => {
            fish.position.x += fish.velocity.x;
            fish.position.y += fish.velocity.y;

            // Bounce
            if (fish.position.x < 0 || fish.position.x > width) fish.velocity.x *= -1;
            if (fish.position.y < 0 || fish.position.y > height) fish.velocity.y *= -1;
        });

        this.checkFocusAlignment();
    }

    private checkFocusAlignment() {
        const poi = this.gameState.poi;
        const focusDist = 50; // Capture logic simplified

        let activeFish = null;

        for (const fish of this.gameState.fishes) {
            const dist = Math.sqrt(
                Math.pow(poi.position.x - fish.position.x, 2) +
                Math.pow(poi.position.y - fish.position.y, 2)
            );

            if (dist < focusDist) {
                activeFish = fish;
                if (!this.gameState.focusMode) {
                    this.gameState.focusMode = true;
                    this.gameState.focusStartTime = Date.now();
                    this.gameState.focusTarget = fish;
                } else if (this.gameState.focusTarget === fish) {
                    // Hold check
                    const holdTime = (Date.now() - (this.gameState.focusStartTime || 0)) / 1000;
                    if (holdTime > 0.5) {
                        this.catchFish(fish);
                    }
                }
                break;
            }
        }

        if (!activeFish) {
            this.gameState.focusMode = false;
            this.gameState.focusTarget = null;
            this.gameState.focusStartTime = null;
        }
    }

    private catchFish(fish: Fish) {
        // Success logic always true for MVP demo unless durability check fails
        this.endGame('success', fish);
    }

    private endGame(type: GameResultType, fish?: Fish) {
        this.stop();
        this.onGameOver({
            type,
            fishCaught: fish?.type,
            poiFinalDurability: this.gameState.poi.durability,
            playDuration: 30 - this.gameState.timeRemaining
        });
    }

    private poiImage: HTMLImageElement;

    private render() {
        const ctx = this.ctx;
        const { width, height } = this.canvas;

        // Clear
        ctx.clearRect(0, 0, width, height);

        // Draw Fishes
        this.gameState.fishes.forEach(fish => {
            const angle = Math.atan2(fish.velocity.y, fish.velocity.x) + Math.PI / 2;
            const size = 60; // Fish size

            ctx.save();
            ctx.translate(fish.position.x, fish.position.y);
            ctx.rotate(angle);

            // Find loaded image that matches the fish type image string
            const imgPath = fish.type.image;
            let img = this.fishImages.find(i => i.src.endsWith(imgPath || ''));

            if (img && img.complete) {
                ctx.drawImage(img, -size / 2, -size / 2, size, size);
            } else {
                // Fallback
                ctx.fillStyle = fish.type.color;
                ctx.beginPath();
                ctx.arc(0, 0, 10, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        });

        // Draw Poi
        const { x, y } = this.gameState.poi.position;
        const size = 100; // Adjust size as needed

        if (this.poiImage.complete) {
            ctx.save();
            ctx.translate(x, y);
            // Center the image
            ctx.drawImage(this.poiImage, -size / 2, -size / 2, size, size);
            ctx.restore();
        } else {
            // Fallback while loading
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, 40, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Focus Ring
        if (this.gameState.focusMode) {
            const progress = Math.min(1, (Date.now() - (this.gameState.focusStartTime || 0)) / 500);
            ctx.strokeStyle = '#4CAF50';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(x, y, 40 * progress, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}
