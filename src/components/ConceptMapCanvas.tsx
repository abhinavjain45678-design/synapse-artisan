import { useCallback, useState, useRef, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ConnectionMode,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { CustomNode } from './CustomNode';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ZoomIn, ZoomOut, Maximize, Download } from 'lucide-react';

const nodeTypes = {
  customNode: CustomNode,
};

interface ConceptMapCanvasProps {
  onNodeSelect?: (node: Node | null) => void;
  onSave?: (nodes: Node[], edges: Edge[]) => void;
  initialNodes?: Node[];
  initialEdges?: Edge[];
}

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'customNode',
    position: { x: 250, y: 100 },
    data: { 
      label: 'Neural Networks',
      type: 'concept',
      shape: 'circle',
      color: 'node-concept',
      description: 'Computational models inspired by biological neural networks'
    },
  },
  {
    id: '2',
    type: 'customNode',
    position: { x: 100, y: 200 },
    data: { 
      label: 'Perceptron',
      type: 'definition',
      shape: 'square',
      color: 'node-definition',
      description: 'Basic building block of neural networks'
    },
  },
  {
    id: '3',
    type: 'customNode',
    position: { x: 400, y: 200 },
    data: { 
      label: 'Deep Learning',
      type: 'example',
      shape: 'circle',
      color: 'node-example',
      description: 'Multi-layer neural networks for complex pattern recognition'
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    style: {
      stroke: 'hsl(var(--primary))',
      strokeWidth: 2,
    },
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    style: {
      stroke: 'hsl(var(--primary))',
      strokeWidth: 2,
    },
  },
];

