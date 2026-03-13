
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit, Trash2, Share2, Copy, CheckCircle2, 
  LayoutList, AlignLeft, Tag, Loader2, Package
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import apiServerClient from '@/lib/apiServerClient';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await apiServerClient.fetch(`/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await apiServerClient.fetch(`/products/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete product');
      
      toast({ title: "Product deleted successfully" });
      navigate('/saved-products');
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleCopyData = () => {
    if (!product) return;
    const textToCopy = `Product: ${product.name}\nCategory: ${product.category}\nNiche: ${product.niche}\n\nDescription:\n${product.listing?.description || 'N/A'}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-[#8A6CFF] animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading product details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !product) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center max-w-md mx-auto mt-20 bg-white rounded-3xl shadow-sm border border-gray-100">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#111111] mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-8">{error || "The product you're looking for doesn't exist or has been deleted."}</p>
          <Button asChild className="bg-[#8A6CFF] hover:bg-[#7a5ce6] text-white rounded-xl">
            <Link to="/saved-products"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Saved Products</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.name} - Product Details</title>
      </Helmet>

      <DashboardLayout>
        <div className="p-6 lg:p-10 bg-[#F4F4F6] min-h-screen">
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
              <Button variant="ghost" asChild className="text-gray-500 hover:text-[#111111] -ml-4">
                <Link to="/saved-products"><ArrowLeft className="w-5 h-5 mr-2" /> Back</Link>
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleCopyData} className="rounded-xl bg-white">
                  {copied ? <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? 'Copied!' : 'Copy Info'}
                </Button>
                <Button variant="outline" asChild className="rounded-xl bg-white text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200">
                  <Link to={`/saved-products/${product.id}/edit`}><Edit className="w-4 h-4 mr-2" /> Edit</Link>
                </Button>
                <Button variant="outline" onClick={handleDelete} className="rounded-xl bg-white text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
              </div>
            </div>

            {/* Header Card */}
            <div className="bg-[#111111] text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#8A6CFF] rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3"></div>
              <div className="relative z-10">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-[#D6FF3F] text-[#111111] hover:bg-[#c4f02e] font-bold">{product.category}</Badge>
                  <Badge variant="outline" className="border-white/20 text-white/80">{product.productType || 'Digital Product'}</Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold mb-4">{product.name}</h1>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
                  <p><strong className="text-white">Niche:</strong> {product.niche}</p>
                  <p><strong className="text-white">Audience:</strong> {product.audience}</p>
                  <p><strong className="text-white">Tone:</strong> {product.tone || 'Professional'}</p>
                  <p><strong className="text-white">Created:</strong> {new Date(product.created).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="listing" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-14 rounded-2xl bg-white p-1 shadow-sm mb-6">
                <TabsTrigger value="listing" className="rounded-xl font-bold data-[state=active]:bg-[#8A6CFF] data-[state=active]:text-white">
                  <Tag className="w-4 h-4 mr-2" /> Listing Copy
                </TabsTrigger>
                <TabsTrigger value="outline" className="rounded-xl font-bold data-[state=active]:bg-[#8A6CFF] data-[state=active]:text-white">
                  <LayoutList className="w-4 h-4 mr-2" /> Outline
                </TabsTrigger>
                <TabsTrigger value="content" className="rounded-xl font-bold data-[state=active]:bg-[#8A6CFF] data-[state=active]:text-white">
                  <AlignLeft className="w-4 h-4 mr-2" /> Content
                </TabsTrigger>
              </TabsList>

              {/* Listing Tab */}
              <TabsContent value="listing" className="space-y-6 outline-none">
                {product.listing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <Card className="border-none shadow-sm rounded-2xl bg-green-50">
                        <CardContent className="p-4 text-center">
                          <p className="text-xs font-bold text-green-600 uppercase">SEO Score</p>
                          <p className="text-3xl font-extrabold text-green-700">{product.listing.seoScore || '-'}</p>
                        </CardContent>
                      </Card>
                      <Card className="border-none shadow-sm rounded-2xl bg-blue-50">
                        <CardContent className="p-4 text-center">
                          <p className="text-xs font-bold text-blue-600 uppercase">Clarity</p>
                          <p className="text-3xl font-extrabold text-blue-700">{product.listing.clarityScore || '-'}</p>
                        </CardContent>
                      </Card>
                      <Card className="border-none shadow-sm rounded-2xl bg-purple-50">
                        <CardContent className="p-4 text-center">
                          <p className="text-xs font-bold text-purple-600 uppercase">Conversion</p>
                          <p className="text-3xl font-extrabold text-purple-700">{product.listing.conversionScore || '-'}</p>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                      <CardContent className="p-8 space-y-6">
                        <div>
                          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Etsy Title</h3>
                          <p className="text-lg font-semibold text-[#111111]">{product.listing.etsyTitle}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Description</h3>
                          <div className="bg-gray-50 p-6 rounded-2xl whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                            {product.listing.description}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Tags</h3>
                          <div className="flex flex-wrap gap-2">
                            {product.listing.tags?.map((tag, i) => (
                              <Badge key={i} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">{tag}</Badge>
                            ))}
                          </div>
                        </div>

                        {product.listing.faq && product.listing.faq.length > 0 && (
                          <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">FAQ</h3>
                            <div className="space-y-4">
                              {product.listing.faq.map((item, i) => (
                                <div key={i} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                                  <p className="font-bold text-[#111111] mb-1">Q: {item.question}</p>
                                  <p className="text-gray-600 text-sm">A: {item.answer}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-3xl text-center text-gray-500">No listing data available.</div>
                )}
              </TabsContent>

              {/* Outline Tab */}
              <TabsContent value="outline" className="outline-none">
                {product.outline ? (
                  <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                    <CardContent className="p-8 space-y-8">
                      <div className="border-b pb-6">
                        <h2 className="text-2xl font-bold text-[#111111] mb-2">{product.outline.title}</h2>
                        <p className="text-lg text-gray-500">{product.outline.subtitle}</p>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center"><LayoutList className="w-5 h-5 mr-2 text-[#8A6CFF]" /> Chapters</h3>
                        <div className="space-y-4">
                          {product.outline.chapters?.map((chapter, i) => (
                            <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                              <div className="w-8 h-8 rounded-full bg-[#8A6CFF] text-white flex items-center justify-center font-bold shrink-0">
                                {i + 1}
                              </div>
                              <div>
                                <h4 className="font-bold text-[#111111] text-lg mb-1">{chapter.name}</h4>
                                <p className="text-gray-600 text-sm">{chapter.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="bg-white p-8 rounded-3xl text-center text-gray-500">No outline data available.</div>
                )}
              </TabsContent>

              {/* Content Tab */}
              <TabsContent value="content" className="outline-none">
                {product.content ? (
                  <div className="space-y-6">
                    {product.content.sections?.map((section, i) => (
                      <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden">
                        <CardContent className="p-0">
                          <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-[#111111]">{section.title}</h3>
                            <Badge variant="outline" className="bg-white">{section.wordCount} words</Badge>
                          </div>
                          <div className="p-6 space-y-6">
                            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                              {section.content}
                            </div>
                            
                            {section.keyPoints && section.keyPoints.length > 0 && (
                              <div className="bg-blue-50 p-5 rounded-2xl">
                                <h4 className="font-bold text-blue-800 mb-3 text-sm uppercase tracking-wider">Key Points</h4>
                                <ul className="list-disc pl-5 space-y-1 text-blue-700 text-sm">
                                  {section.keyPoints.map((kp, idx) => (
                                    <li key={idx}>{kp}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-3xl text-center text-gray-500">No content data available.</div>
                )}
              </TabsContent>
            </Tabs>

          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default ProductDetailPage;
