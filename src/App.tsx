import { useState } from 'react'
import { GameScreen } from './components/GameScreen';
import { GameResult } from './types';

type Screen = 'top' | 'game' | 'result' | 'minting' | 'nft-complete' | 'gallery';

function App() {
    const [currentScreen, setCurrentScreen] = useState<Screen>('top');
    const [lastResult, setLastResult] = useState<GameResult | null>(null);

    const handleGameOver = (result: GameResult) => {
        setLastResult(result);
        setCurrentScreen('result');
    };

    const handleMint = async () => {
        setCurrentScreen('minting');
        // Mock mint process - in real app this calls the SDK
        setTimeout(() => {
            setCurrentScreen('nft-complete');
        }, 3000);
    };

    const renderScreen = () => {
        switch (currentScreen) {
            case 'top':
                return (
                    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-200">
                        <h1 className="text-6xl font-black text-kingyo-red mb-4 drop-shadow-md">金魚すくい</h1>
                        <p className="text-xl text-slate-600 mb-12">Onchain Memory</p>

                        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-sm w-full text-center border-2 border-white">
                            <div className="mb-8">
                                <div className="w-32 h-32 bg-kingyo-water rounded-full mx-auto flex items-center justify-center animate-float border-4 border-white shadow-inner">
                                    <span className="text-4xl">🐟</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setCurrentScreen('game')}
                                className="btn-primary w-full text-xl mb-4"
                            >
                                すくう
                            </button>

                            <div className="text-sm text-slate-500">
                                残り 10/10 回
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <button className="text-slate-600 hover:text-kingyo-red font-bold">
                                コレクション
                            </button>
                            <button className="text-slate-600 hover:text-kingyo-red font-bold">
                                遊び方
                            </button>
                        </div>
                    </div>
                );
            case 'game':
                return <GameScreen onGameOver={handleGameOver} />;
            case 'result':
                return (
                    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-8">
                        <h2 className="text-4xl font-bold mb-8 text-slate-800">
                            {lastResult?.type === 'success' ? '大成功！' : '残念...'}
                        </h2>
                        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full mb-8 border border-slate-100">
                            <p className="mb-4 text-lg text-center font-bold text-slate-700">
                                {lastResult?.type === 'success'
                                    ? `伝説の金魚「${lastResult.fishCaught?.name}」をゲット！`
                                    : lastResult?.failureReason || 'タイムアウト'}
                            </p>
                            <div className="text-sm text-slate-400 text-center">
                                ポイ耐久度: {lastResult?.poiFinalDurability.toFixed(0)}%
                            </div>
                        </div>
                        <button onClick={handleMint} className="btn-primary w-full max-w-xs">
                            結果を刻む (Mint NFT)
                        </button>
                    </div>
                );
            case 'minting':
                return (
                    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
                        <div className="animate-spin text-6xl mb-4">⚓</div>
                        <h2 className="text-2xl font-bold">ブロックチェーンに刻んでいます...</h2>
                        <p className="text-slate-400 mt-2">ガス代は私たちが負担します</p>
                    </div>
                );
            case 'nft-complete':
                return (
                    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-8">
                        <h1 className="text-4xl font-bold text-yellow-400 mb-2">Mint Complete!</h1>
                        <div className="my-8 bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/20">
                            {/* NFT Card Placeholder */}
                            <div className="w-64 h-80 bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden shadow-2xl">
                                <span className="text-6xl animate-bounce">
                                    {lastResult?.type === 'success' ? '🐠' : '🍂'}
                                </span>
                                <div className="absolute bottom-0 w-full bg-black/50 p-2 text-center text-xs text-white">
                                    Onchain Kingyo #1234
                                </div>
                            </div>
                            <p className="text-center italic text-sm text-slate-300">
                                "{lastResult?.type === 'success' ? '運が良かっただけだよ' : '次は逃げる'}"
                            </p>
                        </div>
                        <button onClick={() => setCurrentScreen('top')} className="px-8 py-3 bg-white text-indigo-900 rounded-full font-bold shadow-lg hover:bg-slate-100 transition-colors">
                            トップへ戻る
                        </button>
                    </div>
                );
            default:
                return <div>Error</div>;
        }
    };

    return (
        <div className="min-h-screen">
            {renderScreen()}
        </div>
    )
}

export default App
