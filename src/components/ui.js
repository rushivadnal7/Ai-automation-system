// components/ui.js
import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from '../store/store';
import 'reactflow/dist/style.css';
import DynamicNode from '../module/node/components/DynamicNode';
import { nodeSchemas } from '../module/node/lib/nodeSchema';
import { NodeSuggestions } from '../module/node/components/NodeSugestion';

const nodeTypes = {
  dynamic: DynamicNode,
};

const gridSize = 20;
const proOptions = { hideAttribution: true };

// ✅ Remove the selector - use direct store access instead
export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // ✅ Access store values directly without a selector
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const getNodeID = useStore((state) => state.getNodeID);
  const addNode = useStore((state) => state.addNode);
  const onNodesChange = useStore((state) => state.onNodesChange);
  const onEdgesChange = useStore((state) => state.onEdgesChange);
  const onConnect = useStore((state) => state.onConnect);

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

  return (
    <>
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