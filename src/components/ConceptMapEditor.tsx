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
    // Export functionality (simplified)
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
    toast({
      title: "Template Loaded",
      description: `Loading ${templateId} template...`,
    });
    // Would load template data here
    setHasUnsavedChanges(true);
  }, [toast]);

  const handleMapDataChange = useCallback((newNodes: Node[], newEdges: Edge[]) => {
    setNodes(newNodes);
    setEdges(newEdges);
    setHasUnsavedChanges(true);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header
        currentMap={currentMapName}
        onSave={handleSave}
        onShare={handleShare}
        onExport={handleExport}
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