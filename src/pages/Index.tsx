import { useState } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { ConceptMapEditor } from '@/components/ConceptMapEditor';

const Index = () => {
  const [isEditorMode, setIsEditorMode] = useState(false);

  const handleGetStarted = () => {
    setIsEditorMode(true);
  };

  const handleViewDemo = () => {
    // For now, just open the editor
    setIsEditorMode(true);
  };

  const handleBackToHome = () => {
    setIsEditorMode(false);
  };

  if (isEditorMode) {
    return <ConceptMapEditor onBack={handleBackToHome} />;
  }

  return (
    <HeroSection 
      onGetStarted={handleGetStarted}
      onViewDemo={handleViewDemo}
    />
  );
};

export default Index;
