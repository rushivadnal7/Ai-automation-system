import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import { useState, useEffect, useMemo } from 'react';
import { useStore } from '../../../store/store';
import { FieldRenderer } from './FieldRenderer';

export default function DynamicNode({ id, data }) {
  const { schema = {}, ...initialFields } = data || {};
  const [localData, setLocalData] = useState(initialFields || {});
  const updateNodeField = useStore((state) => state.updateNodeField);
  const isDynamic = schema.inputs?.dynamic;
  const sourceField = schema.inputs?.parseFrom;
  const pattern = schema.inputs?.pattern;
  const color = schema.color || '#888';
  const executionResult = useStore((state) => state.executionResults[id]);

  const updateNodeInternals = useUpdateNodeInternals();
  const deleteNode = useStore((state) => state.deleteNode);

  useEffect(() => {
    const defaults = {};
    (schema.fields || []).forEach((field) => {
      if (localData[field.name] === undefined) {
        defaults[field.name] =
          typeof field.default === 'function'
            ? field.default(id)
            : field.default || '';
      }
    });

    if (Object.keys(defaults).length > 0) {
      setLocalData((prev) => ({ ...defaults, ...prev }));
    }
  }, [id, schema]);

  const dynamicInputs = useMemo(() => {
    const inputs = [];

    if (isDynamic && pattern && localData[sourceField]) {
      const matches = [...localData[sourceField].matchAll(pattern)];
      const uniqueVars = new Set();

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
    }

    return inputs.map((h, i, arr) => ({
      ...h,
      position: h.position ?? (100 / (arr.length + 1)) * (i + 1),
    }));
  }, [isDynamic, pattern, localData[sourceField]]);

  const inputHandles = useMemo(() => {
    if (dynamicInputs.length > 0) {
      return dynamicInputs;
    }
    return Array.isArray(schema.inputs) ? schema.inputs : [];
  }, [dynamicInputs, schema.inputs]);

  useEffect(() => {
    updateNodeField(id, '__inputHandles', inputHandles);
    updateNodeField(id, '__handleIds', inputHandles.map(h => h.id).join(','));
    updateNodeInternals(id);
  }, [id, inputHandles, updateNodeField]);

  const handleChange = (fieldName, value) => {
    setLocalData((prev) => ({ ...prev, [fieldName]: value }));
    updateNodeField(id, fieldName, value);
  };

  const getPosition = (p) => (typeof p === 'number' ? `${p}%` : '50%');

  const handleDelete = (nodeId) => {
    deleteNode(nodeId);
  };

  return (
    <div className='flex'>
      <div className="relative w-[260px] p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/18" style={{ boxShadow: `0 8px 32px 0 ${color}40, inset 0 0 20px rgba(255, 255, 255, 0.05)` }}>

        <div onClick={() => handleDelete(id)} className='absolute top-3 right-2 hover:scale-110 cursor-pointer transition-transform duration-200' title="Remove Node">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 text-gray-500 hover:text-red-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </div>
        
        <div
          className="absolute inset-0 rounded-2xl opacity-50 -z-10 pointer-events-none animate-pulse"
          style={{
            background: `linear-gradient(135deg, ${color}40, transparent)`,
            filter: 'blur(30px)',
          }}
        />

        <div className="flex items-center gap-2 mb-3">
          {schema.icon && <span className="text-[22px]">{schema.icon}</span>}
          <span
            className="font-bold text-base text-white"
            style={{ textShadow: `0 0 10px ${color}80` }}
          >
            {schema.title || 'Node'}
          </span>
        </div>

        {schema.description && (
          <div className="text-[11px] mb-3 text-white/60 leading-snug">
            {schema.description}
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          {(schema.fields || []).map((field, i) => (
            <div key={i}>
              <label className="text-xs block mb-1 text-white/80 font-medium">
                {field.label}
              </label>
              <FieldRenderer
                field={field}
                value={localData[field.name] || ''}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        {executionResult && (
          <div className="mt-3 p-2 rounded-lg bg-black/40 border border-white/10">
            <div className="text-[10px] text-white/50 mb-1 font-medium">Result:</div>
            <div className="text-xs text-white/90 max-h-24 overflow-auto break-words whitespace-pre-wrap">
              {executionResult.length > 200 ? executionResult.substring(0, 200) + '...' : executionResult}
            </div>
          </div>
        )}

        {inputHandles.map((input, idx) => {
          const handleId = input.id || `input-${idx}`;

          return (
            <Handle
              key={handleId}
              type="target"
              position={Position.Left}
              id={handleId}
              isConnectable={true}
              className="w-3 h-3 bg-white border-2 cursor-crosshair z-10 transition-all duration-200 hover:scale-125"
              style={{
                top: getPosition(input.position),
                borderColor: color,
                left: '-6px',
                boxShadow: `0 0 10px ${color}, 0 0 20px ${color}80`,
              }}
            />
          );
        })}

        {(schema.outputs || []).map((output, idx) => {
          const handleId = output.id || `output-${idx}`;

          return (
            <Handle
              key={handleId}
              type="source"
              position={Position.Right}
              id={handleId}
              isConnectable={true}
              className="w-3 h-3 bg-white border-2 cursor-crosshair z-10 transition-all duration-200 hover:scale-125"
              style={{
                top: getPosition(output.position),
                borderColor: color,
                right: '-6px',
                boxShadow: `0 0 10px ${color}, 0 0 20px ${color}80`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}