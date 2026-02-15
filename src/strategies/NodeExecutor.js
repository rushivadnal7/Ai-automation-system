export class NodeExecutor {
  async execute(nodeData, inputs) {
    throw new Error('execute() must be implemented');
  }

  validateInputs(inputs, schema) {
    return { isValid: true, errors: [] };
  }
}

export class InputNodeExecutor extends NodeExecutor {
  async execute(nodeData, inputs) {
    const { inputName, inputType } = nodeData;
    
    let value = inputs.default || '';
    
    if (inputType === 'Number') {
      value = parseFloat(value) || 0;
    } else if (inputType === 'Boolean') {
      value = Boolean(value);
    } else if (inputType === 'Array') {
      value = Array.isArray(value) ? value : [];
    }
    
    return {
      [inputName]: value,
      output: value
    };
  }
}

export class OutputNodeExecutor extends NodeExecutor {
  async execute(nodeData, inputs) {
    const { outputName } = nodeData;
    const inputValue = inputs.input;
    
    return {
      [outputName]: inputValue,
      result: inputValue
    };
  }
}

export class TextNodeExecutor extends NodeExecutor {
  async execute(nodeData, inputs) {
    let { text } = nodeData;
    
    const variablePattern = /\{\{([^}]+)\}\}/g;
    const matches = [...text.matchAll(variablePattern)];
    
    matches.forEach((match) => {
      const variable = match[1].trim().replace(/\s+/g, '_');
      const value = inputs[variable] || '';
      text = text.replace(match[0], value);
    });
    
    return {
      output: text,
      processedText: text
    };
  }
}

export class LLMNodeExecutor extends NodeExecutor {
  async execute(nodeData, inputs) {
    const { modelName, temperature } = nodeData;
    const systemPrompt = inputs.system || '';
    const userPrompt = inputs.prompt || '';
    
    const mockResponse = `[${modelName}] Response to: "${userPrompt}" (temp: ${temperature})`;
    
    return {
      response: mockResponse,
      model: modelName,
      temperature: parseFloat(temperature)
    };
  }

  validateInputs(inputs, schema) {
    const errors = [];
    
    if (!inputs.prompt) {
      errors.push('Prompt input is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export class TransformNodeExecutor extends NodeExecutor {
  async execute(nodeData, inputs) {
    const { operation, expression } = nodeData;
    const data = inputs.data;
    
    if (!Array.isArray(data)) {
      return {
        result: data,
        error: 'Input must be an array'
      };
    }
    
    let result = data;
    
    try {
      switch (operation) {
        case 'Map':
          result = data.map(item => this.evaluateExpression(expression, item));
          break;
        case 'Filter':
          result = data.filter(item => this.evaluateExpression(expression, item));
          break;
        case 'Sort':
          result = [...data].sort((a, b) => {
            const aVal = this.evaluateExpression(expression, a);
            const bVal = this.evaluateExpression(expression, b);
            return aVal > bVal ? 1 : -1;
          });
          break;
        case 'Reduce':
          result = data.reduce((acc, item) => acc + this.evaluateExpression(expression, item), 0);
          break;
      }
    } catch (error) {
      return {
        result: data,
        error: error.message
      };
    }
    
    return {
      result,
      operation
    };
  }

  evaluateExpression(expr, item) {
    return item;
  }
}

export class ConditionalNodeExecutor extends NodeExecutor {
  async execute(nodeData, inputs) {
    const { condition } = nodeData;
    const inputValue = inputs.input;
    
    const result = this.evaluateCondition(condition, inputValue);
    
    return {
      true: result ? inputValue : null,
      false: !result ? inputValue : null,
      conditionMet: result
    };
  }

  evaluateCondition(condition, value) {
    try {
      const sanitizedCondition = condition.replace(/value/g, JSON.stringify(value));
      return eval(sanitizedCondition);
    } catch {
      return false;
    }
  }
}

export class APINodeExecutor extends NodeExecutor {
  async execute(nodeData, inputs) {
    const { method, url, headers } = nodeData;
    const body = inputs.body;
    
    try {
      const parsedHeaders = JSON.parse(headers || '{}');
      
      const mockResponse = {
        status: 200,
        data: { message: 'Mock API response', method, url }
      };
      
      return {
        response: mockResponse,
        error: null
      };
    } catch (error) {
      return {
        response: null,
        error: error.message
      };
    }
  }
}

export class DatabaseNodeExecutor extends NodeExecutor {
  async execute(nodeData, inputs) {
    const { operation, query } = nodeData;
    const params = inputs.params || {};
    
    const mockResult = {
      operation,
      query,
      rows: [],
      affectedRows: 0
    };
    
    return {
      result: mockResult
    };
  }
}

export class DelayNodeExecutor extends NodeExecutor {
  async execute(nodeData, inputs) {
    const { duration } = nodeData;
    const inputValue = inputs.input;
    
    await new Promise(resolve => setTimeout(resolve, parseInt(duration) || 0));
    
    return {
      output: inputValue,
      delayApplied: duration
    };
  }
}

class NodeExecutorFactory {
  constructor() {
    this.executors = new Map();
    this.registerDefaultExecutors();
  }

  registerDefaultExecutors() {
    this.executors.set('customInput', new InputNodeExecutor());
    this.executors.set('customOutput', new OutputNodeExecutor());
    this.executors.set('text', new TextNodeExecutor());
    this.executors.set('llm', new LLMNodeExecutor());
    this.executors.set('transform', new TransformNodeExecutor());
    this.executors.set('conditional', new ConditionalNodeExecutor());
    this.executors.set('api', new APINodeExecutor());
    this.executors.set('database', new DatabaseNodeExecutor());
    this.executors.set('delay', new DelayNodeExecutor());
  }

  register(nodeType, executor) {
    this.executors.set(nodeType, executor);
  }

  getExecutor(nodeType) {
    return this.executors.get(nodeType);
  }

  hasExecutor(nodeType) {
    return this.executors.has(nodeType);
  }
}

export const nodeExecutorFactory = new NodeExecutorFactory();
