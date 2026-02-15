import React from 'react';

export const RunPipelineButton = ({ onClick, isExecuting, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={isExecuting || disabled}
      className={`px-6 py-4 text-base font-bold text-white rounded-[50px] border border-white/30 outline-none transition-all duration-300 flex items-center gap-2.5 ${
        isExecuting || disabled
          ? 'bg-gradient-to-br from-purple-500/40 to-blue-500/40 opacity-60 cursor-not-allowed'
          : 'bg-gradient-to-br from-purple-500/80 to-blue-500/80 hover:-translate-y-0.5 hover:scale-[1.02] cursor-pointer'
      }`}
      style={{
        boxShadow: isExecuting || disabled
          ? '0 8px 32px 0 rgba(139, 92, 246, 0.3)'
          : '0 8px 32px 0 rgba(139, 92, 246, 0.6), 0 0 60px rgba(139, 92, 246, 0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {!isExecuting && (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth="2.5" 
          stroke="currentColor" 
          className="w-5 h-5"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" 
          />
        </svg>
      )}

      <span>{isExecuting ? 'Running Pipeline...' : 'Run Pipeline'}</span>

      {!isExecuting && !disabled && (
        <div className="absolute inset-0 rounded-[50px] bg-gradient-to-br from-purple-500/60 to-pink-500/60 opacity-60 -z-10 pointer-events-none animate-glow blur-lg" />
      )}

      {isExecuting && (
        <div className="w-[18px] h-[18px] border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
      )}

      <style jsx>{`
        @keyframes glow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
    </button>
  );
};