import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  FileText, 
  Lightbulb, 
  Target, 
  HelpCircle,
  MoreVertical,
  Edit3,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const typeIcons = {
  concept: BookOpen,
  definition: FileText,
  example: Lightbulb,
  formula: Target,
  question: HelpCircle,
};

export const CustomNode = memo(({ data, selected, id }: NodeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = typeIcons[data.type as keyof typeof typeIcons] || BookOpen;

  const getShapeClasses = () => {
    const baseClasses = "transition-all duration-300 border-2";
    const shapeClasses = {
      circle: "rounded-full w-24 h-24",
      square: "rounded-lg w-28 h-20",
      triangle: "rounded-lg w-28 h-20 clip-triangle",
      hexagon: "rounded-lg w-28 h-20 clip-hexagon",
    };
    
    const selectedClasses = selected 
      ? "border-ring shadow-glow scale-105" 
      : "border-border/30 hover:border-primary/50";
    
    return `${baseClasses} ${shapeClasses[data.shape as keyof typeof shapeClasses] || shapeClasses.circle} ${selectedClasses}`;
  };

  const getColorClasses = () => {
    const colorMap = {
      'node-concept': 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
      'node-definition': 'bg-gradient-to-br from-teal-500 to-teal-600 text-white',
      'node-example': 'bg-gradient-to-br from-purple-500 to-purple-600 text-white',
      'node-formula': 'bg-gradient-to-br from-orange-500 to-orange-600 text-white',
      'node-question': 'bg-gradient-to-br from-pink-500 to-pink-600 text-white',
    };
    
    return colorMap[data.color as keyof typeof colorMap] || colorMap['node-concept'];
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-primary !border-2 !border-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity"
      />
      
      <Card className={`${getShapeClasses()} ${getColorClasses()} flex flex-col items-center justify-center p-3 cursor-pointer hover-lift shadow-soft`}>
        <div className="flex items-center justify-center mb-1">
          <Icon className="h-5 w-5" />
        </div>
        
        <div className="text-center">
          <div className="font-semibold text-xs leading-tight line-clamp-2 mb-1">
            {data.label}
          </div>
          
          {data.description && (
            <div className="text-xs opacity-80 line-clamp-1">
              {data.description}
            </div>
          )}
        </div>

        {/* Node Menu */}
        {(isHovered || selected) && (
          <div className="absolute -top-2 -right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-6 w-6 rounded-full shadow-medium"
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Type Badge */}
        <Badge 
          variant="secondary" 
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs px-2 py-0 h-5 bg-background/90 text-foreground"
        >
          {data.type}
        </Badge>
      </Card>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-primary !border-2 !border-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity"
      />
      
      <Handle
        type="source"
        position={Position.Left}
        className="!w-3 !h-3 !bg-primary !border-2 !border-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity"
      />
      
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-primary !border-2 !border-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';