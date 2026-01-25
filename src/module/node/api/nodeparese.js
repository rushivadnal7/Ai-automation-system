const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  console.log('🚀 API Request:', {
    method: config.method || 'GET',
    url,
    body: config.body ? JSON.parse(config.body) : null,
  });

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    console.log('✅ API Response:', {
      status: response.status,
      data,
    });

    if (!response.ok) {
      throw new Error(data.detail || `HTTP Error ${response.status}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error('❌ API Error:', error);
    return { success: false, error: error.message };
  }
};

export const checkHealth = async () => {
  return await request('/health');
};

export const getApiInfo = async () => {
  return await request('/');
};

export const parsePipeline = async (nodes, edges) => {
  try {
    const response = await request('/pipelines/parse', {
      method: 'POST',
      body: JSON.stringify({ nodes, edges }),
    });

    if (!response.success && response.error) {
      let errorMessage = 'Failed to parse pipeline';
      
      try {
        const errorData = JSON.parse(response.error);
        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail
              .map(err => `${err.loc.join('.')}: ${err.msg}`)
              .join(', ');
          } else {
            errorMessage = errorData.detail;
          }
        }
      } catch {
        errorMessage = response.error;
      }

      return { success: false, error: errorMessage };
    }

    return response;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const analyzePipeline = async (nodes, edges) => {
  return await request('/pipelines/analyze', {
    method: 'POST',
    body: JSON.stringify({ nodes, edges }),
  });
};

export const validatePipelineData = (nodes, edges) => {
  const errors = [];

  if (!Array.isArray(nodes)) {
    errors.push('Nodes must be an array');
  }

  if (!Array.isArray(edges)) {
    errors.push('Edges must be an array');
  }

  if (Array.isArray(nodes)) {
    nodes.forEach((node, index) => {
      if (!node.id) {
        errors.push(`Node at index ${index} is missing an id`);
      }
    });
  }

  if (Array.isArray(edges)) {
    edges.forEach((edge, index) => {
      if (!edge.id) {
        errors.push(`Edge at index ${index} is missing an id`);
      }
      if (!edge.source) {
        errors.push(`Edge at index ${index} is missing source`);
      }
      if (!edge.target) {
        errors.push(`Edge at index ${index} is missing target`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const formatPipelineResult = (result) => {
  if (!result.success) {
    return `❌ Error: ${result.error}`;
  }

  const { num_nodes, num_edges, is_dag } = result.data;
  
  return `Pipeline Analysis Results
━━━━━━━━━━━━━━━━━━━━━━
📊 Number of Nodes: ${num_nodes}
🔗 Number of Edges: ${num_edges}
${is_dag ? '✅' : '❌'} Is DAG: ${is_dag ? 'Yes' : 'No'}

${!is_dag ? '⚠️  Warning: Your pipeline contains cycles and cannot be executed!' : '✓ Your pipeline is valid and can be executed!'}`;
};

const api = {
  checkHealth,
  getApiInfo,
  parsePipeline,
  analyzePipeline,
  validatePipelineData,
  formatPipelineResult,
};

export default api;