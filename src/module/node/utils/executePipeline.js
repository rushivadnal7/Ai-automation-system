export const executePipeline = async (nodes, edges, updateResult, addLog) => {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const executed = new Map();
  
  const getInputNodes = () => {
    const targetNodes = new Set(edges.map(e => e.target));
    return nodes.filter(n => !targetNodes.has(n.id));
  };

  const getNodeInputs = (nodeId) => {
    const inputs = {};
    const incomingEdges = edges.filter(e => e.target === nodeId);
    
    for (const edge of incomingEdges) {
      const sourceNode = nodeMap.get(edge.source);
      const result = executed.get(edge.source);
      
      if (result !== undefined) {
        inputs[edge.targetHandle || 'input'] = result;
      }
    }
    
    return inputs;
  };

  const executeNode = async (node) => {
    const nodeType = node.data.nodeType;
    const inputs = getNodeInputs(node.id);
    
    addLog(`Executing ${nodeType} node: ${node.id}`);
    
    try {
      let result;
      
      switch (nodeType) {
        case 'input':
          result = node.data.inputValue || '';
          addLog(`Input node output: "${result.substring(0, 50)}${result.length > 50 ? '...' : ''}"`);
          break;
          
        case 'api':
          const method = node.data.method || 'GET';
          const url = node.data.url || '';
          
          if (!url) {
            throw new Error('API URL is required');
          }
          
          addLog(`Making ${method} request to ${url}`);
          
          const response = await fetch(url, {
            method: method,
            headers: method !== 'GET' ? { 'Content-Type': 'application/json' } : {},
            body: method !== 'GET' && inputs.input ? JSON.stringify({ data: inputs.input }) : undefined
          });
          
          const data = await response.json();
          result = JSON.stringify(data, null, 2);
          addLog(`API response received (${response.status})`);
          break;
          
        case 'llm':
          let prompt = node.data.prompt || '';
          
          Object.keys(inputs).forEach(key => {
            const placeholder = `{{${key}}}`;
            prompt = prompt.replace(new RegExp(placeholder, 'g'), inputs[key]);
          });
          
          addLog(`LLM processing prompt with ${node.data.model || 'GPT-3.5'}`);
          result = `[${node.data.model || 'GPT-3.5'} Response]\n\nProcessed prompt:\n${prompt}\n\nSimulated AI response based on the input.`;
          break;
          
        case 'text':
          let text = node.data.text || '';
          
          Object.keys(inputs).forEach(key => {
            const placeholder = `{{${key}}}`;
            text = text.replace(new RegExp(placeholder, 'g'), inputs[key]);
          });
          
          result = text;
          addLog(`Text template processed`);
          break;
          
        case 'output':
          result = inputs.input || inputs.output || Object.values(inputs)[0] || 'No input received';
          addLog(`Output node received data`);
          break;
          
        case 'note':
          result = node.data.noteText || 'Note content';
          break;
          
        default:
          result = inputs.input || 'No input';
      }
      
      executed.set(node.id, result);
      updateResult(node.id, result);
      return result;
      
    } catch (error) {
      const errorMsg = `Error: ${error.message}`;
      addLog(errorMsg);
      updateResult(node.id, errorMsg);
      executed.set(node.id, errorMsg);
      return errorMsg;
    }
  };

  const executeInOrder = async () => {
    const visited = new Set();
    const executing = new Set();
    
    const visit = async (nodeId) => {
      if (visited.has(nodeId)) return;
      if (executing.has(nodeId)) {
        addLog(`Circular dependency detected at ${nodeId}`);
        return;
      }
      
      executing.add(nodeId);
      
      const incomingEdges = edges.filter(e => e.target === nodeId);
      for (const edge of incomingEdges) {
        await visit(edge.source);
      }
      
      const node = nodeMap.get(nodeId);
      if (node) {
        await executeNode(node);
      }
      
      executing.delete(nodeId);
      visited.add(nodeId);
    };
    
    const startNodes = getInputNodes();
    
    if (startNodes.length === 0 && nodes.length > 0) {
      addLog('No input nodes found, executing all nodes');
      for (const node of nodes) {
        await visit(node.id);
      }
    } else {
      for (const node of startNodes) {
        await visit(node.id);
      }
      
      for (const node of nodes) {
        if (!visited.has(node.id)) {
          await visit(node.id);
        }
      }
    }
  };

  await executeInOrder();
  addLog('Pipeline execution completed');
};  