
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Search, Plus, PackageOpen, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import SavedProductsCard from '@/components/SavedProductsCard.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext.jsx';
import apiServerClient from '@/lib/apiServerClient';

const SavedProductsPage = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination & Filtering
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 10;

  const fetchProducts = async (currentPage = 1) => {
    if (!currentUser) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiServerClient.fetch(`/products?userId=${currentUser.id}&page=${currentPage}&limit=${limit}`);
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
      setPage(currentPage);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, [currentUser]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await apiServerClient.fetch(`/products/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete product');
      
      toast({ title: "Product deleted successfully" });
      // Refresh current page
      fetchProducts(page);
    } catch (err) {
      toast({ title: "Error deleting product", description: err.message, variant: "destructive" });
    }
  };

  // Client-side filtering
  const filteredProducts = products.filter(product => 
    product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.niche?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Saved Products - EtsyForge AI</title>
      </Helmet>

      <DashboardLayout>
        <div className="p-6 lg:p-10 bg-[#F4F4F6] min-h-screen">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-[#111111]">Saved Products</h1>
                <p className="text-gray-500 font-medium mt-1">Manage and edit your AI-generated products</p>
              </div>
              <Button asChild className="bg-[#8A6CFF] hover:bg-[#7a5ce6] text-white font-bold rounded-xl h-12 px-6 shadow-md">
                <Link to="/ai-product-generator">
                  <Plus className="w-5 h-5 mr-2" /> Create New Product
                </Link>
              </Button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400 ml-2" />
              <Input 
                placeholder="Search by product name, niche, or category..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-none shadow-none focus-visible:ring-0 text-base h-10"
              />
            </div>

            {/* Content Area */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-[#8A6CFF] animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading your products...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
                <p className="text-red-600 font-medium mb-4">{error}</p>
                <Button onClick={() => fetchProducts(page)} variant="outline" className="rounded-xl">
                  Retry
                </Button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-sm p-16 text-center flex flex-col items-center border border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <PackageOpen className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-[#111111] mb-2">No products found</h3>
                <p className="text-gray-500 max-w-md mb-8">
                  {searchQuery 
                    ? "We couldn't find any products matching your search. Try a different keyword." 
                    : "You haven't saved any products yet. Head over to the AI Product Generator to create your first one!"}
                </p>
                {!searchQuery && (
                  <Button asChild className="bg-[#D6FF3F] hover:bg-[#c4f02e] text-[#111111] font-bold rounded-xl h-12 px-8 shadow-md">
                    <Link to="/ai-product-generator">
                      Generate a Product
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map(product => (
                    <SavedProductsCard 
                      key={product.id} 
                      product={product} 
                      onDelete={handleDelete} 
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && !searchQuery && (
                  <div className="flex items-center justify-center gap-4 pt-8">
                    <Button 
                      variant="outline" 
                      onClick={() => fetchProducts(page - 1)} 
                      disabled={page === 1}
                      className="rounded-xl h-10 px-4"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                    </Button>
                    <span className="text-sm font-medium text-gray-600">
                      Page {page} of {totalPages}
                    </span>
                    <Button 
                      variant="outline" 
                      onClick={() => fetchProducts(page + 1)} 
                      disabled={page === totalPages}
                      className="rounded-xl h-10 px-4"
                    >
                      Next <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default SavedProductsPage;
