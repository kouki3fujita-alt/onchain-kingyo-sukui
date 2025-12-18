import React, { useEffect, useRef } from 'react';
import { GameEngine } from '../game/GameEngine';
import { GameResult } from '../types';

interface Props {
    onGameOver: (result: GameResult) => void;
}

export const GameScreen = ({ onGameOver }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<GameEngine | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Resize handling
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        const engine = new GameEngine(canvasRef.current, onGameOver);
        engineRef.current = engine;
        engine.start();

        return () => {
            engine.stop();
            window.removeEventListener('resize', handleResize);
        };
    }, [onGameOver]);

    const handlePointerMove = (e: React.PointerEvent) => {
        if (engineRef.current) {
            engineRef.current.updatePoiPosition({ x: e.clientX, y: e.clientY });
        }
    };

    return (
        <canvas
            ref={canvasRef}
            className="block touch-none cursor-none bg-kingyo-water w-full h-full absolute top-0 left-0"
            onPointerMove={handlePointerMove}
        />
    );
};
