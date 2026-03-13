
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Plus, Save, Trash2, Edit2, Palette, Type, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const BrandKitPage = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [brandKits, setBrandKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingKit, setEditingKit] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    primary_color: '#111111',
    secondary_color: '#8A6CFF',
    accent_color: '#D6FF3F',
    primary_font: 'Inter',
    secondary_font: 'Merriweather'
  });

  useEffect(() => {
    fetchBrandKits();
  }, [currentUser]);

  const fetchBrandKits = async () => {
    if (!currentUser) return;
    try {
      const records = await pb.collection('brand_kits').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setBrandKits(records);
    } catch (error) {
      console.error("Error fetching brand kits:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!formData.name) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const data = { ...formData, user_id: currentUser.id };
      
      if (editingKit) {
        await pb.collection('brand_kits').update(editingKit.id, data, { $autoCancel: false });
        toast({ title: "Brand Kit Updated", className: "bg-[#111111] text-white border-[#D6FF3F]" });
      } else {
        await pb.collection('brand_kits').create(data, { $autoCancel: false });
        toast({ title: "Brand Kit Created", className: "bg-[#111111] text-white border-[#D6FF3F]" });
      }
      
      setFormData({
        name: '', description: '', primary_color: '#111111', secondary_color: '#8A6CFF', accent_color: '#D6FF3F', primary_font: 'Inter', secondary_font: 'Merriweather'
      });
      setEditingKit(null);
      fetchBrandKits();
    } catch (error) {
      toast({ title: "Error saving", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (kit) => {
    setEditingKit(kit);
    setFormData({
      name: kit.name,
      description: kit.description || '',
      primary_color: kit.primary_color || '#111111',
      secondary_color: kit.secondary_color || '#8A6CFF',
      accent_color: kit.accent_color || '#D6FF3F',
      primary_font: kit.primary_font || 'Inter',
      secondary_font: kit.secondary_font || 'Merriweather'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this brand kit?")) return;
    try {
      await pb.collection('brand_kits').delete(id, { $autoCancel: false });
      toast({ title: "Brand Kit Deleted", className: "bg-[#111111] text-white" });
      fetchBrandKits();
      if (editingKit?.id === id) {
        setEditingKit(null);
        setFormData({ name: '', description: '', primary_color: '#111111', secondary_color: '#8A6CFF', accent_color: '#D6FF3F', primary_font: 'Inter', secondary_font: 'Merriweather' });
      }
    } catch (error) {
      toast({ title: "Error deleting", description: error.message, variant: "destructive" });
    }
  };

  return (
    <>
      <Helmet>
        <title>Brand Kit - EtsyForge AI</title>
        <meta name="description" content="Manage your brand assets and style guide" />
      </Helmet>

      <DashboardLayout>
        <div className="p-6 lg:p-10 bg-[#F4F4F6] min-h-screen">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111111] p-8 rounded-3xl text-white shadow-xl">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-[#8A6CFF]/20 flex items-center justify-center border border-[#8A6CFF]/30">
                  <Package className="w-8 h-8 text-[#D6FF3F]" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight">Brand Kit</h1>
                  <p className="text-gray-400 font-medium mt-1">Maintain consistent branding across products</p>
                </div>
              </div>
              {editingKit && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditingKit(null);
                    setFormData({ name: '', description: '', primary_color: '#111111', secondary_color: '#8A6CFF', accent_color: '#D6FF3F', primary_font: 'Inter', secondary_font: 'Merriweather' });
                  }}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel Edit
                </Button>
              )}
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-5 space-y-6">
                <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-white">
                  <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                    <CardTitle className="text-xl font-extrabold text-[#111111]">
                      {editingKit ? 'Edit Brand Kit' : 'Create New Brand Kit'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={handleSave} className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-[#111111] font-bold">Brand Name *</Label>
                          <Input 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="e.g. Minimalist Planners Co."
                            className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:ring-[#8A6CFF]"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[#111111] font-bold">Description</Label>
                          <Textarea 
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Brand mission and values..."
                            className="min-h-[80px] rounded-xl bg-gray-50 border-gray-200 focus:ring-[#8A6CFF] resize-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-[#111111] font-bold">
                          <Palette className="w-5 h-5 text-[#8A6CFF]" />
                          <h3>Colors</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-500">Primary</Label>
                            <div className="flex items-center gap-2">
                              <input 
                                type="color" 
                                value={formData.primary_color}
                                onChange={(e) => setFormData({...formData, primary_color: e.target.value})}
                                className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                              />
                              <Input value={formData.primary_color} readOnly className="h-10 text-xs" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-500">Secondary</Label>
                            <div className="flex items-center gap-2">
                              <input 
                                type="color" 
                                value={formData.secondary_color}
                                onChange={(e) => setFormData({...formData, secondary_color: e.target.value})}
                                className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                              />
                              <Input value={formData.secondary_color} readOnly className="h-10 text-xs" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-500">Accent</Label>
                            <div className="flex items-center gap-2">
                              <input 
                                type="color" 
                                value={formData.accent_color}
                                onChange={(e) => setFormData({...formData, accent_color: e.target.value})}
                                className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                              />
                              <Input value={formData.accent_color} readOnly className="h-10 text-xs" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-[#111111] font-bold">
                          <Type className="w-5 h-5 text-[#8A6CFF]" />
                          <h3>Typography</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-500">Primary Font</Label>
                            <Input 
                              value={formData.primary_font}
                              onChange={(e) => setFormData({...formData, primary_font: e.target.value})}
                              className="h-10 rounded-lg bg-gray-50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-500">Secondary Font</Label>
                            <Input 
                              value={formData.secondary_font}
                              onChange={(e) => setFormData({...formData, secondary_font: e.target.value})}
                              className="h-10 rounded-lg bg-gray-50"
                            />
                          </div>
                        </div>
                      </div>

                      <Button 
                        type="submit"
                        disabled={isSaving}
                        className="w-full h-12 rounded-xl bg-[#111111] hover:bg-gray-800 text-white font-bold mt-6"
                      >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                        {editingKit ? 'Update Brand Kit' : 'Save Brand Kit'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* List Section */}
              <div className="lg:col-span-7 space-y-6">
                <h2 className="text-2xl font-extrabold text-[#111111]">Your Brand Kits</h2>
                
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-[#8A6CFF] animate-spin" />
                  </div>
                ) : brandKits.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-[#111111]">No brand kits yet</h3>
                    <p className="text-gray-500 mt-1">Create your first brand kit using the form.</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {brandKits.map((kit) => (
                      <motion.div
                        key={kit.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <Card className="border-none shadow-md hover:shadow-lg transition-shadow rounded-2xl overflow-hidden bg-white group">
                          <div className="h-24 flex">
                            <div className="flex-1" style={{ backgroundColor: kit.primary_color }}></div>
                            <div className="flex-1" style={{ backgroundColor: kit.secondary_color }}></div>
                            <div className="flex-1" style={{ backgroundColor: kit.accent_color }}></div>
                          </div>
                          <CardContent className="p-5">
                            <h3 className="font-extrabold text-[#111111] text-lg mb-1 truncate">{kit.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                              <Type className="w-4 h-4" />
                              <span className="truncate">{kit.primary_font}, {kit.secondary_font}</span>
                            </div>
                            <div className="flex gap-2 mt-auto">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEdit(kit)}
                                className="flex-1 rounded-lg font-bold border-gray-200 hover:bg-gray-50"
                              >
                                <Edit2 className="w-4 h-4 mr-2" /> Edit
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDelete(kit.id)}
                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default BrandKitPage;
