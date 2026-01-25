import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from '../store/store';
import 'reactflow/dist/style.css';
import DynamicNode from '../module/node/components/DynamicNode';
import { nodeSchemas } from '../module/node/lib/nodeSchema';
import { NodeSuggestions } from '../module/aiSuggestions/components/NodeSugestion';
import { executePipeline } from '../module/node/utils/executePipeline';

const nodeTypes = {
  dynamic: DynamicNode,
};

const gridSize = 20;
const proOptions = { hideAttribution: true };

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [showLogs, setShowLogs] = useState(false);

  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const getNodeID = useStore((state) => state.getNodeID);
  const addNode = useStore((state) => state.addNode);
  const onNodesChange = useStore((state) => state.onNodesChange);
  const onEdgesChange = useStore((state) => state.onEdgesChange);
  const onConnect = useStore((state) => state.onConnect);
  const executionLogs = useStore((state) => state.executionLogs);
  const isExecuting = useStore((state) => state.isExecuting);
  const setExecutionResult = useStore((state) => state.setExecutionResult);
  const addExecutionLog = useStore((state) => state.addExecutionLog);
  const clearExecution = useStore((state) => state.clearExecution);
  const setIsExecuting = useStore((state) => state.setIsExecuting);

  const getInitNodeData = (nodeID, type) => {
    let nodeData = { id: nodeID, nodeType: `${type}` };
    return nodeData;
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData('application/reactflow')) {
        const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        const type = appData?.nodeType;
        const schema = nodeSchemas[type];

        if (!schema) return;

        if (typeof type === 'undefined' || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID('dynamic');
        const newNode = {
          id: nodeID,
          type: 'dynamic',
          position,
          data: {
            ...getInitNodeData(nodeID, type),
            schema,
          },
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleAddNodeFromSuggestion = (type, position) => {
    const nodeID = getNodeID('dynamic');
    const schema = nodeSchemas[type];

    const newNode = {
      id: nodeID,
      type: 'dynamic',
      position,
      data: {
        ...getInitNodeData(nodeID, type),
        schema,
      },
    };

    addNode(newNode);
  };

  const handleExecute = async () => {
    if (nodes.length === 0) {
      addExecutionLog('No nodes to execute');
      return;
    }

    setIsExecuting(true);
    clearExecution();
    setShowLogs(true);
    addExecutionLog('Starting pipeline execution...');

    try {
      await executePipeline(nodes, edges, setExecutionResult, addExecutionLog);
    } catch (error) {
      addExecutionLog(`Pipeline error: ${error.message}`);
    }

    setIsExecuting(false);
  };

  return (
    <>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-[400px] h-[400px] opacity-70"
        >
          <source src="/circular-gradient.mp4" type="video/mp4" />
        </video>
        <span className='text-white absolute yellowtail bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm py-2 rounded-[8px] filter px-3 text-[18px] font-semibold z-20 '>VECTOR SHIFT</span>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] rounded-full animate-float" style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }} />
        <div className="absolute bottom-[10%] right-[20%] w-[400px] h-[400px] rounded-full animate-float-delayed" style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full animate-float-slow" style={{
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
          filter: 'blur(80px)'
        }} />
      </div>

      <div className="absolute top-4 right-4 z-30 flex gap-2">
        <button
          onClick={handleExecute}
          disabled={isExecuting || nodes.length === 0}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          {isExecuting ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Running...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
              Run Pipeline
            </>
          )}
        </button>
        
        {executionLogs.length > 0 && (
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-200 shadow-lg"
          >
            {showLogs ? 'Hide' : 'Show'} Logs
          </button>
        )}
      </div>

      <div ref={reactFlowWrapper} className="w-screen h-screen relative z-20" style={{ background: 'transparent' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          proOptions={proOptions}
          snapGrid={[gridSize, gridSize]}
          connectionLineType="smoothstep"
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
            style: {
              stroke: '#8b5cf6',
              strokeWidth: 2,
              filter: 'drop-shadow(0 0 6px #8b5cf6)',
            },
            markerEnd: {
              type: 'arrowclosed',
              color: '#8b5cf6',
              width: 20,
              height: 20,
            },
            labelStyle: {
              fill: '#fff',
              fontWeight: 500,
              fontSize: 12,
            },
            labelBgStyle: {
              fill: 'rgba(139, 92, 246, 0.2)',
              fillOpacity: 0.8,
            },
            labelBgPadding: [8, 4],
            labelBgBorderRadius: 4,
          }}
        >
          <Background
            color="rgba(139, 92, 246, 0.08)"
            gap={gridSize}
            style={{ backgroundColor: 'transparent' }}
          />

          <Controls className="!bg-white/5 !backdrop-blur-xl !border !border-white/10 !rounded-xl !overflow-hidden !shadow-[0_8px_32px_0_rgba(139,92,246,0.3)]" />

          <MiniMap
            className="!bg-black/50 !backdrop-blur-xl !border !border-white/10 !rounded-xl !overflow-hidden !shadow-[0_8px_32px_0_rgba(139,92,246,0.3)]"
            maskColor="rgba(0, 0, 0, 0.6)"
            nodeColor={(node) => {
              const schema = node.data?.schema;
              return schema?.color || '#888';
            }}
          />
        </ReactFlow>
      </div>

      {showLogs && executionLogs.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 h-48 bg-black/90 backdrop-blur-xl border-t border-white/10 z-40 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
              <span className="text-white font-semibold text-sm">Execution Logs</span>
              <div className="flex gap-2">
                <button
                  onClick={() => clearExecution()}
                  className="text-xs text-white/60 hover:text-white transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => setShowLogs(false)}
                  className="text-xs text-white/60 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-1">
              {executionLogs.map((log, idx) => (
                <div key={idx} className="text-xs font-mono text-white/80 flex gap-2">
                  <span className="text-purple-400">[{log.time}]</span>
                  <span>{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(20px, 20px);
          }
          50% {
            transform: translate(-20px, 20px);
          }
          75% {
            transform: translate(-20px, -20px);
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 10s ease-in-out infinite;
          animation-delay: 2s;
        }
        .animate-float-slow {
          animation: float 12s ease-in-out infinite;
          animation-delay: 4s;
        }
      `}</style>

      <NodeSuggestions
        nodes={nodes}
        edges={edges}
        onAddNode={handleAddNodeFromSuggestion}
      />
    </>
  );
};