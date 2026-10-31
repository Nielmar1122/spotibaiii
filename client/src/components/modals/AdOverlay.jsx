import { useState, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';

export default function AdOverlay() {
  const { adPending, finishAd } = usePlayer();
  const [countdown, setCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);

  // The 5-second countdown timer
  useEffect(() => {
    if (!adPending) return;
    setCountdown(5);
    setCanSkip(false);
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { 
          clearInterval(timer); 
          setCanSkip(true); 
          return 0; 
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [adPending]);

  if (!adPending) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-white/10 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative overflow-hidden">
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-spotibaiii text-black text-xs font-bold px-2 py-1 rounded">AD</span>
            <p className="text-sm text-gray-300">Spotibaiii Partner</p>
          </div>
          <p className="text-sm text-gray-400">Your music will resume shortly</p>
        </div>

        {/* Video Player - Pointing to your public folder */}
        <div className="max-h-[70vh] w-full bg-black rounded-xl flex items-center justify-center overflow-hidden relative mb-6">
          <video 
            src="/ads/ad-video.mp4" 
            autoPlay 
            playsInline 
            controls 
            className="w-full h-full object-cover"
            onEnded={() => setCanSkip(true)} // If the video ends before 5s, let them skip
          />
        </div>

        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">Advertisement helps keep Spotibaiii free.</p>
          <button 
            onClick={finishAd} 
            disabled={!canSkip} 
            className={`px-6 py-2 rounded-full font-bold transition-all ${canSkip ? 'bg-spotibaiii text-black hover:scale-105 shadow-[0_0_15px_rgba(29,185,84,0.4)]' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
          >
            {canSkip ? 'Continue to Music' : `Resume in ${countdown}s...`}
          </button>
        </div>
      </div>
    </div>
  );
}