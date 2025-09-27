import { useCallback, useState, useRef } from 'react';
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
  const reactFlowRef = useRef<any>(null);

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
    },
    [setEdges]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      onNodeSelect?.(node);
    },
    [onNodeSelect]
  );

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
    },
    [setNodes]
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
    },
    [setNodes]
  );

  const handleSave = useCallback(() => {
    onSave?.(nodes, edges);
  }, [nodes, edges, onSave]);

  const onPaneClick = useCallback(() => {
    onNodeSelect?.(null);
  }, [onNodeSelect]);

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
        <Background 
          gap={20} 
          size={1}
          color="hsl(var(--muted-foreground))"
        />
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
          if (onNodeSelect) {
            (window as any).conceptMapMethods = {
              addNode,
              updateNode,
              handleSave,
            };
          }
          return null;
        })()}
      </div>
    </div>
  );
};