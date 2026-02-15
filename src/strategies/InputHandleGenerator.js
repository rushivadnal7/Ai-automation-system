export class InputHandleGenerator {
  generate(schema, nodeData) {
    throw new Error('generate() must be implemented');
  }
}

export class StaticInputHandleGenerator extends InputHandleGenerator {
  generate(schema, nodeData) {
    return Array.isArray(schema.inputs) ? schema.inputs : [];
  }
}

export class DynamicInputHandleGenerator extends InputHandleGenerator {
  generate(schema, nodeData) {
    const { parseFrom, pattern } = schema.inputs;
    const sourceText = nodeData[parseFrom];

    if (!sourceText || !pattern) {
      return [];
    }

    const matches = [...sourceText.matchAll(pattern)];
    const uniqueVars = new Set();
    const inputs = [];

    matches.forEach((match) => {
      const variable = match[1].trim().replace(/\s+/g, '_');
      if (!uniqueVars.has(variable)) {
        inputs.push({
          id: variable,
          position: undefined,
        });
        uniqueVars.add(variable);
      }
    });

    return inputs.map((h, i, arr) => ({
      ...h,
      position: h.position ?? (100 / (arr.length + 1)) * (i + 1),
    }));
  }
}

export class InputHandleGeneratorFactory {
  static create(schema) {
    if (schema.inputs?.dynamic) {
      return new DynamicInputHandleGenerator();
    }
    return new StaticInputHandleGenerator();
  }
}
