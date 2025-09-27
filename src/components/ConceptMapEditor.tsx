import { useState, useCallback } from 'react';
import { Node, Edge } from 'reactflow';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ConceptMapCanvas } from './ConceptMapCanvas';
import { useToast } from '@/hooks/use-toast';

interface ConceptMapEditorProps {
  onBack?: () => void;
}

export const ConceptMapEditor = ({ onBack }: ConceptMapEditorProps) => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [currentMapName, setCurrentMapName] = useState("Neural Networks Basics");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const { toast } = useToast();

  const handleNodeSelect = useCallback((node: Node | null) => {
    setSelectedNode(node);
  }, []);

  const handleSave = useCallback(() => {
    // Save to localStorage for now (would be backend in real app)
    const mapData = {
      name: currentMapName,
      nodes,
      edges,
      lastModified: new Date().toISOString()
    };
    
    localStorage.setItem(`conceptmap_${Date.now()}`, JSON.stringify(mapData));
    setHasUnsavedChanges(false);
    
    toast({
      title: "Map Saved",
      description: `"${currentMapName}" has been saved successfully.`,
    });
  }, [currentMapName, nodes, edges, toast]);

  const handleShare = useCallback(() => {
    // Generate shareable link (would be real URL in production)
    const shareUrl = `${window.location.origin}/map/shared/${btoa(currentMapName)}`;
    navigator.clipboard.writeText(shareUrl);
    
    toast({
      title: "Link Copied",
      description: "Shareable link has been copied to clipboard.",
    });
  }, [currentMapName, toast]);

  const handleExport = useCallback(() => {
    if ((window as any).conceptMapMethods) {
      (window as any).conceptMapMethods.exportImage();
    }
    toast({
      title: "Export Started",
      description: "Your concept map is being exported as PNG.",
    });
  }, [toast]);

  const handleAddNode = useCallback((type: string, shape: string, color: string) => {
    // This would be called from Sidebar
    if ((window as any).conceptMapMethods) {
      (window as any).conceptMapMethods.addNode(type, shape, color);
      setHasUnsavedChanges(true);
    }
  }, []);

  const handleUpdateNode = useCallback((nodeId: string, updates: any) => {
    if ((window as any).conceptMapMethods) {
      (window as any).conceptMapMethods.updateNode(nodeId, updates);
      setHasUnsavedChanges(true);
    }
  }, []);

  const handleLoadTemplate = useCallback((templateId: string) => {
    const templates = {
      biology: {
        name: "Biology: Photosynthesis",
        nodes: [
          { id: 'photo1', type: 'customNode', position: { x: 250, y: 100 }, data: { label: 'Photosynthesis', type: 'concept', shape: 'circle', color: 'node-concept', description: 'Process of converting light energy to chemical energy' }},
          { id: 'photo2', type: 'customNode', position: { x: 100, y: 200 }, data: { label: 'Chloroplast', type: 'definition', shape: 'square', color: 'node-definition', description: 'Organelle where photosynthesis occurs' }},
          { id: 'photo3', type: 'customNode', position: { x: 400, y: 200 }, data: { label: 'Light Reactions', type: 'example', shape: 'circle', color: 'node-example', description: 'First stage of photosynthesis' }},
        ],
        edges: [
          { id: 'e-photo1-2', source: 'photo1', target: 'photo2', type: 'smoothstep', markerEnd: { type: 'ArrowClosed' }},
          { id: 'e-photo1-3', source: 'photo1', target: 'photo3', type: 'smoothstep', markerEnd: { type: 'ArrowClosed' }},
        ]
      },
      physics: {
        name: "Physics: Motion",
        nodes: [
          { id: 'motion1', type: 'customNode', position: { x: 250, y: 100 }, data: { label: 'Motion', type: 'concept', shape: 'circle', color: 'node-concept', description: 'Change in position over time' }},
          { id: 'motion2', type: 'customNode', position: { x: 100, y: 200 }, data: { label: 'Velocity', type: 'definition', shape: 'square', color: 'node-definition', description: 'Rate of change of position' }},
          { id: 'motion3', type: 'customNode', position: { x: 400, y: 200 }, data: { label: 'Acceleration', type: 'formula', shape: 'circle', color: 'node-formula', description: 'Rate of change of velocity' }},
        ],
        edges: [
          { id: 'e-motion1-2', source: 'motion1', target: 'motion2', type: 'smoothstep', markerEnd: { type: 'ArrowClosed' }},
          { id: 'e-motion1-3', source: 'motion1', target: 'motion3', type: 'smoothstep', markerEnd: { type: 'ArrowClosed' }},
        ]
      },
      math: {
        name: "Math: Calculus",
        nodes: [
          { id: 'calc1', type: 'customNode', position: { x: 250, y: 100 }, data: { label: 'Calculus', type: 'concept', shape: 'circle', color: 'node-concept', description: 'Mathematics of continuous change' }},
          { id: 'calc2', type: 'customNode', position: { x: 100, y: 200 }, data: { label: 'Derivative', type: 'definition', shape: 'square', color: 'node-definition', description: 'Rate of change at a point' }},
          { id: 'calc3', type: 'customNode', position: { x: 400, y: 200 }, data: { label: 'Integral', type: 'formula', shape: 'circle', color: 'node-formula', description: 'Area under curve' }},
        ],
        edges: [
          { id: 'e-calc1-2', source: 'calc1', target: 'calc2', type: 'smoothstep', markerEnd: { type: 'ArrowClosed' }},
          { id: 'e-calc1-3', source: 'calc1', target: 'calc3', type: 'smoothstep', markerEnd: { type: 'ArrowClosed' }},
        ]
      },
      cs: {
        name: "Computer Science: Algorithms",
        nodes: [
          { id: 'algo1', type: 'customNode', position: { x: 250, y: 100 }, data: { label: 'Algorithms', type: 'concept', shape: 'circle', color: 'node-concept', description: 'Step-by-step procedures for solving problems' }},
          { id: 'algo2', type: 'customNode', position: { x: 100, y: 200 }, data: { label: 'Sorting', type: 'example', shape: 'square', color: 'node-example', description: 'Arranging data in order' }},
          { id: 'algo3', type: 'customNode', position: { x: 400, y: 200 }, data: { label: 'Big O', type: 'formula', shape: 'circle', color: 'node-formula', description: 'Time complexity notation' }},
        ],
        edges: [
          { id: 'e-algo1-2', source: 'algo1', target: 'algo2', type: 'smoothstep', markerEnd: { type: 'ArrowClosed' }},
          { id: 'e-algo1-3', source: 'algo1', target: 'algo3', type: 'smoothstep', markerEnd: { type: 'ArrowClosed' }},
        ]
      }
    };

    const template = templates[templateId as keyof typeof templates];
    if (template && (window as any).conceptMapMethods) {
      (window as any).conceptMapMethods.loadTemplate(template);
      setCurrentMapName(template.name);
      setHasUnsavedChanges(true);
      
      toast({
        title: "Template Loaded",
        description: `${template.name} template loaded successfully.`,
      });
    }
  }, [toast, setCurrentMapName]);

  const handleMapDataChange = useCallback((newNodes: Node[], newEdges: Edge[]) => {
    setNodes(newNodes);
    setEdges(newEdges);
    setHasUnsavedChanges(true);
  }, []);

  const handleUndo = useCallback(() => {
    if ((window as any).conceptMapMethods) {
      (window as any).conceptMapMethods.undo();
    }
  }, []);

  const handleRedo = useCallback(() => {
    if ((window as any).conceptMapMethods) {
      (window as any).conceptMapMethods.redo();
    }
  }, []);

  const handleZoomIn = useCallback(() => {
    if ((window as any).conceptMapMethods) {
      (window as any).conceptMapMethods.zoomIn();
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if ((window as any).conceptMapMethods) {
      (window as any).conceptMapMethods.zoomOut();
    }
  }, []);

  const handleToggleGrid = useCallback(() => {
    if ((window as any).conceptMapMethods) {
      (window as any).conceptMapMethods.toggleGrid();
    }
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header
        currentMap={currentMapName}
        onSave={handleSave}
        onShare={handleShare}
        onExport={handleExport}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onToggleGrid={handleToggleGrid}
        onHome={onBack}
        hasUnsavedChanges={hasUnsavedChanges}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onAddNode={handleAddNode}
          onLoadTemplate={handleLoadTemplate}
          selectedNode={selectedNode}
          onUpdateNode={handleUpdateNode}
        />
        
        <ConceptMapCanvas
          onNodeSelect={handleNodeSelect}
          onSave={handleMapDataChange}
        />
      </div>
    </div>
  );
};