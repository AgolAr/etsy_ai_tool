
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Type, Image as ImageIcon, Square, Palette, Layers, 
  ZoomIn, ZoomOut, Undo, Redo, Grid, Download, Save, 
  MousePointer2, Move, Settings, FileText, LayoutTemplate
} from 'lucide-react';
import { motion } from 'framer-motion';

const DesignStudioPage = () => {
  const { toast } = useToast();
  const [activeTool, setActiveTool] = useState('select');
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'image', icon: ImageIcon, label: 'Image' },
    { id: 'shape', icon: Square, label: 'Shape' },
    { id: 'color', icon: Palette, label: 'Color' },
    { id: 'background', icon: LayoutTemplate, label: 'Background' },
  ];

  const handleExport = (format) => {
    setIsExporting(true);
    toast({
      title: `Exporting as ${format}...`,
      description: "Preparing your design for download.",
      className: "bg-[#111111] text-white border-[#8A6CFF]"
    });
    
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Export Complete 🎉",
        description: `Your ${format} file has been downloaded.`,
        className: "bg-[#111111] text-white border-[#D6FF3F]"
      });
    }, 2000);
  };

  return (
    <>
      <Helmet>
        <title>Design Studio - EtsyForge AI</title>
        <meta name="description" content="Canvas-based design editor for your digital products" />
      </Helmet>

      <DashboardLayout>
        <div className="h-[calc(100vh-4rem)] lg:h-screen flex flex-col bg-[#F4F4F6] overflow-hidden">
          
          {/* Top Toolbar */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-10">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-[#111111]">
                  <Undo className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-[#111111]">
                  <Redo className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-gray-600 font-medium">
                  <FileText className="w-4 h-4 mr-2" />
                  Templates
                </Button>
                <span className="text-gray-300">|</span>
                <span className="text-sm font-bold text-[#111111]">Untitled Design</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="rounded-xl border-gray-200 text-[#111111] font-bold hover:bg-gray-50"
                onClick={() => toast({ title: "Saved to templates", className: "bg-[#111111] text-white border-[#D6FF3F]" })}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Template
              </Button>
              <Button 
                className="bg-[#8A6CFF] hover:bg-[#7a5ce6] text-white font-bold rounded-xl"
                onClick={() => handleExport('PDF')}
                disabled={isExporting}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar - Tools */}
            <aside className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-4 shrink-0 z-10">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                      activeTool === tool.id 
                        ? 'bg-[#8A6CFF]/10 text-[#8A6CFF]' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-[#111111]'
                    }`}
                    title={tool.label}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                );
              })}
              <div className="mt-auto pt-4 border-t border-gray-100 w-full flex justify-center">
                <button className="w-12 h-12 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[#111111]">
                  <Layers className="w-5 h-5" />
                </button>
              </div>
            </aside>

            {/* Center Canvas Area */}
            <main className="flex-1 relative bg-[#F4F4F6] overflow-auto flex items-center justify-center p-8">
              {/* Canvas Controls */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg border border-gray-200 px-4 py-2 flex items-center gap-4 z-10">
                <button onClick={() => setZoom(Math.max(10, zoom - 10))} className="text-gray-500 hover:text-[#111111]">
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold text-[#111111] w-12 text-center">{zoom}%</span>
                <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="text-gray-500 hover:text-[#111111]">
                  <ZoomIn className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-gray-200"></div>
                <button 
                  onClick={() => setShowGrid(!showGrid)} 
                  className={`${showGrid ? 'text-[#8A6CFF]' : 'text-gray-500 hover:text-[#111111]'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>

              {/* The Canvas (Mock) */}
              <motion.div 
                className="bg-white shadow-2xl relative transition-transform duration-200"
                style={{ 
                  width: '800px', 
                  height: '1000px', 
                  transform: `scale(${zoom / 100})`,
                  backgroundImage: showGrid ? 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)' : 'none',
                  backgroundSize: '20px 20px'
                }}
              >
                {/* Mock Elements */}
                <div className="absolute top-20 left-20 p-4 border-2 border-transparent hover:border-[#8A6CFF] cursor-move group">
                  <h1 className="text-4xl font-bold text-[#111111] font-serif">Weekly Planner</h1>
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#8A6CFF] rounded-full hidden group-hover:flex items-center justify-center text-white">
                    <Move className="w-3 h-3" />
                  </div>
                </div>

                <div className="absolute top-40 left-20 w-[700px] h-[800px] border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400">
                  Drag and drop elements here
                </div>
              </motion.div>
            </main>

            {/* Right Sidebar - Properties */}
            <aside className="w-72 bg-white border-l border-gray-200 flex flex-col shrink-0 z-10 overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#111111]" />
                <h2 className="font-bold text-[#111111]">Properties</h2>
              </div>
              
              <div className="p-4 space-y-6">
                {/* Mock Properties Panel */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Canvas Size</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
                      <span className="text-xs text-gray-400 block">Width</span>
                      <span className="font-bold text-[#111111]">8.5 in</span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
                      <span className="text-xs text-gray-400 block">Height</span>
                      <span className="font-bold text-[#111111]">11 in</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Background</label>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 cursor-pointer"></div>
                    <div className="w-8 h-8 rounded-full bg-[#F4F4F6] border-2 border-transparent cursor-pointer"></div>
                    <div className="w-8 h-8 rounded-full bg-[#111111] border-2 border-transparent cursor-pointer"></div>
                    <div className="w-8 h-8 rounded-full bg-[#8A6CFF] border-2 border-transparent cursor-pointer"></div>
                    <div className="w-8 h-8 rounded-full bg-[#D6FF3F] border-2 border-transparent cursor-pointer"></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Export Settings</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-[#111111]">
                      <input type="checkbox" className="rounded text-[#8A6CFF] focus:ring-[#8A6CFF]" defaultChecked />
                      Include bleed area
                    </label>
                    <label className="flex items-center gap-2 text-sm text-[#111111]">
                      <input type="checkbox" className="rounded text-[#8A6CFF] focus:ring-[#8A6CFF]" />
                      Crop marks
                    </label>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default DesignStudioPage;
