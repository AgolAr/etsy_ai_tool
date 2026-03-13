
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import apiServerClient from '@/lib/apiServerClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Sparkles, Copy, Save, Download, AlertCircle, Loader2, Search, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ListingOptimizerPage = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  const [formData, setFormData] = useState({
    name: 'Productivity Planner',
    description: 'A planner to help you be more productive every day.',
    category: 'Planners',
    price: '9.99',
    audience: 'Adults',
    keywords: 'planner, productivity, digital'
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    setShowResults(false);
    
    try {
      const response = await apiServerClient.fetch('/ai/listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productTitle: formData.name,
          niche: formData.category,
          audience: formData.audience,
          productType: formData.category,
          keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
          tone: 'professional'
        })
      });

      const data = await response.json();
      if (!response.ok || data.status === 'error') {
        throw new Error(data.error || 'Failed to optimize listing');
      }

      setResults(data.listing);
      setShowResults(true);
      toast({
        title: "Optimization Complete",
        description: "AI has generated suggestions for your listing.",
        className: "bg-[#111111] text-white border-[#D6FF3F]"
      });
    } catch (error) {
      toast({
        title: "Error optimizing listing",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${type} has been copied.`,
      className: "bg-[#111111] text-white border-[#8A6CFF]"
    });
  };

  const handleSaveDraft = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    try {
      await pb.collection('saved_listings').create({
        product_name: formData.name,
        title: results.etsyTitle,
        description: results.description,
        tags: results.tags.join(', '),
        price: parseFloat(formData.price) || 0,
        seo_score: results.seoScore,
        user_id: currentUser.id
      }, { $autoCancel: false });
      
      toast({
        title: "Listing Saved",
        description: "Your optimized listing has been saved to your account.",
        className: "bg-[#111111] text-white border-[#D6FF3F]"
      });
    } catch (error) {
      toast({
        title: "Error saving listing",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <>
      <Helmet>
        <title>Listing Optimizer - EtsyForge AI</title>
        <meta name="description" content="Optimize your Etsy listings with AI-powered SEO" />
      </Helmet>

      <DashboardLayout>
        <div className="p-6 lg:p-10 bg-[#F4F4F6] min-h-screen">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111111] p-8 rounded-3xl text-white shadow-xl">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-[#8A6CFF]/20 flex items-center justify-center border border-[#8A6CFF]/30">
                  <TrendingUp className="w-8 h-8 text-[#D6FF3F]" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight">Listing Optimizer</h1>
                  <p className="text-gray-400 font-medium mt-1">AI-powered SEO for maximum visibility</p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
              {/* Left Column: Input Form */}
              <div className="lg:col-span-5 space-y-6">
                <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-white">
                  <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                    <CardTitle className="text-xl font-extrabold text-[#111111]">Original Details</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-5">
                    <div className="space-y-2">
                      <Label className="text-[#111111] font-bold">Product Name</Label>
                      <Input 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:ring-[#8A6CFF]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-[#111111] font-bold">Brief Description</Label>
                      <Textarea 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="min-h-[100px] rounded-xl bg-gray-50 border-gray-200 focus:ring-[#8A6CFF] resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#111111] font-bold">Keywords (comma separated)</Label>
                      <Input 
                        value={formData.keywords}
                        onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                        placeholder="e.g. planner, digital download, adhd"
                        className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:ring-[#8A6CFF]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[#111111] font-bold">Category</Label>
                        <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                          <SelectTrigger className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:ring-[#8A6CFF]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Planners">Planners</SelectItem>
                            <SelectItem value="Printables">Printables</SelectItem>
                            <SelectItem value="Templates">Templates</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[#111111] font-bold">Current Price ($)</Label>
                        <Input 
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:ring-[#8A6CFF]"
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="w-full h-12 rounded-xl bg-[#8A6CFF] hover:bg-[#7a5ce6] text-white font-bold shadow-lg shadow-[#8A6CFF]/30 transition-all mt-4"
                    >
                      {isGenerating ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Optimize Listing
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Results */}
              <div className="lg:col-span-7">
                <AnimatePresence mode="wait">
                  {!showResults && !isGenerating && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200"
                    >
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <Search className="w-10 h-10 text-gray-300" />
                      </div>
                      <h3 className="text-xl font-bold text-[#111111] mb-2">Ready to Optimize</h3>
                      <p className="text-gray-500 max-w-md">
                        Enter your basic product details on the left and let our AI generate high-converting, SEO-optimized listing content.
                      </p>
                    </motion.div>
                  )}

                  {isGenerating && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl shadow-sm"
                    >
                      <Loader2 className="w-12 h-12 text-[#8A6CFF] animate-spin mb-6" />
                      <h3 className="text-xl font-bold text-[#111111] mb-2">Analyzing Market Data...</h3>
                      <p className="text-gray-500">Finding the best keywords and optimizing your content.</p>
                    </motion.div>
                  )}

                  {showResults && results && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* Scores Card */}
                      <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-white">
                        <CardContent className="p-6 grid grid-cols-3 gap-4 divide-x divide-gray-100">
                          <div className="text-center px-2">
                            <h3 className="text-sm font-bold text-gray-500 mb-2">SEO Score</h3>
                            <div className="flex items-center justify-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${getScoreColor(results.seoScore)}`}></div>
                              <span className="text-2xl font-extrabold text-[#111111]">{results.seoScore}</span>
                            </div>
                          </div>
                          <div className="text-center px-2">
                            <h3 className="text-sm font-bold text-gray-500 mb-2">Clarity</h3>
                            <div className="flex items-center justify-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${getScoreColor(results.clarityScore)}`}></div>
                              <span className="text-2xl font-extrabold text-[#111111]">{results.clarityScore}</span>
                            </div>
                          </div>
                          <div className="text-center px-2">
                            <h3 className="text-sm font-bold text-gray-500 mb-2">Conversion</h3>
                            <div className="flex items-center justify-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${getScoreColor(results.conversionScore)}`}></div>
                              <span className="text-2xl font-extrabold text-[#111111]">{results.conversionScore}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Optimized Title */}
                      <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-white">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4 flex flex-row items-center justify-between">
                          <CardTitle className="text-lg font-extrabold text-[#111111]">Optimized Title</CardTitle>
                          <span className="text-xs font-bold text-gray-400">{results.etsyTitle.length}/140 chars</span>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="p-4 bg-[#F4F4F6] rounded-xl border border-gray-200 text-[#111111] font-medium leading-relaxed mb-4">
                            {results.etsyTitle}
                          </div>
                          <Button variant="outline" size="sm" onClick={() => handleCopy(results.etsyTitle, 'Title')} className="rounded-lg font-bold">
                            <Copy className="w-4 h-4 mr-2" /> Copy Title
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Description */}
                      <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-white">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4 flex flex-row items-center justify-between">
                          <CardTitle className="text-lg font-extrabold text-[#111111]">Description</CardTitle>
                          <Button variant="ghost" size="sm" onClick={() => handleCopy(results.description, 'Description')} className="text-[#8A6CFF] hover:bg-[#8A6CFF]/10 font-bold">
                            <Copy className="w-4 h-4 mr-2" /> Copy
                          </Button>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="p-4 bg-[#F4F4F6] rounded-xl border border-gray-200 text-[#111111] text-sm whitespace-pre-wrap max-h-64 overflow-y-auto custom-scrollbar">
                            {results.description}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Tags */}
                      <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-white">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4 flex flex-row items-center justify-between">
                          <CardTitle className="text-lg font-extrabold text-[#111111]">Suggested Tags ({results.tags.length})</CardTitle>
                          <Button variant="ghost" size="sm" onClick={() => handleCopy(results.tags.join(', '), 'Tags')} className="text-[#8A6CFF] hover:bg-[#8A6CFF]/10 font-bold">
                            <Copy className="w-4 h-4 mr-2" /> Copy All
                          </Button>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="flex flex-wrap gap-2">
                            {results.tags.map((tag, i) => (
                              <Badge key={i} className="bg-[#111111] hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Action Buttons */}
                      <div className="flex gap-4">
                        <Button 
                          onClick={handleSaveDraft}
                          disabled={isSaving}
                          className="flex-1 h-14 rounded-xl bg-[#111111] hover:bg-gray-800 text-white font-bold text-lg"
                        >
                          {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                          Save to Listings
                        </Button>
                        <Button 
                          variant="outline"
                          className="flex-1 h-14 rounded-xl border-2 border-gray-200 text-[#111111] hover:bg-gray-50 font-bold text-lg"
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Export as TXT
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default ListingOptimizerPage;
