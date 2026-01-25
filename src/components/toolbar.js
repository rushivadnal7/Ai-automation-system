import { useState } from 'react';
import { DraggableNode } from './draggableNode';
import { nodeSchemas } from '../module/node/lib/nodeSchema';
import { useStore } from '../store/store';

export const PipelineToolbar = () => {
  const [isOpen, setIsOpen] = useState(true);
  
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[100] w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 cursor-pointer flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-105 text-white"
        style={{ boxShadow: '0 4px 20px 0 rgba(59, 130, 246, 0.3)' }}
      >
        {
          !isOpen ?
            <svg
              className="w-5 h-5 transition-transform duration-300"
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        }
      </button>

      <div
        className={`fixed left-[64px] top-4 z-[50] flex gap-4 items-center p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-[30px] border border-white/18 transition-all duration-[400ms] ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full pointer-events-none'
          }`}
        style={{ boxShadow: '0 4px 30px 0 rgba(59, 130, 246, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.05)' }}
      >
        <div className="flex flex-col gap-0.5 pr-3 border-r border-white/10">
          <h3 className="text-white font-semibold text-sm m-0 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            Library
          </h3>
          <div className="flex gap-3 text-[10px]">
            <span className="text-white/60">Nodes: {nodes.length}</span>
            <span className="text-white/60">Edges: {edges.length}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pr-2 custom-scrollbar ">
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
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/15 to-purple-500/15 opacity-40 -z-10 pointer-events-none"
          style={{ filter: 'blur(30px)' }}
        />
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </>
  );
};