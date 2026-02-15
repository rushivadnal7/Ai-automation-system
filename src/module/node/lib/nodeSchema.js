const createIcon = (path, color) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`size-4 text-[${ color.length < 1 ? color : '#fff'}]`}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const createNode = (config) => ({
  title: config.title,
  color: config.color,
  type: config.type || config.title.toLowerCase(),
  icon: createIcon(config.iconPath, config.color),
  description: config.description,
  fields: config.fields || [],
  inputs: config.inputs || [],
  outputs: config.outputs || []
});

const nodeConfigs = {
  customInput: {
    title: 'Input',
    color: '#3b82f6',
    type: 'customInput',
    iconPath: 'M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25',
    description: 'Define an input parameter',
    fields: [
      { name: 'inputName', label: 'Name', type: 'text', default: (id) => id.replace('dynamic-', 'input_') },
      { name: 'inputType', label: 'Type', type: 'select', options: ['Text', 'Number', 'Boolean', 'Array'], default: 'Text' }
    ],
    outputs: [{ id: 'output', position: 50 }]
  },
  customOutput: {
    title: 'Output',
    color: '#ef4444',
    type: 'customOutput',
    iconPath: 'M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9',
    description: 'Define an output result',
    fields: [
      { name: 'outputName', label: 'Name', type: 'text', default: (id) => id.replace('dynamic-', 'output_') },
      { name: 'outputType', label: 'Type', type: 'select', options: ['Text', 'Number', 'Boolean', 'Array'], default: 'Text' }
    ],
    inputs: [{ id: 'input', position: 50 }]
  },
  text: {
    title: 'Text',
    color: '#06b6d4',
    iconPath: 'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z',
    description: 'Text with variable interpolation',
    fields: [
      { name: 'text', label: 'Text', type: 'textarea', default: '', placeholder: 'Use {{variable}} for dynamic inputs' }
    ],
    inputs: {
      dynamic: true,
      parseFrom: 'text',
      pattern: /\{\{([^}]+)\}\}/g
    },
    outputs: [{ id: 'output', position: 50 }]
  },
  llm: {
    title: 'LLM',
    color: '#8b5cf6',
    iconPath: 'M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z',
    description: 'AI language model',
    fields: [
      { name: 'modelName', label: 'Model', type: 'select', options: ['GPT-4', 'GPT-3.5', 'Claude-3', 'Gemini'], default: 'GPT-4' },
      { name: 'temperature', label: 'Temperature', type: 'number', default: 0.7, min: 0, max: 2, step: 0.1 }
    ],
    inputs: [
      { id: 'system', position: 25 },
      { id: 'prompt', position: 75 }
    ],
    outputs: [{ id: 'response', position: 50 }]
  },
  transform: {
    title: 'Transform',
    color: '#10b981',
    iconPath: 'M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5',
    description: 'Transform data',
    fields: [
      { name: 'operation', label: 'Operation', type: 'select', options: ['Map', 'Filter', 'Reduce', 'Sort'], default: 'Map' },
      { name: 'expression', label: 'Expression', type: 'textarea', default: '', placeholder: 'Enter transformation logic' }
    ],
    inputs: [{ id: 'data', position: 50 }],
    outputs: [{ id: 'result', position: 50 }]
  },
  conditional: {
    title: 'Conditional',
    color: '#f59e0b',
    iconPath: 'M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75',
    description: 'Branch on condition',
    fields: [
      { name: 'condition', label: 'Condition', type: 'text', default: '', placeholder: 'e.g., value > 10' }
    ],
    inputs: [{ id: 'input', position: 50 }],
    outputs: [
      { id: 'true', position: 33 },
      { id: 'false', position: 66 }
    ]
  },
  api: {
    title: 'API',
    color: '#ec4899',
    iconPath: 'm6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z',
    description: 'Make HTTP requests',
    fields: [
      { name: 'method', label: 'Method', type: 'select', options: ['GET', 'POST', 'PUT', 'DELETE'], default: 'GET' },
      { name: 'url', label: 'URL', type: 'text', default: '', placeholder: 'https://api.example.com' },
      { name: 'headers', label: 'Headers', type: 'textarea', default: '{}', placeholder: 'JSON headers' }
    ],
    inputs: [{ id: 'body', position: 50 }],
    outputs: [
      { id: 'response', position: 33 },
      { id: 'error', position: 66 }
    ]
  },
  database: {
    title: 'Database',
    color: '#06b6d4',
    iconPath: 'm7.875 14.25 1.214 1.942a2.25 2.25 0 0 0 1.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 0 1 1.872 1.002l.164.246a2.25 2.25 0 0 0 1.872 1.002h2.092a2.25 2.25 0 0 0 1.872-1.002l.164-.246A2.25 2.25 0 0 1 16.954 9h4.636M2.41 9a2.25 2.25 0 0 0-.16.832V12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 0 1 .382-.632l3.285-3.832a2.25 2.25 0 0 1 1.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0 0 21.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 0 0 2.25 2.25Z',
    description: 'Database operations',
    fields: [
      { name: 'operation', label: 'Operation', type: 'select', options: ['SELECT', 'INSERT', 'UPDATE', 'DELETE'], default: 'SELECT' },
      { name: 'query', label: 'Query', type: 'textarea', default: '', placeholder: 'SQL query' }
    ],
    inputs: [{ id: 'params', position: 50 }],
    outputs: [{ id: 'result', position: 50 }]
  },
  delay: {
    title: 'Delay',
    color: '#6366f1',
    iconPath: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    description: 'Delay execution',
    fields: [
      { name: 'duration', label: 'Duration (ms)', type: 'number', default: 1000, min: 0, step: 100 }
    ],
    inputs: [{ id: 'input', position: 50 }],
    outputs: [{ id: 'output', position: 50 }]
  }
};

export const nodeSchemas = Object.keys(nodeConfigs).reduce((acc, key) => {
  acc[key] = createNode(nodeConfigs[key]);
  return acc;
}, {});