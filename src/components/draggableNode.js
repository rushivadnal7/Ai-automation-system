import { nodeSchemas } from '../module/node/lib/nodeSchema';

export const DraggableNode = ({ type, label }) => {
  const schema = nodeSchemas[type];
  
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={`${type} cursor-grab active:cursor-grabbing w-16 h-16 flex items-center justify-center flex-col gap-1 relative rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-300 hover:bg-white/15 hover:border-white/30 group flex-shrink-0`}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      style={{
        boxShadow: `0 2px 12px 0 ${schema?.color || '#3b82f6'}20`
      }}
      draggable
    >
      <div 
        className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-lg -z-10`}
        style={{ background: schema?.color || '#3b82f6' }}
      />
      
      <div className="text-xl">
        {schema?.icon || (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        )}
      </div>
      <span className="text-white text-[10px] poppins-font font-medium text-center leading-tight px-1">
        {label}
      </span>
    </div>
  );
};