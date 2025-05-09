import React, { useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

let id = 0;
const getId = () => `node_${id++}`;

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [newNodeType, setNewNodeType] = useState('acción');

  const addNode = useCallback(() => {
    const backgroundColor = newNodeType === 'acción'
      ? '#cce5ff'
      : newNodeType === 'defensa'
      ? '#f8d7da'
      : '#d4edda';

    const newNode = {
      id: getId(),
      data: { label: `${newNodeType.toUpperCase()}: ${newNodeLabel}` },
      position: { x: Math.random() * 600, y: Math.random() * 400 },
      style: {
        backgroundColor,
        padding: 10,
        borderRadius: 5,
        border: '1px solid #333',
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setNewNodeLabel('');
  }, [newNodeLabel, newNodeType, setNodes]);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const saveMap = () => {
    const data = JSON.stringify({ nodes, edges });
    localStorage.setItem('jibitoMap', data);
    alert('Mapa guardado');
  };

  const loadMap = () => {
    const data = localStorage.getItem('jibitoMap');
    if (data) {
      const parsed = JSON.parse(data);
      setNodes(parsed.nodes || []);
      setEdges(parsed.edges || []);
    }
  };

  return (
    <div style={{ height: '100vh' }}>
      <div style={{ padding: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
        <input
          value={newNodeLabel}
          onChange={(e) => setNewNodeLabel(e.target.value)}
          placeholder="Nombre del nodo"
        />
        <select value={newNodeType} onChange={(e) => setNewNodeType(e.target.value)}>
          <option value="acción">Acción</option>
          <option value="defensa">Defensa</option>
          <option value="resultado">Resultado</option>
        </select>
        <button onClick={addNode}>Agregar nodo</button>
        <button onClick={saveMap}>Guardar</button>
        <button onClick={loadMap}>Cargar</button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background gap={16} />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}