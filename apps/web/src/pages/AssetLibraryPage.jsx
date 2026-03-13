
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FolderOpen, Search, Download, Heart, Link as LinkIcon, Filter, Image as ImageIcon, Shapes, Type } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AssetLibraryPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Mock Data
  const mockAssets = [
    { id: 1, title: 'Abstract Geometric Pattern', type: 'pattern', category: 'Abstract', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&h=500&fit=crop', size: '2.4 MB', format: 'PNG' },
    { id: 2, title: 'Minimalist Desk Setup', type: 'image', category: 'Lifestyle', url: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=500&h=500&fit=crop', size: '4.1 MB', format: 'JPG' },
    { id: 3, title: 'Watercolor Texture', type: 'texture', category: 'Art', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&h=500&fit=crop', size: '5.2 MB', format: 'PNG' },
    { id: 4, title: 'Business Icons Set', type: 'icon', category: 'Business', url: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=500&h=500&fit=crop', size: '1.1 MB', format: 'SVG' },
    { id: 5, title: 'Botanical Illustration', type: 'illustration', category: 'Nature', url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=500&h=500&fit=crop', size: '3.5 MB', format: 'PNG' },
    { id: 6, title: 'Soft Pastel Gradient', type: 'texture', category: 'Abstract', url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=500&h=500&fit=crop', size: '2.8 MB', format: 'JPG' },
    { id: 7, title: 'Planner Layout Grid', type: 'pattern', category: 'Templates', url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&h=500&fit=crop', size: '1.5 MB', format: 'PNG' },
    { id: 8, title: 'Coffee & Notebook', type: 'image', category: 'Lifestyle', url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=500&h=500&fit=crop', size: '3.9 MB', format: 'JPG' },
  ];

  const filteredAssets = mockAssets.filter(asset => {
    const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase()) || asset.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || asset.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleAction = (action, asset) => {
    toast({
      title: `${action} Successful`,
      description: `Action performed on ${asset.title}`,
      className: "bg-[#111111] text-white border-[#8A6CFF]"
    });
  };

  return (
    <>
      <Helmet>
        <title>Asset Library - EtsyForge AI</title>
        <meta name="description" content="Browse and manage your digital product assets" />
      </Helmet>

      <DashboardLayout>
        <div className="p-6 lg:p-10 bg-[#F4F4F6] min-h-screen">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111111] p-8 rounded-3xl text-white shadow-xl">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-[#8A6CFF]/20 flex items-center justify-center border border-[#8A6CFF]/30">
                  <FolderOpen className="w-8 h-8 text-[#D6FF3F]" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight">Asset Library</h1>
                  <p className="text-gray-400 font-medium mt-1">Premium stock assets and design elements</p>
                </div>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input 
                  placeholder="Search assets..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:ring-[#D6FF3F]"
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <TabsList className="bg-gray-100 p-1 rounded-xl h-auto">
                    <TabsTrigger value="all" className="rounded-lg px-4 py-2 font-bold data-[state=active]:bg-white data-[state=active]:text-[#111111] data-[state=active]:shadow-sm">All Assets</TabsTrigger>
                    <TabsTrigger value="image" className="rounded-lg px-4 py-2 font-bold data-[state=active]:bg-white data-[state=active]:text-[#111111] data-[state=active]:shadow-sm">Images</TabsTrigger>
                    <TabsTrigger value="pattern" className="rounded-lg px-4 py-2 font-bold data-[state=active]:bg-white data-[state=active]:text-[#111111] data-[state=active]:shadow-sm">Patterns</TabsTrigger>
                    <TabsTrigger value="icon" className="rounded-lg px-4 py-2 font-bold data-[state=active]:bg-white data-[state=active]:text-[#111111] data-[state=active]:shadow-sm">Icons</TabsTrigger>
                    <TabsTrigger value="texture" className="rounded-lg px-4 py-2 font-bold data-[state=active]:bg-white data-[state=active]:text-[#111111] data-[state=active]:shadow-sm">Textures</TabsTrigger>
                  </TabsList>
                  
                  <Button variant="outline" className="rounded-xl border-gray-200 font-bold text-[#111111]">
                    <Filter className="w-4 h-4 mr-2" /> Filters
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <AnimatePresence>
                    {filteredAssets.map((asset, index) => (
                      <motion.div
                        key={asset.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group bg-white h-full flex flex-col">
                          <div className="relative aspect-square overflow-hidden bg-gray-100">
                            <img 
                              src={asset.url} 
                              alt={asset.title} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-[#111111]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                              <Button size="icon" variant="secondary" className="rounded-full bg-white text-[#111111] hover:bg-[#D6FF3F]" onClick={() => handleAction('Download', asset)}>
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button size="icon" variant="secondary" className="rounded-full bg-white text-[#111111] hover:bg-[#8A6CFF] hover:text-white" onClick={() => handleAction('Saved to Favorites', asset)}>
                                <Heart className="w-4 h-4" />
                              </Button>
                              <Button size="icon" variant="secondary" className="rounded-full bg-white text-[#111111] hover:bg-gray-200" onClick={() => handleAction('Link Copied', asset)}>
                                <LinkIcon className="w-4 h-4" />
                              </Button>
                            </div>
                            <Badge className="absolute top-3 left-3 bg-white/90 text-[#111111] hover:bg-white border-none backdrop-blur-sm font-bold">
                              {asset.format}
                            </Badge>
                          </div>
                          <CardContent className="p-4 flex-1 flex flex-col">
                            <h3 className="font-bold text-[#111111] text-sm line-clamp-1 mb-1" title={asset.title}>{asset.title}</h3>
                            <div className="flex items-center justify-between mt-auto pt-2">
                              <span className="text-xs font-medium text-gray-500">{asset.category}</span>
                              <span className="text-xs font-medium text-gray-400">{asset.size}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                
                {filteredAssets.length === 0 && (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-[#111111]">No assets found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
                  </div>
                )}
              </Tabs>
            </div>

          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default AssetLibraryPage;
