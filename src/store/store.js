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

  // ✅ Fixed: This should be getNodeID (matching what's used in ui.js)
  getNodeID: (type) => {
    const state = get();
    const current = state.nodeIDs[type] ?? 0;
    const updated = current + 1;

    // Update the counter
    set({
      nodeIDs: {
        ...state.nodeIDs,
        [type]: updated,
      },
    });

    // Return the new ID
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
}));