export const ConceptMapCanvas = ({
  onNodeSelect,
  onSave,
  initialNodes: propInitialNodes,
  initialEdges: propInitialEdges,
}: ConceptMapCanvasProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(propInitialNodes || initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(propInitialEdges || initialEdges);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [history, setHistory] = useState<{ nodes: Node[], edges: Edge[] }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const reactFlowRef = useRef<any>(null);

  const saveToHistory = useCallback(() => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({ nodes: [...nodes], edges: [...edges] });
      return newHistory.slice(-20); // Keep last 20 states
    });
    setHistoryIndex(prev => Math.min(prev + 1, 19));
  }, [nodes, edges, historyIndex]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `e${params.source}-${params.target}`,
        type: 'smoothstep',
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: {
          stroke: 'hsl(var(--primary))',
          strokeWidth: 2,
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
      saveToHistory();
    },
    [setEdges, saveToHistory]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      onNodeSelect?.(node);
    },
    [onNodeSelect]
  );

  // Initialize history with current state
  useEffect(() => {
    if (history.length === 0) {
      setHistory([{ nodes, edges }]);
      setHistoryIndex(0);
    }
  }, []);

  // Auto-save when changes occur
  useEffect(() => {
    if (history.length > 0) {
      onSave?.(nodes, edges);
    }
  }, [nodes, edges, onSave]);

  const addNode = useCallback(
    (type: string, shape: string, color: string) => {
      const newNode: Node = {
        id: `node_${Date.now()}`,
        type: 'customNode',
        position: {
          x: Math.random() * 400 + 200,
          y: Math.random() * 300 + 150,
        },
        data: {
          label: `New ${type}`,
          type,
          shape,
          color,
          description: `Enter description for this ${type}...`,
        },
      };

      setNodes((nds) => nds.concat(newNode));
      saveToHistory();
    },
    [setNodes, saveToHistory]
  );

  const updateNode = useCallback(
    (nodeId: string, updates: any) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...updates } }
            : node
        )
      );
      saveToHistory();
    },
    [setNodes, saveToHistory]
  );

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(prev => prev - 1);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(prev => prev + 1);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  const zoomIn = useCallback(() => {
    reactFlowRef.current?.zoomIn();
  }, []);

  const zoomOut = useCallback(() => {
    reactFlowRef.current?.zoomOut();
  }, []);

  const toggleGrid = useCallback(() => {
    setShowGrid(prev => !prev);
  }, []);

  const exportImage = useCallback(async () => {
    try {
      const html2canvas = await import('html2canvas');
      if (reactFlowRef.current && html2canvas.default) {
        const canvas = await html2canvas.default(reactFlowRef.current.querySelector('.react-flow__viewport'));
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'concept-map.png';
        link.href = dataUrl;
        link.click();
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, []);

  const handleSave = useCallback(() => {
    onSave?.(nodes, edges);
  }, [nodes, edges, onSave]);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    saveToHistory();
  }, [setNodes, setEdges, saveToHistory]);

  const loadTemplate = useCallback((template: { nodes: Node[], edges: Edge[] }) => {
    setNodes(template.nodes);
    setEdges(template.edges);
    saveToHistory();
  }, [setNodes, setEdges, saveToHistory]);

  const searchNodes = useCallback((searchTerm: string) => {
    const matchingNodes = nodes.filter(node => 
      node.data.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.data.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (matchingNodes.length > 0) {
      // Focus on first matching node and select it
      const firstNode = matchingNodes[0];
      if (reactFlowRef.current) {
        reactFlowRef.current.setCenter(firstNode.position.x, firstNode.position.y, { zoom: 1.5, duration: 800 });
      }
      onNodeSelect?.(firstNode);
      
      // Visual feedback - flash the matching nodes
      setNodes(prevNodes => 
        prevNodes.map(node => ({
          ...node,
          selected: matchingNodes.some(match => match.id === node.id)
        }))
      );
      
      // Clear selection after 3 seconds
      setTimeout(() => {
        setNodes(prevNodes => 
          prevNodes.map(node => ({ ...node, selected: false }))
        );
      }, 3000);
    }
  }, [nodes, onNodeSelect, setNodes]);

  const onPaneClick = useCallback(() => {
    onNodeSelect?.(null);
  }, [onNodeSelect]);

  // Event listeners for node actions
  useEffect(() => {
    const handleNodeEdit = (event: CustomEvent) => {
      const { id, data } = event.detail;
      const node = nodes.find(n => n.id === id);
      if (node) {
        onNodeSelect?.(node);
      }
    };

    const handleNodeDelete = (event: CustomEvent) => {
      const { id } = event.detail;
      deleteNode(id);
    };

    window.addEventListener('nodeEdit', handleNodeEdit as EventListener);
    window.addEventListener('nodeDelete', handleNodeDelete as EventListener);

    return () => {
      window.removeEventListener('nodeEdit', handleNodeEdit as EventListener);
      window.removeEventListener('nodeDelete', handleNodeDelete as EventListener);
    };
  }, [nodes, onNodeSelect, deleteNode]);

  return (
    <div className="flex-1 relative">
      <ReactFlow
        ref={reactFlowRef}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        className="bg-background"
      >
        <Controls className="shadow-medium" />
        <MiniMap 
          className="shadow-medium !bg-card border border-border/50 rounded-lg"
          nodeColor={(node) => {
            const color = node.data?.color || 'node-concept';
            return `hsl(var(--${color.replace('node-', '')}))`;
          }}
        />
        {showGrid && (
          <Background 
            gap={20} 
            size={1}
            color="hsl(var(--muted-foreground))"
          />
        )}
      </ReactFlow>

      {/* Floating Stats */}
      <div className="absolute top-4 left-4 glass rounded-lg p-3 shadow-soft">
        <div className="flex items-center gap-4 text-sm">
          <Badge variant="outline" className="bg-background/50">
            {nodes.length} Nodes
          </Badge>
          <Badge variant="outline" className="bg-background/50">
            {edges.length} Connections
          </Badge>
        </div>
      </div>

      {/* Floating Action Button */}
      <Button
        onClick={handleSave}
        className="absolute bottom-6 right-6 h-14 w-14 rounded-full shadow-strong hover:shadow-glow"
        variant="hero"
        size="icon"
      >
        <Download className="h-6 w-6" />
      </Button>

      {/* Pass methods to parent */}
      <div style={{ display: 'none' }}>
        {(() => {
          // Expose methods to parent through refs or props
          (window as any).conceptMapMethods = {
            addNode,
            updateNode,
            deleteNode,
            loadTemplate,
            searchNodes,
            handleSave,
            undo,
            redo,
            zoomIn,
            zoomOut,
            toggleGrid,
            exportImage,
          };
          return null;
        })()}
      </div>
    </div>
  );
};