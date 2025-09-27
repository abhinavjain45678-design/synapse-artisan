import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Users, 
  Share, 
  Download, 
  Zap, 
  Palette,
  ArrowRight,
  Play,
  BookOpen,
  Target,
  Lightbulb
} from "lucide-react";
import heroImage from "@/assets/hero-concept-map.jpg";

interface HeroSectionProps {
  onGetStarted?: () => void;
  onViewDemo?: () => void;
}

const features = [
  {
    icon: Brain,
    title: "Intelligent Mapping",
    description: "AI-powered suggestions and smart node connections"
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description: "Work together with your team in real-time"
  },
  {
    icon: Share,
    title: "Easy Sharing",
    description: "Share your maps with public links or export as PDF"
  },
  {
    icon: Palette,
    title: "Rich Customization",
    description: "Colors, shapes, icons, and custom styling options"
  }
];

const nodeExamples = [
  { icon: BookOpen, label: "Concepts", color: "bg-blue-500" },
  { icon: Target, label: "Formulas", color: "bg-orange-500" },
  { icon: Lightbulb, label: "Examples", color: "bg-purple-500" },
];

export const HeroSection = ({ onGetStarted, onViewDemo }: HeroSectionProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, hsl(var(--primary)) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, hsl(var(--secondary)) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, hsl(var(--accent)) 0%, transparent 50%)
          `
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="outline" className="mb-6 bg-background/50 hover-lift">
            <Zap className="h-3 w-3 mr-1" />
            Interactive Knowledge Visualization
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent leading-tight">
            Build Stunning
            <br />
            Concept Maps
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform complex ideas into beautiful, interactive visual networks. 
            Perfect for students, educators, and knowledge workers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              variant="hero" 
              size="lg" 
              onClick={onGetStarted}
              className="text-lg px-8 py-6 hover-glow"
            >
              <Brain className="h-5 w-5 mr-2" />
              Start Mapping
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            
            <Button 
              variant="glass" 
              size="lg" 
              onClick={onViewDemo}
              className="text-lg px-8 py-6"
            >
              <Play className="h-5 w-5 mr-2" />
              View Demo
            </Button>
          </div>

          {/* Node Type Examples */}
          <div className="flex justify-center gap-4 mb-16">
            {nodeExamples.map((node, index) => {
              const Icon = node.icon;
              return (
                <div 
                  key={node.label}
                  className={`flex items-center gap-2 ${node.color} text-white px-4 py-2 rounded-full text-sm shadow-soft hover-lift animate-float`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <Icon className="h-4 w-4" />
                  {node.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative mb-20 animate-scale-in">
          <div className="relative rounded-2xl overflow-hidden shadow-strong hover:shadow-glow transition-shadow duration-500">
            <img 
              src={heroImage} 
              alt="Interactive Concept Map Builder Interface"
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
          </div>
          
          {/* Floating Cards */}
          <Card className="absolute -top-4 -left-4 p-4 glass shadow-medium animate-float hidden md:block">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-sm font-medium">Live Collaboration</span>
            </div>
          </Card>
          
          <Card className="absolute -top-4 -right-4 p-4 glass shadow-medium animate-float hidden md:block">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Export Ready</span>
            </div>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.title}
                className="p-6 hover-lift shadow-soft bg-gradient-card animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 text-center">
          <div className="animate-fade-in">
            <div className="text-3xl font-bold text-primary mb-2">10K+</div>
            <div className="text-sm text-muted-foreground">Maps Created</div>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="text-3xl font-bold text-primary mb-2">50+</div>
            <div className="text-sm text-muted-foreground">Templates</div>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="text-3xl font-bold text-primary mb-2">99%</div>
            <div className="text-sm text-muted-foreground">User Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
};