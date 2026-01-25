// App.jsx
import { ReactFlowProvider } from 'reactflow';
import { PipelineToolbar } from './components/toolbar';
import { PipelineUI } from './components/ui';
import SubmitButton from './components/SubmitButton';
import Model, { ThreeBackground } from './components/Model';

function App() {
  return (
    <div style={{ height: '100vh', backgroundColor: '#000', position: 'relative' }}>
      <ThreeBackground />
      {/* <Model/> */}
      {/* Toolbar (z-30) */}
      <div className="relative z-30">
        <PipelineToolbar />
      </div>

      {/* ReactFlow Canvas (z-20) */}
      <ReactFlowProvider>
        <PipelineUI />
        <SubmitButton />
      </ReactFlowProvider>
    </div>
  );
}

export default App;
