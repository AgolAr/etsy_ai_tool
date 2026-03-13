
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import apiServerClient from '@/lib/apiServerClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

import CurrentListingAnalysis from '@/components/CurrentListingAnalysis.jsx';
import OptimizationSuggestions from '@/components/OptimizationSuggestions.jsx';
import OptimizedListingSection from '@/components/OptimizedListingSection.jsx';

const AIListingOptimizerPage = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  
  const [formData, setFormData] = useState({
    listingText: '',
    category: 'Digital Products',
    audience: '',
    focus: {
      seo: true,
      clarity: true,
      conversion: true
    }
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFocusChange = (key, checked) => {
    setFormData(prev => ({
      ...prev,
      focus: { ...prev.focus, [key]: checked }
    }));
  };

  const handleAnalyze = async () => {
    if (!formData.listingText || formData.listingText.length < 50) {
      toast({ title: "Input too short", description: "Please provide at least 50 characters of your listing text.", variant: "destructive" });
      return;
    }
    if (!formData.audience) {
      toast({ title: "Missing audience", description: "Please specify your target audience.", variant: "destructive" });
      return;
    }

    const focusAreas = Object.entries(formData.focus)
      .filter(([_, isChecked]) => isChecked)
      .map(([key]) => key)
      .join(', ');

    if (!focusAreas) {
      toast({ title: "Select focus", description: "Please select at least one optimization focus.", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const payload = {
        listingText: formData.listingText,
        category: formData.category,
        audience: formData.audience,
        optimizationFocus: focusAreas
      };

      const response = await apiServerClient.fetch('/ai/listing-optimizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to analyze listing');
      }

      const data = await response.json();
      setAnalysisResult(data);
      toast({ title: "Analysis Complete! ✨", description: "Your listing has been optimized." });
      
      // Scroll to top of results on mobile
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({ title: "Analysis Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveOptimization = async (finalOptimizedListing) => {
    if (!currentUser) {
      toast({ title: "Authentication required", description: "Please log in to save optimizations.", variant: "destructive" });
      return;
    }

    try {
      const payload = {
        originalListing: formData.listingText,
        category: formData.category,
        audience: formData.audience,
        currentScores: analysisResult.currentScores,
        optimizedListing: finalOptimizedListing,
        newScores: analysisResult.newScores,
        improvements: analysisResult.improvements
      };

      const response = await apiServerClient.fetch('/ai/optimized-listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to save optimization');
      }

      toast({ 
        title: "Optimization Saved! 🚀", 
        description: "You can view it in your Saved Products area.",
        className: "bg-[#111111] text-white border-[#D6FF3F]"
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({ title: "Error saving", description: error.message, variant: "destructive" });
    }
  };

  const handleStartOver = () => {
    setAnalysisResult(null);
    setFormData({
      listingText: '',
      category: 'Digital Products',
      audience: '',
      focus: { seo: true, clarity: true, conversion: true }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>AI Listing Optimizer - EtsyForge AI</title>
      </Helmet>

      <DashboardLayout>
        <div className="p-6 lg:p-10 bg-[#F4F4F6] min-h-screen">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-[#8A6CFF] flex items-center justify-center shadow-lg shadow-[#8A6CFF]/30">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-[#111111]">AI Listing Optimizer</h1>
                <p className="text-gray-500 font-medium">Analyze and improve your Etsy listings for better ranking and conversion</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
              
              {/* Left Column: Input Form & Current Analysis */}
              <div className="lg:col-span-5 space-y-8">
                
                {/* Input Form */}
                <Card className={`border-none shadow-md rounded-3xl overflow-hidden bg-white transition-all duration-500 ${analysisResult ? 'opacity-70 hover:opacity-100' : ''}`}>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Label className="font-bold text-[#111111]">Current Listing Text *</Label>
                        <span className="text-xs text-gray-400">{formData.listingText.length}/5000</span>
                      </div>
                      <Textarea 
                        placeholder="Paste your current Etsy listing title and description here..."
                        value={formData.listingText}
                        onChange={(e) => handleInputChange('listingText', e.target.value)}
                        className="min-h-[200px] bg-gray-50 border-gray-200 focus-visible:ring-[#8A6CFF] resize-y"
                        maxLength={5000}
                        disabled={isAnalyzing}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="font-bold text-[#111111]">Category</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(v) => handleInputChange('category', v)}
                        disabled={isAnalyzing}
                      >
                        <SelectTrigger className="h-12 bg-gray-50 border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Digital Products">Digital Products</SelectItem>
                          <SelectItem value="Templates">Templates</SelectItem>
                          <SelectItem value="Printables">Printables</SelectItem>
                          <SelectItem value="Physical Goods">Physical Goods</SelectItem>
                          <SelectItem value="Apparel">Apparel</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label className="font-bold text-[#111111]">Target Audience *</Label>
                      <Input 
                        placeholder="e.g. Brides, Small Business Owners, Teachers"
                        value={formData.audience}
                        onChange={(e) => handleInputChange('audience', e.target.value)}
                        className="h-12 bg-gray-50 border-gray-200"
                        disabled={isAnalyzing}
                      />
                    </div>

                    <div className="space-y-4 pt-2">
                      <Label className="font-bold text-[#111111]">Optimization Focus</Label>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <Checkbox 
                            id="focus-seo" 
                            checked={formData.focus.seo}
                            onCheckedChange={(c) => handleFocusChange('seo', c)}
                            disabled={isAnalyzing}
                          />
                          <label htmlFor="focus-seo" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                            SEO & Keywords (Ranking)
                          </label>
                        </div>
                        <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <Checkbox 
                            id="focus-clarity" 
                            checked={formData.focus.clarity}
                            onCheckedChange={(c) => handleFocusChange('clarity', c)}
                            disabled={isAnalyzing}
                          />
                          <label htmlFor="focus-clarity" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                            Clarity & Readability
                          </label>
                        </div>
                        <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <Checkbox 
                            id="focus-conversion" 
                            checked={formData.focus.conversion}
                            onCheckedChange={(c) => handleFocusChange('conversion', c)}
                            disabled={isAnalyzing}
                          />
                          <label htmlFor="focus-conversion" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                            Conversion & Engagement
                          </label>
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !formData.listingText || !formData.audience}
                      className="w-full h-14 bg-[#8A6CFF] hover:bg-[#7a5ce6] text-white font-bold rounded-xl shadow-lg shadow-[#8A6CFF]/20 text-lg mt-4"
                    >
                      {isAnalyzing ? (
                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing Listing...</>
                      ) : (
                        <><Sparkles className="w-5 h-5 mr-2" /> Analyze & Optimize</>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Current Analysis Results (Left Column) */}
                <AnimatePresence>
                  {analysisResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CurrentListingAnalysis 
                        listingText={formData.listingText}
                        scores={analysisResult.currentScores}
                        issues={analysisResult.issues}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

              {/* Right Column: Suggestions & Optimized Listing */}
              <div className="lg:col-span-7">
                {isAnalyzing ? (
                  <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
                    <div className="relative w-24 h-24 mb-8">
                      <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-[#8A6CFF] rounded-full border-t-transparent animate-spin"></div>
                      <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-[#8A6CFF] animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-[#111111] mb-2">AI is analyzing your listing...</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      We're evaluating your SEO, checking readability, and rewriting your copy to maximize conversions. This usually takes 10-15 seconds.
                    </p>
                  </div>
                ) : analysisResult ? (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-8"
                  >
                    <OptimizationSuggestions suggestions={analysisResult.suggestions} />
                    
                    <OptimizedListingSection 
                      optimizedListing={analysisResult.optimizedListing}
                      newScores={analysisResult.newScores}
                      improvements={analysisResult.improvements}
                      onSave={handleSaveOptimization}
                      onStartOver={handleStartOver}
                    />
                  </motion.div>
                ) : (
                  <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 p-10 text-center">
                    <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
                      <TrendingUp className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-400 mb-2">Ready to Optimize</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                      Paste your listing text on the left, set your target audience, and click Analyze to see AI-powered improvements.
                    </p>
                    <ArrowRight className="w-6 h-6 text-gray-300 mt-6 hidden lg:block animate-bounce-x" />
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

export default AIListingOptimizerPage;
