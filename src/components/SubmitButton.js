import React, { useState } from 'react';
import { useReactFlow } from 'reactflow';
import { parsePipeline } from '../module/node/api/nodeparese';
import PipelineResultModal from '../module/node/components/PipelineResultModal';

const SubmitButton = () => {
  const { getNodes, getEdges } = useReactFlow();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const nodes = getNodes();
      const edges = getEdges();

      const pipelineResult = await parsePipeline(nodes, edges);
      
      setResult(pipelineResult);
      setModalOpen(true);
    } catch (error) {
      setResult({
        success: false,
        error: error.message || 'An unexpected error occurred',
      });
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-12 py-4 text-base font-bold text-white rounded-[50px] border border-white/30 outline-none transition-all duration-300 flex items-center gap-2.5 ${
          loading
            ? 'bg-gradient-to-br from-purple-500/40 to-blue-500/40 opacity-60 cursor-not-allowed'
            : 'bg-gradient-to-br from-purple-500/80 to-blue-500/80 hover:-translate-y-0.5 hover:scale-[1.02] cursor-pointer'
        }`}
        style={{
          boxShadow: loading
            ? '0 8px 32px 0 rgba(139, 92, 246, 0.3)'
            : '0 8px 32px 0 rgba(139, 92, 246, 0.6), 0 0 60px rgba(139, 92, 246, 0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <span>{loading ? 'Analyzing Pipeline...' : 'Submit Pipeline'}</span>

        {!loading && (
          <div className="absolute inset-0 rounded-[50px] bg-gradient-to-br from-purple-500/60 to-pink-500/60 opacity-60 -z-10 pointer-events-none animate-glow blur-lg" />
        )}

        {loading && (
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

      <PipelineResultModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        result={result}
      />
    </>
  );
};

export default SubmitButton;