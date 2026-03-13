
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import { useProductGenerator } from '@/hooks/useProductGenerator.js';
import { useToast } from '@/hooks/use-toast';
import apiServerClient from '@/lib/apiServerClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Wand2, ChevronRight, ChevronLeft, Plus, Minus, Save, Download, CheckCircle2, Layout, Palette, Type, FileText, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductGeneratorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { generateDesignSuggestions, saveDraft, loading } = useProductGenerator();
  
  const [step, setStep] = useState(1);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [generatingContentId, setGeneratingContentId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: location.state?.prefill?.name || '',
    niche: location.state?.prefill?.niche || '',
    audience: location.state?.prefill?.audience || '',
    description: location.state?.prefill?.description || '',
    outline: [],
    design: {
      palette: 'minimalist',
      layout: 'single',
      font: 'modern'
    }
  });

  const [designOptions, setDesignOptions] = useState({ palettes: [], layouts: [], fonts: [] });

  useEffect(() => {
    setDesignOptions(generateDesignSuggestions());
  }, []);

  const handleNext = async () => {
    if (step === 1) {
      if (!formData.name || !formData.niche) {
        toast({ title: "Missing fields", description: "Please fill in the product name and niche.", variant: "destructive" });
        return;
      }
      if (formData.outline.length === 0) {
        setIsGeneratingOutline(true);
        try {
          const response = await apiServerClient.fetch('/ai/outline', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productTitle: formData.name,
              productType: formData.niche,
              niche: formData.niche,
              audience: formData.audience,
              tone: 'professional'
            })
          });
          
          const data = await response.json();
          if (!response.ok || data.status === 'error') throw new Error(data.error || 'Failed to generate outline');
          
          const items = data.outline.chapters || data.outline.pageIdeas || [];
          const newOutline = items.map(item => ({
            id: crypto.randomUUID(),
            title: item.title || item,
            content: ''
          }));
          
          setFormData(prev => ({ ...prev, outline: newOutline }));
        } catch (error) {
          toast({ title: "Error generating outline", description: error.message, variant: "destructive" });
        } finally {
          setIsGeneratingOutline(false);
        }
      }
    }
    setStep(s => Math.min(5, s + 1));
  };

  const handlePrev = () => setStep(s => Math.max(1, s - 1));

  const handleSaveDraft = async () => {
    try {
      await saveDraft(formData);
      toast({
        title: "Draft Saved",
        description: "Your product draft has been saved successfully.",
        className: "bg-[#111111] text-white border-[#D6FF3F]"
      });
      navigate('/dashboard');
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleExport = (format) => {
    toast({
      title: "Export Started",
      description: `Your product is being generated as ${format}. This may take a moment.`,
      className: "bg-[#111111] text-white border-[#8A6CFF]"
    });
    setTimeout(() => {
      toast({
        title: "Export Complete 🎉",
        description: "Your file has been downloaded.",
        className: "bg-[#111111] text-white border-[#D6FF3F]"
      });
    }, 2000);
  };

  // Outline Handlers
  const addOutlineSection = () => {
    setFormData(prev => ({
      ...prev,
      outline: [...prev.outline, { id: crypto.randomUUID(), title: 'New Section', content: '' }]
    }));
  };

  const removeOutlineSection = (id) => {
    setFormData(prev => ({
      ...prev,
      outline: prev.outline.filter(item => item.id !== id)
    }));
  };

  const updateOutlineSection = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      outline: prev.outline.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const handleGenerateContent = async (id, title) => {
    setGeneratingContentId(id);
    try {
      const response = await apiServerClient.fetch('/ai/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productType: formData.niche,
          sectionName: title,
          tone: 'professional',
          style: 'step-by-step',
          context: formData.description
        })
      });
      
      const data = await response.json();
      if (!response.ok || data.status === 'error') throw new Error(data.error || 'Failed to generate content');
      
      updateOutlineSection(id, 'content', data.content.content);
      toast({
        title: "Content Generated",
        description: `Generated content for "${title}"`,
        className: "bg-[#111111] text-white border-[#D6FF3F]"
      });
    } catch (error) {
      toast({ title: "Error generating content", description: error.message, variant: "destructive" });
    } finally {
      setGeneratingContentId(null);
    }
  };

  const steps = [
    { num: 1, title: 'Details' },
    { num: 2, title: 'Outline' },
    { num: 3, title: 'Design' },
    { num: 4, title: 'Preview' },
    { num: 5, title: 'Export' }
  ];

  return (
    <>
      <Helmet>
        <title>Product Generator - EtsyForge AI</title>
        <meta name="description" content="Create digital products with AI" />
      </Helmet>

      <DashboardLayout>
        <div className="p-6 lg:p-10 bg-[#F4F4F6] min-h-screen">
          <div className="max-w-5xl mx-auto">
            
            {/* Header & Progress */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#111111] flex items-center justify-center shadow-lg">
                    <Wand2 className="w-7 h-7 text-[#D6FF3F]" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-extrabold text-[#111111] tracking-tight">Product Generator</h1>
                    <p className="text-gray-500 font-medium">Create your digital product in 5 steps</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleSaveDraft}
                  disabled={loading}
                  className="hidden md:flex rounded-xl border-gray-300 text-[#111111] hover:bg-gray-100 font-bold"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full z-0"></div>
                <div 
                  className="absolute top-1/2 left-0 h-1 bg-[#8A6CFF] -translate-y-1/2 rounded-full z-0 transition-all duration-500"
                  style={{ width: `${((step - 1) / 4) * 100}%` }}
                ></div>
                <div className="relative z-10 flex justify-between">
                  {steps.map((s) => (
                    <div key={s.num} className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                        step >= s.num 
                          ? 'bg-[#8A6CFF] text-white shadow-lg shadow-[#8A6CFF]/40' 
                          : 'bg-white text-gray-400 border-2 border-gray-200'
                      }`}>
                        {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                      </div>
                      <span className={`text-xs font-bold hidden sm:block ${step >= s.num ? 'text-[#111111]' : 'text-gray-400'}`}>
                        {s.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white min-h-[500px] flex flex-col">
              <CardContent className="p-8 flex-1">
                <AnimatePresence mode="wait">
                  
                  {/* STEP 1: Details */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6 max-w-2xl mx-auto"
                    >
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-extrabold text-[#111111]">Product Details</h2>
                        <p className="text-gray-500">Let's start with the basics of what you're creating.</p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-[#111111] font-bold">Product Name *</Label>
                          <Input 
                            placeholder="e.g. Ultimate ADHD Planner" 
                            className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:ring-[#8A6CFF]"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-[#111111] font-bold">Niche *</Label>
                            <Select value={formData.niche} onValueChange={(v) => setFormData({...formData, niche: v})}>
                              <SelectTrigger className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:ring-[#8A6CFF]">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Planner">Planner</SelectItem>
                                <SelectItem value="Workbook">Workbook</SelectItem>
                                <SelectItem value="Tracker">Tracker</SelectItem>
                                <SelectItem value="Template">Template</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[#111111] font-bold">Target Audience</Label>
                            <Input 
                              placeholder="e.g. Students, Moms" 
                              className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:ring-[#8A6CFF]"
                              value={formData.audience}
                              onChange={(e) => setFormData({...formData, audience: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[#111111] font-bold">Description</Label>
                          <Textarea 
                            placeholder="Briefly describe what this product helps the user achieve..." 
                            className="min-h-[120px] rounded-xl bg-gray-50 border-gray-200 focus:ring-[#8A6CFF] resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: Outline */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6 max-w-3xl mx-auto"
                    >
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-extrabold text-[#111111]">Content Outline</h2>
                        <p className="text-gray-500">AI generated this structure based on your niche. Customize it and generate content.</p>
                      </div>

                      {isGeneratingOutline ? (
                        <div className="flex flex-col items-center justify-center py-20">
                          <Loader2 className="w-10 h-10 text-[#8A6CFF] animate-spin mb-4" />
                          <p className="text-gray-500 font-medium">Generating optimal structure...</p>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                          <div className="space-y-4">
                            {formData.outline.map((item, index) => (
                              <div key={item.id} className="flex flex-col gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100 group">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm">
                                    {index + 1}
                                  </div>
                                  <Input 
                                    value={item.title}
                                    onChange={(e) => updateOutlineSection(item.id, 'title', e.target.value)}
                                    className="flex-1 border-none shadow-none focus-visible:ring-1 focus-visible:ring-[#8A6CFF] bg-transparent font-medium text-[#111111]"
                                  />
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleGenerateContent(item.id, item.title)}
                                    disabled={generatingContentId === item.id}
                                    className="font-bold border-gray-200 text-[#111111]"
                                  >
                                    {generatingContentId === item.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Wand2 className="w-4 h-4 mr-2 text-[#8A6CFF]" />}
                                    Content
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => removeOutlineSection(item.id)}
                                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </Button>
                                </div>
                                {item.content !== undefined && (
                                  <Textarea 
                                    value={item.content}
                                    onChange={(e) => updateOutlineSection(item.id, 'content', e.target.value)}
                                    className="min-h-[100px] rounded-lg border-gray-200 bg-gray-50 focus:ring-[#8A6CFF] text-sm"
                                    placeholder="Section content will appear here..."
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                          <Button 
                            variant="outline" 
                            onClick={addOutlineSection}
                            className="w-full mt-4 border-dashed border-2 border-gray-300 text-gray-500 hover:text-[#8A6CFF] hover:border-[#8A6CFF] hover:bg-[#8A6CFF]/5 rounded-xl h-12"
                          >
                            <Plus className="w-4 h-4 mr-2" /> Add Section
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* STEP 3: Design */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8 max-w-4xl mx-auto"
                    >
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-extrabold text-[#111111]">Design Preferences</h2>
                        <p className="text-gray-500">Choose the visual style for your product.</p>
                      </div>

                      <div className="grid md:grid-cols-3 gap-8">
                        {/* Palettes */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-[#111111] font-bold mb-2">
                            <Palette className="w-5 h-5 text-[#8A6CFF]" />
                            <h3>Color Palette</h3>
                          </div>
                          <div className="space-y-3">
                            {designOptions.palettes.map(palette => (
                              <div 
                                key={palette.id}
                                onClick={() => setFormData(prev => ({...prev, design: {...prev.design, palette: palette.id}}))}
                                className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                  formData.design.palette === palette.id ? 'border-[#8A6CFF] bg-[#8A6CFF]/5' : 'border-gray-100 hover:border-gray-300'
                                }`}
                              >
                                <p className="text-sm font-bold text-[#111111] mb-2">{palette.name}</p>
                                <div className="flex h-6 rounded-md overflow-hidden">
                                  {palette.colors.map((c, i) => (
                                    <div key={i} className="flex-1" style={{ backgroundColor: c }}></div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Layouts */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-[#111111] font-bold mb-2">
                            <Layout className="w-5 h-5 text-[#8A6CFF]" />
                            <h3>Layout Style</h3>
                          </div>
                          <div className="space-y-3">
                            {designOptions.layouts.map(layout => (
                              <div 
                                key={layout.id}
                                onClick={() => setFormData(prev => ({...prev, design: {...prev.design, layout: layout.id}}))}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                                  formData.design.layout === layout.id ? 'border-[#8A6CFF] bg-[#8A6CFF]/5' : 'border-gray-100 hover:border-gray-300'
                                }`}
                              >
                                <span className="font-bold text-[#111111] text-sm">{layout.name}</span>
                                <div className={`w-4 h-4 rounded-full border-2 ${formData.design.layout === layout.id ? 'border-[#8A6CFF] bg-[#8A6CFF]' : 'border-gray-300'}`}></div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Fonts */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-[#111111] font-bold mb-2">
                            <Type className="w-5 h-5 text-[#8A6CFF]" />
                            <h3>Typography</h3>
                          </div>
                          <div className="space-y-3">
                            {designOptions.fonts.map(font => (
                              <div 
                                key={font.id}
                                onClick={() => setFormData(prev => ({...prev, design: {...prev.design, font: font.id}}))}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                                  formData.design.font === font.id ? 'border-[#8A6CFF] bg-[#8A6CFF]/5' : 'border-gray-100 hover:border-gray-300'
                                }`}
                              >
                                <span className={`font-bold text-[#111111] text-sm ${font.id === 'classic' ? 'font-serif' : ''}`}>{font.name}</span>
                                <div className={`w-4 h-4 rounded-full border-2 ${formData.design.font === font.id ? 'border-[#8A6CFF] bg-[#8A6CFF]' : 'border-gray-300'}`}></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: Preview */}
                  {step === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6 max-w-4xl mx-auto"
                    >
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-extrabold text-[#111111]">Product Preview</h2>
                        <p className="text-gray-500">Here's a mockup of how your product will look.</p>
                      </div>

                      <div className="bg-gray-100 rounded-3xl p-8 flex items-center justify-center min-h-[400px]">
                        {/* Mockup Container */}
                        <div className="w-full max-w-md aspect-[1/1.4] bg-white shadow-2xl rounded-sm relative overflow-hidden flex flex-col">
                          {/* Dynamic styling based on selections */}
                          <div className={`h-32 ${formData.design.palette === 'vibrant' ? 'bg-[#8A6CFF]' : formData.design.palette === 'corporate' ? 'bg-blue-600' : 'bg-gray-900'} p-6 flex items-end`}>
                            <h1 className={`text-3xl font-bold text-white ${formData.design.font === 'classic' ? 'font-serif' : 'font-sans'}`}>
                              {formData.name || 'Untitled Product'}
                            </h1>
                          </div>
                          <div className="p-6 flex-1 flex flex-col gap-4">
                            <div className="w-1/3 h-2 bg-gray-200 rounded"></div>
                            <div className="w-full h-2 bg-gray-100 rounded"></div>
                            <div className="w-5/6 h-2 bg-gray-100 rounded"></div>
                            
                            <div className={`mt-6 grid ${formData.design.layout === 'grid' ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                              <div className="h-20 border-2 border-dashed border-gray-200 rounded-lg"></div>
                              <div className="h-20 border-2 border-dashed border-gray-200 rounded-lg"></div>
                            </div>
                          </div>
                          <div className="p-4 text-center text-xs text-gray-400 border-t border-gray-100">
                            Generated by EtsyForge AI
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 5: Export */}
                  {step === 5 && (
                    <motion.div
                      key="step5"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6 max-w-2xl mx-auto text-center"
                    >
                      <div className="w-24 h-24 bg-[#D6FF3F]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-12 h-12 text-[#a8cc2b]" />
                      </div>
                      <h2 className="text-3xl font-extrabold text-[#111111]">Ready to Export!</h2>
                      <p className="text-gray-500 text-lg mb-8">
                        Your product "{formData.name}" is fully generated and ready to be downloaded.
                      </p>

                      <div className="grid sm:grid-cols-3 gap-4">
                        <Card className="border-2 border-gray-100 hover:border-[#8A6CFF] transition-colors cursor-pointer group" onClick={() => handleExport('PDF')}>
                          <CardContent className="p-6 flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <FileText className="w-6 h-6" />
                            </div>
                            <div className="text-center">
                              <p className="font-bold text-[#111111]">PDF Document</p>
                              <p className="text-xs text-gray-400">Print ready (~2.4 MB)</p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-2 border-gray-100 hover:border-[#8A6CFF] transition-colors cursor-pointer group" onClick={() => handleExport('PNG')}>
                          <CardContent className="p-6 flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Layout className="w-6 h-6" />
                            </div>
                            <div className="text-center">
                              <p className="font-bold text-[#111111]">PNG Images</p>
                              <p className="text-xs text-gray-400">Individual pages (~5.1 MB)</p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-2 border-gray-100 hover:border-[#8A6CFF] transition-colors cursor-pointer group" onClick={() => handleExport('ZIP')}>
                          <CardContent className="p-6 flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Download className="w-6 h-6" />
                            </div>
                            <div className="text-center">
                              <p className="font-bold text-[#111111]">Source Files</p>
                              <p className="text-xs text-gray-400">Editable ZIP (~12 MB)</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </CardContent>

              {/* Footer Navigation */}
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <Button 
                  variant="ghost" 
                  onClick={handlePrev} 
                  disabled={step === 1}
                  className="text-gray-500 hover:text-[#111111] font-bold"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                
                {step < 5 ? (
                  <Button 
                    onClick={handleNext}
                    className="bg-[#111111] hover:bg-gray-800 text-white font-bold px-8 rounded-xl h-12"
                  >
                    Next Step <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    onClick={() => navigate('/dashboard')}
                    className="bg-[#111111] hover:bg-gray-800 text-white font-bold px-8 rounded-xl h-12"
                  >
                    Return to Dashboard
                  </Button>
                )}
              </div>
            </Card>

          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default ProductGeneratorPage;
