// store.js
import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  nodeIDs: {},
  getNodeID: (type) => {
    const state = get();
    const current = state.nodeIDs[type] ?? 0;
    const updated = current + 1;

    set({
      nodeIDs: {
        ...state.nodeIDs,
        [type]: updated,
      },
    });
    return `${type}-${updated}`;
  },

  addNode: (node) => {
    set({
      nodes: [...get().nodes, node]
    });
  },

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    const newEdge = {
      ...connection,
      id: `e${connection.source}-${connection.target}-${Date.now()}`,
      type: 'smoothstep',
      animated: true,
      markerEnd: {
        type: MarkerType.Arrow,
        height: '20px',
        width: '20px',
      },
    };

    set({
      edges: addEdge(newEdge, get().edges),
    });
  },

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, [fieldName]: fieldValue }
          };
        }
        return node;
      }),
    });
  },
  deleteNode: (nodeId) => {
    const state = get();

    const updatedNodes = state.nodes.filter((node) => node.id !== nodeId);

    const updatedEdges = state.edges.filter( (edge) => edge.source !== nodeId && edge.target !== nodeId);

    set({
      nodes: updatedNodes,
      edges: updatedEdges,
    });
  },
}));