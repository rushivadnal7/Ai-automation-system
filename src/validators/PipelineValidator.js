export class PipelineValidator {
  constructor(nodes, edges) {
    this.nodes = nodes;
    this.edges = edges;
    this.errors = [];
    this.warnings = [];
  }

  validate() {
    this.errors = [];
    this.warnings = [];

    this.validateNodes();
    this.validateEdges();
    this.validateDAG();
    this.validateConnections();

    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  validateNodes() {
    if (!Array.isArray(this.nodes) || this.nodes.length === 0) {
      this.errors.push('Pipeline must contain at least one node');
      return;
    }

    const nodeIds = new Set();
    this.nodes.forEach((node, index) => {
      if (!node.id) {
        this.errors.push(`Node at index ${index} is missing an id`);
      }

      if (nodeIds.has(node.id)) {
        this.errors.push(`Duplicate node id: ${node.id}`);
      }
      nodeIds.add(node.id);

      if (!node.type) {
        this.errors.push(`Node ${node.id} is missing a type`);
      }
    });
  }

  validateEdges() {
    if (!Array.isArray(this.edges)) {
      this.errors.push('Edges must be an array');
      return;
    }

    const nodeIds = new Set(this.nodes.map(n => n.id));
    const edgeIds = new Set();

    this.edges.forEach((edge, index) => {
      if (!edge.id) {
        this.errors.push(`Edge at index ${index} is missing an id`);
      }

      if (edgeIds.has(edge.id)) {
        this.errors.push(`Duplicate edge id: ${edge.id}`);
      }
      edgeIds.add(edge.id);

      if (!edge.source) {
        this.errors.push(`Edge ${edge.id} is missing source`);
      } else if (!nodeIds.has(edge.source)) {
        this.errors.push(`Edge ${edge.id} references non-existent source node: ${edge.source}`);
      }

      if (!edge.target) {
        this.errors.push(`Edge ${edge.id} is missing target`);
      } else if (!nodeIds.has(edge.target)) {
        this.errors.push(`Edge ${edge.id} references non-existent target node: ${edge.target}`);
      }
    });
  }

  validateDAG() {
    const graph = new Map();
    const inDegree = new Map();

    this.nodes.forEach(node => {
      graph.set(node.id, []);
      inDegree.set(node.id, 0);
    });

    this.edges.forEach(edge => {
      if (graph.has(edge.source)) {
        graph.get(edge.source).push(edge.target);
        inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
      }
    });

    const queue = [];
    this.nodes.forEach(node => {
      if (inDegree.get(node.id) === 0) {
        queue.push(node.id);
      }
    });

    let processedNodes = 0;
    while (queue.length > 0) {
      const current = queue.shift();
      processedNodes++;

      const neighbors = graph.get(current) || [];
      neighbors.forEach(neighbor => {
        const newDegree = inDegree.get(neighbor) - 1;
        inDegree.set(neighbor, newDegree);

        if (newDegree === 0) {
          queue.push(neighbor);
        }
      });
    }

    if (processedNodes !== this.nodes.length) {
      this.errors.push('Pipeline contains cycles - not a valid DAG');
    }
  }

  validateConnections() {
    const nodeMap = new Map(this.nodes.map(n => [n.id, n]));

    this.nodes.forEach(node => {
      const incomingEdges = this.edges.filter(e => e.target === node.id);
      const outgoingEdges = this.edges.filter(e => e.source === node.id);

      if (node.type === 'customInput' && incomingEdges.length > 0) {
        this.warnings.push(`Input node ${node.id} has incoming connections`);
      }

      if (node.type === 'customOutput' && outgoingEdges.length > 0) {
        this.warnings.push(`Output node ${node.id} has outgoing connections`);
      }

      if (incomingEdges.length === 0 && node.type !== 'customInput') {
        this.warnings.push(`Node ${node.id} has no input connections`);
      }

      if (outgoingEdges.length === 0 && node.type !== 'customOutput') {
        this.warnings.push(`Node ${node.id} has no output connections`);
      }
    });
  }
}
