
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import SavedIdeasModal from '@/components/SavedIdeasModal.jsx';
import AILoadingState from '@/components/AILoadingState.jsx';
import IdeaCard from '@/components/IdeaCard.jsx';
import apiServerClient from '@/lib/apiServerClient';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Sparkles, Filter, Search, AlertCircle, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const IdeaLabPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    niche: '',
    audience: '',
    productType: 'planner',
    tone: 'professional',
    seasonality: 'evergreen'
  });
  
  const [ideas, setIdeas] = useState([]);
  const [filteredIdeas, setFilteredIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savingId, setSavingId] = useState(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null); // Clear error when user changes inputs
  };

  const handleGenerate = async (e) => {
    e?.preventDefault();
    
    // Validation
    if (!formData.niche || !formData.audience || !formData.productType) {
      toast({ 
        title: "Missing required fields", 
        description: "Please fill in the niche, target audience, and product type to generate ideas.", 
        variant: "destructive" 
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setIdeas([]);
    setFilteredIdeas([]);

    try {
      console.log("Sending API request payload:", formData);
      
      const response = await apiServerClient.fetch('/ai/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok || data.status === 'error' || data.error) {
        console.error("API Error Response:", data);
        const errorMsg = data.error?.message || data.error || data.message || 'Unknown error occurred during generation';
        throw new Error(errorMsg);
      }

      const generatedIdeas = Array.isArray(data.ideas) ? data.ideas : (Array.isArray(data) ? data : []);
      
      if (generatedIdeas.length === 0) {
        throw new Error('No ideas were generated. Please try different keywords or a broader niche.');
      }

      // Map 1-5 scores to 0-100 for the IdeaCard component
      const mappedIdeas = generatedIdeas.map(idea => ({
        ...idea,
        demandScore: (idea.demandScore || 4) * 20,
        competitionScore: (idea.competitionScore || 3) * 20,
        profitabilityScore: (idea.profitabilityScore || 4) * 20,
      }));

      setIdeas(mappedIdeas);
      setFilteredIdeas(mappedIdeas);
      
      toast({
        title: "Ideas generated successfully! 🎉",
        description: `Created ${mappedIdeas.length} unique product concepts.`,
        className: "bg-[#111111] text-white border-[#D6FF3F]"
      });

    } catch (err) {
      console.error("Generation error caught:", err);
      const errorMessage = err?.message || 'Failed to generate ideas. Please try again.';
      setError(errorMessage);
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchAndSort = (query, sort) => {
    let result = [...ideas];
    
    if (query) {
      const lowerQ = query.toLowerCase();
      result = result.filter(idea => 
        idea.title?.toLowerCase().includes(lowerQ) || 
        idea.description?.toLowerCase().includes(lowerQ)
      );
    }

    if (sort === 'demand') {
      result.sort((a, b) => (b.demandScore || 0) - (a.demandScore || 0));
    } else if (sort === 'profitability') {
      result.sort((a, b) => (b.profitabilityScore || 0) - (a.profitabilityScore || 0));
    }

    setFilteredIdeas(result);
  };

  const handleSaveIdea = async (idea) => {
    if (!currentUser) {
      toast({ title: "Login required", description: "Please log in to save ideas.", variant: "destructive" });
      return;
    }

    setSavingId(idea.title);
    toast({ title: "Saving to your library...", className: "bg-[#111111] text-white border-[#8A6CFF]" });

    try {
      await pb.collection('saved_ideas').create({
        title: idea.title,
        description: idea.description,
        niche: formData.niche,
        audience: formData.audience,
        price: 9.99,
        difficulty: 'Medium',
        market_demand: Math.ceil((idea.demandScore || 80) / 20),
        user_id: currentUser.id
      }, { $autoCancel: false });
      
      toast({
        title: "Idea saved to library! 📚",
        description: `"${idea.title}" has been added to your favorites.`,
        className: "bg-[#111111] text-white border-[#D6FF3F]"
      });
      if (isModalOpen) setIsModalOpen(false);
    } catch (error) {
      toast({
        title: "Error saving idea",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSavingId(null);
    }
  };

  const handleGenerateProduct = (idea) => {
    navigate('/dashboard/product-generator', { 
      state: { 
        prefill: {
          name: idea.title,
          description: idea.description,
          niche: formData.niche || 'Planner',
          audience: formData.audience
        }
      } 
    });
  };

  return (
    <>
      <Helmet>
        <title>Idea Lab - EtsyForge AI</title>
        <meta name="description" content="Generate AI-powered product ideas for your Etsy store" />
      </Helmet>

      <DashboardLayout>
        <div className="p-6 lg:p-10 bg-[#F4F4F6] min-h-screen">
          <div className="max-w-7xl mx-auto space-y-8">
            
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111111] p-8 rounded-3xl text-white shadow-xl"
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-[#8A6CFF]/20 flex items-center justify-center border border-[#8A6CFF]/30">
                  <Lightbulb className="w-8 h-8 text-[#D6FF3F]" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight">Idea Lab</h1>
                  <p className="text-gray-400 font-medium mt-1">AI-powered product idea generation</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-white">
                <CardContent className="p-8">
                  <form onSubmit={handleGenerate} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-[#111111] font-bold">Niche / Topic *</Label>
                        <Input 
                          placeholder="e.g. ADHD Organization, Wedding Planning..." 
                          className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:ring-[#8A6CFF]"
                          value={formData.niche}
                          onChange={(e) => handleInputChange('niche', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[#111111] font-bold">Target Audience *</Label>
                        <Input 
                          placeholder="e.g. College Students, New Moms..." 
                          className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:ring-[#8A6CFF]"
                          value={formData.audience}
                          onChange={(e) => handleInputChange('audience', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <Label className="text-[#111111] font-bold">Product Type *</Label>
                        <Select value={formData.productType} onValueChange={(v) => handleInputChange('productType', v)}>
                          <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:ring-[#8A6CFF]">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="planner">Digital Planner</SelectItem>
                            <SelectItem value="workbook">Workbook</SelectItem>
                            <SelectItem value="ebook">eBook / Guide</SelectItem>
                            <SelectItem value="checklist">Checklist / Tracker</SelectItem>
                            <SelectItem value="template">Template</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[#111111] font-bold">Tone & Style</Label>
                        <Select value={formData.tone} onValueChange={(v) => handleInputChange('tone', v)}>
                          <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:ring-[#8A6CFF]">
                            <SelectValue placeholder="Select tone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">Professional & Clean</SelectItem>
                            <SelectItem value="playful">Playful & Fun</SelectItem>
                            <SelectItem value="minimalist">Minimalist & Aesthetic</SelectItem>
                            <SelectItem value="premium">Premium & Elegant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[#111111] font-bold">Seasonality</Label>
                        <Select value={formData.seasonality} onValueChange={(v) => handleInputChange('seasonality', v)}>
                          <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:ring-[#8A6CFF]">
                            <SelectValue placeholder="Select seasonality" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="evergreen">Evergreen (Year-round)</SelectItem>
                            <SelectItem value="seasonal">Seasonal / Holiday</SelectItem>
                            <SelectItem value="trending">Currently Trending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="h-14 rounded-xl bg-gradient-to-r from-[#8A6CFF] to-[#7a5ce6] hover:from-[#7a5ce6] hover:to-[#694bd4] text-white font-extrabold text-lg w-full shadow-lg shadow-[#8A6CFF]/30 transition-all"
                    >
                      <Sparkles className="w-6 h-6 mr-2 text-[#D6FF3F]" />
                      Generate Ideas with AI
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {isLoading ? (
              <AILoadingState message="Generating 20 unique product ideas..." estimatedTime={12} />
            ) : error ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border-2 border-red-200 rounded-3xl p-10 text-center shadow-sm"
              >
                <AlertCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-extrabold text-red-700 mb-3">Generation Failed</h3>
                <p className="text-red-600 mb-8 max-w-lg mx-auto font-medium text-lg">{error}</p>
                <div className="flex justify-center gap-4">
                  <Button 
                    onClick={() => { setError(null); handleGenerate(); }} 
                    className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold h-12 px-8"
                  >
                    <RefreshCcw className="w-5 h-5 mr-2" /> Try Again
                  </Button>
                </div>
              </motion.div>
            ) : ideas.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm">
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                      placeholder="Search ideas..." 
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        handleSearchAndSort(e.target.value, sortBy);
                      }}
                      className="pl-9 h-10 rounded-lg border-gray-200 bg-gray-50"
                    />
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Filter className="w-4 h-4 text-gray-400 hidden sm:block" />
                    <Select 
                      value={sortBy} 
                      onValueChange={(v) => {
                        setSortBy(v);
                        handleSearchAndSort(searchQuery, v);
                      }}
                    >
                      <SelectTrigger className="w-full sm:w-[180px] h-10 rounded-lg border-gray-200 font-medium">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Sort by Relevance</SelectItem>
                        <SelectItem value="demand">Highest Demand</SelectItem>
                        <SelectItem value="profitability">Highest Profitability</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {filteredIdeas.map((idea, index) => (
                      <motion.div
                        key={idea.title + index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <IdeaCard 
                          idea={idea}
                          onGenerate={handleGenerateProduct}
                          onSave={handleSaveIdea}
                          onViewDetails={(i) => { setSelectedIdea(i); setIsModalOpen(true); }}
                          isSaving={savingId === idea.title}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                
                {filteredIdeas.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-[#111111]">No ideas match your search</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your search terms.</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-white border border-dashed border-gray-200 rounded-3xl p-12 text-center shadow-sm"
              >
                <div className="w-24 h-24 bg-[#8A6CFF]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-12 h-12 text-[#8A6CFF]" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#111111] mb-3">Generate your first set of ideas</h3>
                <p className="text-gray-500 max-w-lg mx-auto mb-8 text-lg">
                  Fill out the form above with your niche and target audience, and our AI will generate 20 highly profitable product concepts tailored for Etsy.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Example Prompt</p>
                    <p className="text-sm font-medium text-[#111111]">"ADHD Organization for College Students"</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Example Prompt</p>
                    <p className="text-sm font-medium text-[#111111]">"Minimalist Wedding Planning for Brides"</p>
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </DashboardLayout>

      <SavedIdeasModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        idea={selectedIdea}
        onSave={handleSaveIdea}
        isSaving={savingId === selectedIdea?.title}
      />
    </>
  );
};

export default IdeaLabPage;
