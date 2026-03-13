
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wand2, ChevronRight, ChevronLeft, Save, CheckCircle2, 
  FileText, LayoutList, AlignLeft, Tag, Sparkles, ChevronDown, ChevronUp, Eye, Plus
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import apiServerClient from '@/lib/apiServerClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

const AIProductGeneratorPage = () => {
  console.log('AIProductGeneratorPage rendered');
  
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [openSection, setOpenSection] = useState(0);
  const [savedProductId, setSavedProductId] = useState(null);
  
  // Form States
  const [formData, setFormData] = useState({
    productName: '',
    category: 'Digital Download',
    niche: '',
    audience: '',
    productType: '',
    tone: 'Professional'
  });
  
  const [outlineData, setOutlineData] = useState(null);
  const [contentData, setContentData] = useState(null);
  const [listingData, setListingData] = useState(null);

  const steps = [
    { id: 1, title: 'Basics', icon: FileText },
    { id: 2, title: 'Outline', icon: LayoutList },
    { id: 3, title: 'Content', icon: AlignLeft },
    { id: 4, title: 'Listing', icon: Tag },
    { id: 5, title: 'Review', icon: CheckCircle2 }
  ];

  const handleInputChange = (field, value) => {
    console.log('formData updated:', field, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      productName: '',
      category: 'Digital Download',
      niche: '',
      audience: '',
      productType: '',
      tone: 'Professional'
    });
    setOutlineData(null);
    setContentData(null);
    setListingData(null);
    setSavedProductId(null);
    setCurrentStep(1);
  };

  const generateOutline = async () => {
    if (!formData.productName || !formData.niche || !formData.audience) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    
    setIsLoading(true);
    try {
      const payload = {
        productTitle: formData.productName,
        productType: formData.productType || formData.category || 'Digital Download',
        niche: formData.niche,
        audience: formData.audience,
        tone: formData.tone
      };
      console.log('Outline payload:', payload);

      const response = await apiServerClient.fetch('/ai/outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      console.log('Outline response status:', response.status);
      const rawText = await response.text();
      console.log('Outline raw response:', rawText);
      
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        throw new Error(`Failed to parse JSON: ${rawText.substring(0, 100)}...`);
      }
      
      console.log('Outline parsed data:', data);
      
      if (!response.ok || data.status === 'error') {
        const errorMessage = data.message || data.error || rawText;
        throw new Error(errorMessage);
      }
      
      const extractedOutline = data.outline || data.data;
      console.log('Outline structure:', extractedOutline);
      
      setOutlineData(extractedOutline);
      setCurrentStep(2);
      toast({ title: "Outline generated successfully! 🎉" });
    } catch (error) {
      console.error('Outline generation error:', error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const generateContent = async () => {
    setIsLoading(true);
    try {
      const payload = {
        outline: outlineData,
        audience: formData.audience,
        tone: formData.tone
      };
      console.log('Content payload:', payload);

      const response = await apiServerClient.fetch('/ai/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      console.log('Content response status:', response.status);
      const rawText = await response.text();
      console.log('Content raw response:', rawText);
      
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        throw new Error(`Failed to parse JSON: ${rawText.substring(0, 100)}...`);
      }
      
      console.log('Content parsed data:', data);
      
      if (!response.ok || data.status === 'error') {
        const errorMessage = data.message || data.error || rawText;
        throw new Error(errorMessage);
      }
      
      const extractedContent = data.content || data.data;
      console.log('Content structure:', extractedContent);
      
      setContentData(extractedContent);
      setCurrentStep(3);
      toast({ title: "Content generated successfully! 📝" });
    } catch (error) {
      console.error('Content generation error:', error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const generateListing = async () => {
    setIsLoading(true);
    try {
      const payload = {
        productName: formData.productName,
        outline: outlineData,
        content: contentData,
        audience: formData.audience
      };
      console.log('Listing payload:', payload);

      const response = await apiServerClient.fetch('/ai/listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      console.log('Listing response status:', response.status);
      const rawText = await response.text();
      console.log('Listing raw response:', rawText);
      
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        throw new Error(`Failed to parse JSON: ${rawText.substring(0, 100)}...`);
      }
      
      console.log('Listing parsed data:', data);
      
      if (!response.ok || data.status === 'error') {
        const errorMessage = data.message || data.error || rawText;
        throw new Error(errorMessage);
      }
      
      const extractedListing = data.listing || data.data;
      console.log('Listing structure:', extractedListing);
      
      setListingData(extractedListing);
      setCurrentStep(4);
      toast({ title: "Listing copy generated successfully! 🛍️" });
    } catch (error) {
      console.error('Listing generation error:', error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const saveProduct = async () => {
    if (!currentUser) {
      toast({ title: "Authentication required", description: "Please log in to save products.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: formData.productName,
        category: formData.category,
        niche: formData.niche,
        audience: formData.audience,
        productType: formData.productType,
        tone: formData.tone,
        outline: outlineData,
        content: contentData,
        listing: listingData,
        userId: currentUser.id
      };
      
      console.log('Saving product:', payload);
      
      const response = await apiServerClient.fetch('/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to save product');
      }
      
      const data = await response.json();
      console.log('Product saved:', data);
      
      setSavedProductId(data.id);
      
      toast({ 
        title: "Product Saved! 🚀", 
        description: "Your product has been successfully saved to your library.",
        className: "bg-[#111111] text-white border-[#D6FF3F]"
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({ title: "Error saving product", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // Render Functions
  const renderStep1Basics = () => {
    console.log('Rendering section:', 'Step 1 Basics');
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="font-bold">Product Name *</Label>
            <Input 
              value={formData.productName} 
              onChange={(e) => handleInputChange('productName', e.target.value)} 
              placeholder="e.g. Ultimate ADHD Planner" 
              className="h-12"
            />
          </div>
          <div className="space-y-3">
            <Label className="font-bold">Category</Label>
            <Select value={formData.category} onValueChange={(v) => handleInputChange('category', v)}>
              <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Digital Download">Digital Download</SelectItem>
                <SelectItem value="Physical Product">Physical Product</SelectItem>
                <SelectItem value="Service">Service</SelectItem>
                <SelectItem value="Template">Template</SelectItem>
                <SelectItem value="Course">Course</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label className="font-bold">Niche *</Label>
            <Input 
              value={formData.niche} 
              onChange={(e) => handleInputChange('niche', e.target.value)} 
              placeholder="e.g. Productivity, Wedding" 
              className="h-12"
            />
          </div>
          <div className="space-y-3">
            <Label className="font-bold">Target Audience *</Label>
            <Input 
              value={formData.audience} 
              onChange={(e) => handleInputChange('audience', e.target.value)} 
              placeholder="e.g. College Students, Brides" 
              className="h-12"
            />
          </div>
          <div className="space-y-3">
            <Label className="font-bold">Product Type (Optional)</Label>
            <Input 
              value={formData.productType} 
              onChange={(e) => handleInputChange('productType', e.target.value)} 
              placeholder="e.g. Notion Template, PDF" 
              className="h-12"
            />
          </div>
          <div className="space-y-3">
            <Label className="font-bold">Tone / Style</Label>
            <Select value={formData.tone} onValueChange={(v) => handleInputChange('tone', v)}>
              <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Professional">Professional</SelectItem>
                <SelectItem value="Casual">Casual</SelectItem>
                <SelectItem value="Creative">Creative</SelectItem>
                <SelectItem value="Minimalist">Minimalist</SelectItem>
                <SelectItem value="Luxury">Luxury</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <Button 
            onClick={generateOutline} 
            disabled={isLoading}
            className="h-12 px-8 bg-[#8A6CFF] hover:bg-[#7a5ce6] text-white font-bold rounded-xl"
          >
            {isLoading ? "Generating..." : "Generate Outline"} <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  };

  const renderStep2Outline = () => {
    console.log('Rendering section:', 'Step 2 Outline');
    if (!outlineData) return null;
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="font-bold">Title</Label>
            <Input 
              value={outlineData.title || ''} 
              onChange={(e) => {
                console.log('outlineData updated: title');
                setOutlineData({...outlineData, title: e.target.value});
              }} 
            />
          </div>
          <div className="space-y-2">
            <Label className="font-bold">Subtitle</Label>
            <Input 
              value={outlineData.subtitle || ''} 
              onChange={(e) => {
                console.log('outlineData updated: subtitle');
                setOutlineData({...outlineData, subtitle: e.target.value});
              }} 
            />
          </div>
        </div>

        {outlineData.chapters && outlineData.chapters.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b pb-2">Chapters / Sections</h3>
            {outlineData.chapters.map((chapter, idx) => (
              <div key={`chapter-${idx}`} className="p-4 bg-gray-50 rounded-xl space-y-3 border border-gray-100">
                <Input 
                  value={chapter.name || ''} 
                  onChange={(e) => {
                    console.log('outlineData chapter updated:', idx, 'name');
                    const newChapters = [...outlineData.chapters];
                    newChapters[idx].name = e.target.value;
                    setOutlineData({...outlineData, chapters: newChapters});
                  }}
                  className="font-semibold bg-white"
                />
                <Textarea 
                  value={chapter.description || ''} 
                  onChange={(e) => {
                    console.log('outlineData chapter updated:', idx, 'description');
                    const newChapters = [...outlineData.chapters];
                    newChapters[idx].description = e.target.value;
                    setOutlineData({...outlineData, chapters: newChapters});
                  }}
                  className="bg-white text-sm"
                  rows={2}
                />
              </div>
            ))}
          </div>
        )}

        {outlineData.pageIdeas && outlineData.pageIdeas.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b pb-2">Page Ideas</h3>
            <div className="space-y-2">
              {outlineData.pageIdeas.map((idea, idx) => (
                <div key={`idea-${idx}`} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#8A6CFF]" />
                  <span className="text-gray-700">{typeof idea === 'object' ? idea.name || idea.description || JSON.stringify(idea) : idea}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {outlineData.bonusPages && outlineData.bonusPages.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b pb-2">Bonus Pages</h3>
            <div className="space-y-2">
              {outlineData.bonusPages.map((bonus, idx) => (
                <div key={`bonus-${idx}`} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#D6FF3F]" />
                  <span className="text-gray-700">{typeof bonus === 'object' ? bonus.name || bonus.description || JSON.stringify(bonus) : bonus}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => setCurrentStep(1)} className="h-12 px-6 rounded-xl">
            <ChevronLeft className="mr-2 w-5 h-5" /> Back
          </Button>
          <Button 
            onClick={generateContent} 
            disabled={isLoading}
            className="h-12 px-8 bg-[#8A6CFF] hover:bg-[#7a5ce6] text-white font-bold rounded-xl"
          >
            {isLoading ? "Generating..." : "Generate Content"} <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  };

  const renderStep3Content = () => {
    console.log('Rendering section:', 'Step 3 Content');
    if (!contentData) return null;

    return (
      <div className="space-y-6">
        <div className="space-y-4">
          {contentData.sections && contentData.sections.map((section, idx) => (
            <div key={`section-${idx}`} className="border border-gray-200 rounded-xl overflow-hidden">
              <button 
                onClick={() => setOpenSection(openSection === idx ? -1 : idx)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
              >
                <span className="font-bold text-[#111111]">{section.title}</span>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-md border">
                    {section.wordCount} words
                  </span>
                  {openSection === idx ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>
              </button>
              
              <AnimatePresence>
                {openSection === idx && (
                  <motion.div 
                    initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-white space-y-4 border-t border-gray-100">
                      <Textarea 
                        value={section.content || ''}
                        onChange={(e) => {
                          console.log('contentData section updated:', idx);
                          const newSections = [...contentData.sections];
                          newSections[idx].content = e.target.value;
                          setContentData({...contentData, sections: newSections});
                        }}
                        className="min-h-[200px] text-sm leading-relaxed"
                      />
                      {section.keyPoints && section.keyPoints.length > 0 && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="text-sm font-bold text-blue-800 mb-2">Key Points</h4>
                          <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
                            {section.keyPoints.map((kp, i) => <li key={`kp-${idx}-${i}`}>{typeof kp === 'object' ? JSON.stringify(kp) : kp}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => setCurrentStep(2)} className="h-12 px-6 rounded-xl">
            <ChevronLeft className="mr-2 w-5 h-5" /> Back
          </Button>
          <Button 
            onClick={generateListing} 
            disabled={isLoading}
            className="h-12 px-8 bg-[#8A6CFF] hover:bg-[#7a5ce6] text-white font-bold rounded-xl"
          >
            {isLoading ? "Generating..." : "Generate Listing Copy"} <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  };

  const renderStep4Listing = () => {
    console.log('Rendering section:', 'Step 4 Listing');
    if (!listingData) return null;

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
            <p className="text-xs font-bold text-green-600 uppercase">SEO Score</p>
            <p className="text-3xl font-extrabold text-green-700">{listingData.seoScore || '-'}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
            <p className="text-xs font-bold text-blue-600 uppercase">Clarity</p>
            <p className="text-3xl font-extrabold text-blue-700">{listingData.clarityScore || '-'}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
            <p className="text-xs font-bold text-purple-600 uppercase">Conversion</p>
            <p className="text-3xl font-extrabold text-purple-700">{listingData.conversionScore || '-'}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="font-bold">Etsy Title</Label>
              <span className="text-xs text-gray-500">{(listingData.etsyTitle || '').length}/140</span>
            </div>
            <Input 
              value={listingData.etsyTitle || ''} 
              onChange={(e) => {
                console.log('listingData updated: etsyTitle');
                setListingData({...listingData, etsyTitle: e.target.value});
              }} 
              maxLength={140}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-bold">Description</Label>
            <Textarea 
              value={listingData.description || ''} 
              onChange={(e) => {
                console.log('listingData updated: description');
                setListingData({...listingData, description: e.target.value});
              }} 
              className="min-h-[250px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-bold">Tags (Comma separated)</Label>
            <Input 
              value={(listingData.tags || []).join(', ')} 
              onChange={(e) => {
                console.log('listingData updated: tags');
                setListingData({...listingData, tags: e.target.value.split(',').map(t => t.trim())});
              }} 
            />
          </div>

          {listingData.faq && listingData.faq.length > 0 && (
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-bold border-b pb-2">FAQ</h3>
              {listingData.faq.map((item, idx) => (
                <div key={`faq-${idx}`} className="space-y-2 bg-gray-50 p-4 rounded-xl">
                  <Input 
                    value={item.question || ''} 
                    onChange={(e) => {
                      console.log('listingData faq updated:', idx, 'question');
                      const newFaq = [...listingData.faq];
                      newFaq[idx].question = e.target.value;
                      setListingData({...listingData, faq: newFaq});
                    }}
                    className="font-semibold"
                  />
                  <Textarea 
                    value={item.answer || ''} 
                    onChange={(e) => {
                      console.log('listingData faq updated:', idx, 'answer');
                      const newFaq = [...listingData.faq];
                      newFaq[idx].answer = e.target.value;
                      setListingData({...listingData, faq: newFaq});
                    }}
                    rows={2}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => setCurrentStep(3)} className="h-12 px-6 rounded-xl">
            <ChevronLeft className="mr-2 w-5 h-5" /> Back
          </Button>
          <Button 
            onClick={() => setCurrentStep(5)} 
            className="h-12 px-8 bg-[#8A6CFF] hover:bg-[#7a5ce6] text-white font-bold rounded-xl"
          >
            Review & Save <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  };

  const renderStep5Review = () => {
    console.log('Rendering section:', 'Step 5 Review');
    return (
      <div className="space-y-8">
        <div className="bg-[#111111] text-white p-8 rounded-3xl shadow-xl">
          <h2 className="text-2xl font-extrabold mb-2">{formData.productName}</h2>
          <p className="text-gray-400">{formData.category} • {formData.niche} • {formData.audience}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm bg-white rounded-2xl">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <LayoutList className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-1">Outline</h3>
              <p className="text-gray-500">{outlineData?.chapters?.length || 0} Chapters/Sections</p>
              <Button variant="link" className="px-0 mt-2 text-blue-600" onClick={() => setCurrentStep(2)}>Edit Outline</Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white rounded-2xl">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                <AlignLeft className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-1">Content</h3>
              <p className="text-gray-500">
                {contentData?.sections?.reduce((acc, curr) => acc + (curr.wordCount || 0), 0) || 0} Total Words
              </p>
              <Button variant="link" className="px-0 mt-2 text-purple-600" onClick={() => setCurrentStep(3)}>Edit Content</Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white rounded-2xl">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                <Tag className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-1">Listing</h3>
              <p className="text-gray-500">{listingData?.tags?.length || 0} Tags • {listingData?.faq?.length || 0} FAQs</p>
              <Button variant="link" className="px-0 mt-2 text-green-600" onClick={() => setCurrentStep(4)}>Edit Listing</Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between pt-8 border-t">
          {!savedProductId ? (
            <>
              <Button variant="outline" onClick={() => setCurrentStep(4)} className="h-14 px-8 rounded-xl font-bold">
                <ChevronLeft className="mr-2 w-5 h-5" /> Back
              </Button>
              <Button 
                onClick={saveProduct} 
                disabled={isLoading}
                className="h-14 px-10 bg-[#D6FF3F] hover:bg-[#c4f02e] text-[#111111] font-extrabold text-lg rounded-xl shadow-lg"
              >
                {isLoading ? "Saving..." : "Save Product"} <Save className="ml-2 w-5 h-5" />
              </Button>
            </>
          ) : (
            <div className="w-full flex justify-end gap-4">
              <Button variant="outline" onClick={resetForm} className="h-14 px-8 rounded-xl font-bold">
                <Plus className="mr-2 w-5 h-5" /> Create Another
              </Button>
              <Button 
                asChild
                className="h-14 px-10 bg-[#8A6CFF] hover:bg-[#7a5ce6] text-white font-extrabold text-lg rounded-xl shadow-lg"
              >
                <Link to={`/saved-products/${savedProductId}`}>
                  View Product <Eye className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>AI Product Generator - EtsyForge AI</title>
      </Helmet>

      <DashboardLayout>
        <div className="p-6 lg:p-10 bg-[#F4F4F6] min-h-screen">
          <div className="max-w-5xl mx-auto space-y-8">
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-[#8A6CFF] flex items-center justify-center shadow-lg shadow-[#8A6CFF]/30">
                <Wand2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-[#111111]">AI Product Generator</h1>
                <p className="text-gray-500 font-medium">Create complete digital products in 5 steps</p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="bg-white p-4 rounded-2xl shadow-sm mb-8 overflow-x-auto">
              <div className="flex items-center justify-between min-w-[600px]">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;
                  
                  return (
                    <div key={step.id} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center gap-2 relative z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                          isActive ? 'bg-[#8A6CFF] text-white shadow-md' : 
                          isCompleted ? 'bg-[#D6FF3F] text-[#111111]' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                        </div>
                        <span className={`text-xs font-bold ${isActive ? 'text-[#8A6CFF]' : isCompleted ? 'text-[#111111]' : 'text-gray-400'}`}>
                          {step.title}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`flex-1 h-1 mx-4 rounded-full ${isCompleted ? 'bg-[#D6FF3F]' : 'bg-gray-100'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Main Content Area */}
            <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-white">
              <CardContent className="p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`step-container-${currentStep}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentStep === 1 && renderStep1Basics()}
                    {currentStep === 2 && renderStep2Outline()}
                    {currentStep === 3 && renderStep3Content()}
                    {currentStep === 4 && renderStep4Listing()}
                    {currentStep === 5 && renderStep5Review()}
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>

          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default AIProductGeneratorPage;
