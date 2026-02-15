import React from 'react';

export class FieldStrategy {
  render(field, value, onChange) {
    throw new Error('render() must be implemented');
  }

  validate(value, field) {
    return { isValid: true, error: null };
  }

  getDefaultValue(field, nodeId) {
    return typeof field.default === 'function' 
      ? field.default(nodeId) 
      : field.default || '';
  }
}

const baseClasses = "w-full px-3 py-2 text-sm text-white bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg outline-none transition-all duration-200 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 shadow-inner";

export class TextFieldStrategy extends FieldStrategy {
  render(field, value, onChange) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(field.name, e.target.value)}
        placeholder={field.placeholder}
        className={baseClasses}
      />
    );
  }
}

export class NumberFieldStrategy extends FieldStrategy {
  render(field, value, onChange) {
    return (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(field.name, e.target.value)}
        placeholder={field.placeholder}
        min={field.min}
        max={field.max}
        step={field.step}
        className={baseClasses}
      />
    );
  }

  validate(value, field) {
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
      return { isValid: false, error: 'Must be a valid number' };
    }
    
    if (field.min !== undefined && numValue < field.min) {
      return { isValid: false, error: `Must be at least ${field.min}` };
    }
    
    if (field.max !== undefined && numValue > field.max) {
      return { isValid: false, error: `Must be at most ${field.max}` };
    }
    
    return { isValid: true, error: null };
  }
}

export class SelectFieldStrategy extends FieldStrategy {
  render(field, value, onChange) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(field.name, e.target.value)}
        className={`${baseClasses} cursor-pointer appearance-none bg-[length:12px_12px] bg-[right_10px_center] bg-no-repeat pr-8`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`
        }}
      >
        {(field.options || []).map((opt) => (
          <option key={opt} value={opt} className="bg-gray-900 text-white">
            {opt}
          </option>
        ))}
      </select>
    );
  }

  validate(value, field) {
    if (field.options && !field.options.includes(value)) {
      return { isValid: false, error: 'Invalid selection' };
    }
    return { isValid: true, error: null };
  }
}

export class TextareaFieldStrategy extends FieldStrategy {
  render(field, value, onChange) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(field.name, e.target.value)}
        placeholder={field.placeholder}
        ref={(el) => {
          if (el) {
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
          }
        }}
        className={`${baseClasses} resize-none overflow-hidden min-h-[60px] leading-relaxed`}
      />
    );
  }
}

class FieldStrategyFactory {
  constructor() {
    this.strategies = new Map();
    this.registerDefaultStrategies();
  }

  registerDefaultStrategies() {
    this.strategies.set('text', new TextFieldStrategy());
    this.strategies.set('number', new NumberFieldStrategy());
    this.strategies.set('select', new SelectFieldStrategy());
    this.strategies.set('textarea', new TextareaFieldStrategy());
  }

  register(type, strategy) {
    this.strategies.set(type, strategy);
  }

  getStrategy(field) {
    const type = field.name === 'text' ? 'textarea' : field.type;
    const strategy = this.strategies.get(type);
    
    if (!strategy) {
      return this.strategies.get('text');
    }
    
    return strategy;
  }
}

export const fieldStrategyFactory = new FieldStrategyFactory();
