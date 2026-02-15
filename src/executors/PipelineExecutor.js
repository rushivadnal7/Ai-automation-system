import { nodeExecutorFactory } from '../strategies/NodeExecutor';

export class PipelineExecutor {
  constructor(nodes, edges) {
    this.nodes = nodes;
    this.edges = edges;
    this.executionResults = new Map();
    this.executionOrder = [];
  }

  buildDependencyGraph() {
    const graph = new Map();
    const inDegree = new Map();

    this.nodes.forEach(node => {
      graph.set(node.id, []);
      inDegree.set(node.id, 0);
    });

    this.edges.forEach(edge => {
      if (graph.has(edge.source)) {
        graph.get(edge.source).push({
          targetNodeId: edge.target,
          targetHandle: edge.targetHandle,
          sourceHandle: edge.sourceHandle
        });
        inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
      }
    });

    return { graph, inDegree };
  }

  topologicalSort() {
    const { graph, inDegree } = this.buildDependencyGraph();
    const queue = [];
    const order = [];

    this.nodes.forEach(node => {
      if (inDegree.get(node.id) === 0) {
        queue.push(node.id);
      }
    });

    while (queue.length > 0) {
      const current = queue.shift();
      order.push(current);

      const neighbors = graph.get(current) || [];
      neighbors.forEach(neighbor => {
        const newDegree = inDegree.get(neighbor.targetNodeId) - 1;
        inDegree.set(neighbor.targetNodeId, newDegree);

        if (newDegree === 0) {
          queue.push(neighbor.targetNodeId);
        }
      });
    }

    return order.length === this.nodes.length ? order : null;
  }

  async execute() {
    this.executionOrder = this.topologicalSort();

    if (!this.executionOrder) {
      throw new Error('Pipeline contains cycles - cannot execute');
    }

    const { graph } = this.buildDependencyGraph();

    for (const nodeId of this.executionOrder) {
      const node = this.nodes.find(n => n.id === nodeId);
      if (!node) continue;

      const inputs = this.collectNodeInputs(nodeId, graph);
      const executor = nodeExecutorFactory.getExecutor(node.type);

      if (!executor) {
        this.executionResults.set(nodeId, {
          error: `No executor found for node type: ${node.type}`
        });
        continue;
      }

      try {
        const result = await executor.execute(node.data, inputs);
        this.executionResults.set(nodeId, result);
      } catch (error) {
        this.executionResults.set(nodeId, {
          error: error.message
        });
      }
    }

    return this.executionResults;
  }

  collectNodeInputs(nodeId, graph) {
    const inputs = {};

    this.edges.forEach(edge => {
      if (edge.target === nodeId) {
        const sourceResult = this.executionResults.get(edge.source);
        if (sourceResult) {
          const handleId = edge.targetHandle || 'input';
          const sourceHandle = edge.sourceHandle || 'output';
          
          inputs[handleId] = sourceResult[sourceHandle] || sourceResult.output || sourceResult;
        }
      }
    });

    return inputs;
  }

  getResults() {
    return Object.fromEntries(this.executionResults);
  }

  getExecutionOrder() {
    return this.executionOrder;
  }
}
