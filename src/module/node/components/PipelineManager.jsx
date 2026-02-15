import { PipelineExecutor } from '../executors/PipelineExecutor';
import { PipelineValidator } from '../validators/PipelineValidator';

export class PipelineManager {
  constructor(nodes, edges) {
    this.nodes = nodes;
    this.edges = edges;
    this.validator = new PipelineValidator(nodes, edges);
    this.executor = null;
  }

  validate() {
    return this.validator.validate();
  }

  async execute() {
    const validation = this.validate();
    
    if (!validation.isValid) {
      throw new Error(`Pipeline validation failed: ${validation.errors.join(', ')}`);
    }

    this.executor = new PipelineExecutor(this.nodes, this.edges);
    const results = await this.executor.execute();
    
    return {
      results: this.executor.getResults(),
      executionOrder: this.executor.getExecutionOrder(),
      validation
    };
  }

  getAnalysis() {
    const validation = this.validate();
    
    return {
      num_nodes: this.nodes.length,
      num_edges: this.edges.length,
      is_dag: validation.isValid && !validation.errors.some(e => e.includes('cycle')),
      validation
    };
  }
}
