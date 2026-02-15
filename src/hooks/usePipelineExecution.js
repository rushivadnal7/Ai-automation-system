import { useState, useCallback } from 'react';
import { PipelineManager } from '../core/PipelineManager';
import { useStore } from '../../../store/store';

export const usePipelineExecution = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionError, setExecutionError] = useState(null);
  const setExecutionResults = useStore((state) => state.setExecutionResults);

  const executePipeline = useCallback(async (nodes, edges) => {
    setIsExecuting(true);
    setExecutionError(null);

    try {
      const manager = new PipelineManager(nodes, edges);
      const result = await manager.execute();
      
      setExecutionResults(result.results);
      
      return {
        success: true,
        ...result
      };
    } catch (error) {
      setExecutionError(error.message);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setIsExecuting(false);
    }
  }, [setExecutionResults]);

  const analyzePipeline = useCallback((nodes, edges) => {
    try {
      const manager = new PipelineManager(nodes, edges);
      return manager.getAnalysis();
    } catch (error) {
      return {
        num_nodes: 0,
        num_edges: 0,
        is_dag: false,
        error: error.message
      };
    }
  }, []);

  return {
    executePipeline,
    analyzePipeline,
    isExecuting,
    executionError
  };
};
