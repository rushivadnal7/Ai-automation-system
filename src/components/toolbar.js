// components/toolbar.js
import { useState } from 'react';
import { DraggableNode } from './draggableNode';
import { nodeSchemas } from '../module/node/lib/nodeSchema';
import { useStore } from '../store/store';

// ✅ Remove the selector
export const PipelineToolbar = () => {
  const [isOpen, setIsOpen] = useState(true);
  
  // ✅ Access store values directly
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 left-5 z-[100] w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 cursor-pointer flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-105 text-white"
        style={{ boxShadow: '0 8px 32px 0 rgba(139, 92, 246, 0.3)' }}
      >
        {
          !isOpen ?
            <svg
              className="w-6 h-6 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            :
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        }
      </button>

      <div
        className={`fixed left-[88px] top-5 z-[50] items-center gap-10 justify-center flex max-h-[100px] p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-[30px] border border-white/18 transition-all duration-[400ms] ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full pointer-events-none'
          }`}
        style={{ boxShadow: '0 8px 60px 0 rgba(139, 92, 246, 0.4), inset 0 0 30px rgba(255, 255, 255, 0.05)' }}
      >
        <div className="mb-5">
          <h3 className="text-white font-bold text-lg m-0 flex items-center gap-2">
            Node Library
          </h3>
          <p className="text-white/60 text-xs mt-1 mb-0">
            Drag and drop nodes to canvas
          </p>
          <span className="text-white/70 text-sm font-medium mr-6 mt-10">Nodes: {nodes.length}</span>
          <span className="text-white/70 text-sm font-medium">Edges: {edges.length}</span>
        </div>

        <div className="flex items-center gap-3 overflow-y-auto pr-2 custom-scrollbar">
          {
            nodeSchemas && Object.keys(nodeSchemas).map((key) => {
              const schema = nodeSchemas[key];
              return (
                <DraggableNode key={key} type={schema.type} label={schema.title} />
              );
            })
          }
        </div>

        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-30 -z-10 pointer-events-none"
          style={{ filter: 'blur(40px)' }}
        />
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
      `}</style>
    </>
  );
};