'use client';

import { useState, useEffect } from 'react';

export default function ModeIndicator() {
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/health');
        if (res.ok) {
          const data = await res.json();
          setIsLive(data.llm_mode === 'live');
        }
      } catch (e) {
        // fail silently
      } finally {
        setLoading(false);
      }
    };
    
    checkStatus();
  }, []);

  if (loading) return null;

  return (
    <>
      {!isLive && (
        <div className="bg-red-600 text-white text-xs font-bold uppercase tracking-widest text-center py-2 relative z-50">
          ⚠️ WARNING: SYSTEM IS IN TEST MODE. REASONING IS MOCKED. DO NOT USE FOR REAL DECISIONS. ⚠️
        </div>
      )}
      <div className={`fixed bottom-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg border backdrop-blur-md z-50 ${isLive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'}`}>
        {isLive ? (
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>LIVE INTELLIGENCE MODE</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-orange-500"></span>
            <span>EVALUATION TEST MODE</span>
          </div>
        )}
      </div>
    </>
  );
}
