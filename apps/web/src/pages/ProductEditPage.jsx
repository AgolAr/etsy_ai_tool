
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import apiServerClient from '@/lib/apiServerClient';

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    niche: '',
    audience: '',
    productType: '',
    tone: ''
  });
  
  // JSON string states for complex objects
  const [outlineStr, setOutlineStr] = useState('');
  const [contentStr, setContentStr] = useState('');
  const [listingStr, setListingStr] = useState('');

  const fetchProduct = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiServerClient.fetch(`/products/${id}`);
      if (!response.ok) throw new Error('Product not found');
      const data = await response.json();
      
      setFormData({
        name: data.name || '',
        category: data.category || '',
        niche: data.niche || '',
        audience: data.audience || '',
        productType: data.productType || '',
        tone: data.tone || ''
      });
      
      setOutlineStr(data.outline ? JSON.stringify(data.outline, null, 2) : '');
      setContentStr(data.content ? JSON.stringify(data.content, null, 2) : '');
      setListingStr(data.listing ? JSON.stringify(data.listing, null, 2) : '');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Validate JSON fields
      let parsedOutline, parsedContent, parsedListing;
      try {
        parsedOutline = outlineStr ? JSON.parse(outlineStr) : null;
        parsedContent = contentStr ? JSON.parse(contentStr) : null;
        parsedListing = listingStr ? JSON.parse(listingStr) : null;
      } catch (e) {
        throw new Error('Invalid JSON format in one of the data fields. Please check your syntax.');
      }

      const payload = {
        ...formData,
        outline: parsedOutline,
        content: parsedContent,
        listing: parsedListing
      };

      const response = await apiServerClient.fetch(`/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to update product');
      }

      toast({ title: "Product updated successfully! 🎉" });
      navigate(`/saved-products/${id}`);
      
    } catch (err) {
      toast({ title: "Error saving product", description: err.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-[#8A6CFF] animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading product data...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center max-w-md mx-auto mt-20 bg-white rounded-3xl shadow-sm border border-gray-100">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#111111] mb-2">Error Loading Product</h2>
          <p className="text-gray-500 mb-8">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link to="/saved-products">Back</Link>
            </Button>
            <Button onClick={fetchProduct} className="bg-[#8A6CFF] hover:bg-[#7a5ce6] text-white">
              Retry
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit {formData.name} - EtsyForge AI</title>
      </Helmet>

      <DashboardLayout>
        <div className="p-6 lg:p-10 bg-[#F4F4F6] min-h-screen">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
              <Button variant="ghost" asChild className="text-gray-500 hover:text-[#111111] -ml-4">
                <Link to={`/saved-products/${id}`}><ArrowLeft className="w-5 h-5 mr-2" /> Cancel</Link>
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-[#D6FF3F] hover:bg-[#c4f02e] text-[#111111] font-bold rounded-xl px-6 shadow-md"
              >
                {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
              </Button>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-[#111111]">Edit Product</h1>
              <p className="text-gray-500 font-medium mt-1">Update basic details and raw JSON data</p>
            </div>

            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardContent className="p-8 space-y-8">
                
                {/* Basic Info Section */}
                <div>
                  <h3 className="text-xl font-bold text-[#111111] mb-6 border-b pb-2">Basic Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold">Product Name</Label>
                      <Input name="name" value={formData.name} onChange={handleInputChange} className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Category</Label>
                      <Input name="category" value={formData.category} onChange={handleInputChange} className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Niche</Label>
                      <Input name="niche" value={formData.niche} onChange={handleInputChange} className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Target Audience</Label>
                      <Input name="audience" value={formData.audience} onChange={handleInputChange} className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Product Type</Label>
                      <Input name="productType" value={formData.productType} onChange={handleInputChange} className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Tone</Label>
                      <Input name="tone" value={formData.tone} onChange={handleInputChange} className="h-12" />
                    </div>
                  </div>
                </div>

                {/* Advanced Data Section */}
                <div className="pt-4">
                  <h3 className="text-xl font-bold text-[#111111] mb-2 border-b pb-2">Advanced Data (JSON)</h3>
                  <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg mb-6 border border-amber-100">
                    <strong>Warning:</strong> Editing these fields requires valid JSON syntax. Invalid JSON will prevent saving.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="font-bold">Listing Data</Label>
                      <Textarea 
                        value={listingStr} 
                        onChange={(e) => setListingStr(e.target.value)} 
                        className="font-mono text-xs min-h-[200px] bg-gray-50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="font-bold">Outline Data</Label>
                      <Textarea 
                        value={outlineStr} 
                        onChange={(e) => setOutlineStr(e.target.value)} 
                        className="font-mono text-xs min-h-[200px] bg-gray-50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="font-bold">Content Data</Label>
                      <Textarea 
                        value={contentStr} 
                        onChange={(e) => setContentStr(e.target.value)} 
                        className="font-mono text-xs min-h-[300px] bg-gray-50"
                      />
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>

          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default ProductEditPage;
