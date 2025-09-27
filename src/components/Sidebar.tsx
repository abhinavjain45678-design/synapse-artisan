import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Circle, 
  Square, 
  Triangle, 
  Hexagon,
  BookOpen,
  Lightbulb,
  Target,
  HelpCircle,
  Palette,
  FileText,
  Search,
  Folder,
  Files
} from "lucide-react";

interface SidebarProps {
  onAddNode?: (type: string, shape: string, color: string) => void;
  onLoadTemplate?: (template: string) => void;
  selectedNode?: any;
  onUpdateNode?: (nodeId: string, updates: any) => void;
}

const nodeTypes = [
  { type: "concept", icon: BookOpen, label: "Concept", color: "node-concept" },
  { type: "definition", icon: FileText, label: "Definition", color: "node-definition" },
  { type: "example", icon: Lightbulb, label: "Example", color: "node-example" },
  { type: "formula", icon: Target, label: "Formula", color: "node-formula" },
  { type: "question", icon: HelpCircle, label: "Question", color: "node-question" },
];

const nodeShapes = [
  { shape: "circle", icon: Circle, label: "Circle" },
  { shape: "square", icon: Square, label: "Rectangle" },
  { shape: "triangle", icon: Triangle, label: "Triangle" },
  { shape: "hexagon", icon: Hexagon, label: "Hexagon" },
];

const templates = [
  { id: "biology", name: "Biology: Photosynthesis", nodes: 8 },
  { id: "physics", name: "Physics: Motion", nodes: 6 },
  { id: "math", name: "Math: Calculus", nodes: 12 },
  { id: "cs", name: "Computer Science: Algorithms", nodes: 10 },
];

export const Sidebar = ({ onAddNode, onLoadTemplate, selectedNode, onUpdateNode }: SidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNodeType, setSelectedNodeType] = useState("concept");
  const [selectedShape, setSelectedShape] = useState("circle");

  const handleSearch = () => {
    if (searchTerm.trim() && (window as any).conceptMapMethods) {
      (window as any).conceptMapMethods.searchNodes(searchTerm);
    }
  };

  const handleAddNode = () => {
    const nodeType = nodeTypes.find(t => t.type === selectedNodeType);
    if (onAddNode && nodeType) {
      onAddNode(selectedNodeType, selectedShape, nodeType.color);
    }
  };

  return (
    <div className="w-80 bg-card border-r border-border/50 flex flex-col">
      <div className="p-4 border-b border-border/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="create" className="h-full">
          <TabsList className="grid w-full grid-cols-3 m-2">
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="p-4 space-y-6">
            {/* Node Types */}
            <div>
              <Label className="text-sm font-semibold mb-3 block">Node Type</Label>
              <div className="grid grid-cols-1 gap-2">
                {nodeTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Button
                      key={type.type}
                      variant={selectedNodeType === type.type ? "default" : "ghost"}
                      className="justify-start h-auto p-3 hover-lift"
                      onClick={() => setSelectedNodeType(type.type)}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">{type.label}</div>
                      </div>
                      <div className={`ml-auto w-3 h-3 rounded-full ${type.color}`} />
                    </Button>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Node Shapes */}
            <div>
              <Label className="text-sm font-semibold mb-3 block">Shape</Label>
              <div className="grid grid-cols-2 gap-2">
                {nodeShapes.map((shape) => {
                  const Icon = shape.icon;
                  return (
                    <Button
                      key={shape.shape}
                      variant={selectedShape === shape.shape ? "default" : "outline"}
                      className="h-12 hover-lift"
                      onClick={() => setSelectedShape(shape.shape)}
                    >
                      <Icon className="h-5 w-5" />
                    </Button>
                  );
                })}
              </div>
            </div>

            <Button 
              onClick={handleAddNode} 
              className="w-full" 
              variant="hero"
              size="lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Node
            </Button>
          </TabsContent>

          <TabsContent value="templates" className="p-4 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Files className="h-5 w-5 text-primary" />
              <Label className="text-sm font-semibold">Quick Start Templates</Label>
            </div>
            
            {templates.map((template) => (
              <Card key={template.id} className="p-4 hover-lift cursor-pointer" onClick={() => onLoadTemplate?.(template.id)}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm">{template.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {template.nodes} nodes
                    </p>
                  </div>
                  <Folder className="h-4 w-4 text-muted-foreground" />
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="properties" className="p-4 space-y-4">
            {selectedNode ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="h-5 w-5 text-primary" />
                  <Label className="text-sm font-semibold">Node Properties</Label>
                </div>
                
                <div>
                  <Label htmlFor="node-title" className="text-sm mb-2 block">Title</Label>
                  <Input
                    id="node-title"
                    value={selectedNode.data?.label || ""}
                    onChange={(e) => onUpdateNode?.(selectedNode.id, { label: e.target.value })}
                    placeholder="Enter node title..."
                  />
                </div>

                <div>
                  <Label htmlFor="node-description" className="text-sm mb-2 block">Description</Label>
                  <Input
                    id="node-description"
                    value={selectedNode.data?.description || ""}
                    onChange={(e) => onUpdateNode?.(selectedNode.id, { description: e.target.value })}
                    placeholder="Enter description..."
                  />
                </div>

                <div>
                  <Label className="text-sm mb-2 block">Type</Label>
                  <div className="flex flex-wrap gap-1">
                    {nodeTypes.map((type) => (
                      <Badge 
                        key={type.type}
                        variant={selectedNode.data?.type === type.type ? "default" : "outline"}
                        className="cursor-pointer hover-lift"
                        onClick={() => onUpdateNode?.(selectedNode.id, { type: type.type })}
                      >
                        {type.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <Palette className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Select a node to edit its properties</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};