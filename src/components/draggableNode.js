import { nodeSchemas } from '../module/node/lib/nodeSchema';

export const  DraggableNode = ({ type, label }) => {
  const schema = nodeSchemas[type];
  
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={`${type} cursor-grab active:cursor-grabbing w-20 h-20 flex items-center justify-center flex-col gap-2 relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-300 hover:bg-white/15 hover:border-white/30   group`}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      // style={{
      //   boxShadow: `0 8px 32px 0 ${schema?.color || '#888'}40, inset 0 0 20px rgba(255, 255, 255, 0.05)`
      // }}
      draggable
    >
      <div 
        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-300 blur-xl -z-10`}
        style={{ background: schema?.color || '#888' }}
      />
      
      <div className="text-2xl">
        {schema?.icon || (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        )}
      </div>
      <span className="text-white text-sm font-normal  text-center">
        {label}
      </span>
    </div>
  );
};