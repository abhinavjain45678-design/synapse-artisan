import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Save, Share, Download, Undo2, Redo2, Grid3X3, ZoomIn, ZoomOut, Home } from "lucide-react";

interface HeaderProps {
  currentMap?: string;
  onSave?: () => void;
  onShare?: () => void;
  onExport?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onToggleGrid?: () => void;
  onHome?: () => void;
  hasUnsavedChanges?: boolean;
}

export const Header = ({
  currentMap,
  onSave,
  onShare,
  onExport,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onToggleGrid,
  onHome,
  hasUnsavedChanges = false,
}: HeaderProps) => {
  return (
    <header className="glass border-b border-border/50 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onHome} className="hover-lift">
            <Home className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Brain className="h-7 w-7 text-primary animate-pulse-glow" />
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                ConceptMap
              </span>
            </div>
            {currentMap && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">•</span>
                <span className="font-medium">{currentMap}</span>
                {hasUnsavedChanges && (
                  <Badge variant="secondary" className="text-xs">
                    Unsaved
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          {/* Edit Controls */}
          <div className="flex items-center gap-1 border-r border-border/50 pr-3">
            <Button variant="ghost" size="sm" onClick={onUndo} className="hover-lift">
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onRedo} className="hover-lift">
              <Redo2 className="h-4 w-4" />
            </Button>
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-1 border-r border-border/50 pr-3">
            <Button variant="ghost" size="sm" onClick={onZoomOut} className="hover-lift">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onZoomIn} className="hover-lift">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onToggleGrid} className="hover-lift">
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onExport} className="hover-lift">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="secondary" size="sm" onClick={onShare} className="hover-lift">
              <Share className="h-4 w-4" />
              Share
            </Button>
            <Button variant="hero" size="sm" onClick={onSave} className="hover-glow">
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};