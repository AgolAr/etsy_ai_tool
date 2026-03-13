
import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import { Toaster } from '@/components/ui/toaster';

// Public Pages
import HomePage from '@/pages/HomePage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import SignupPage from '@/pages/SignupPage.jsx';

// Protected Dashboard Pages
import DashboardHome from '@/pages/DashboardHome.jsx';
import IdeaLabPage from '@/pages/IdeaLabPage.jsx';
import ProductGeneratorPage from '@/pages/ProductGeneratorPage.jsx';
import AIProductGeneratorPage from '@/pages/AIProductGeneratorPage.jsx';
import AIListingOptimizerPage from '@/pages/AIListingOptimizerPage.jsx';
import SavedProductsPage from '@/pages/SavedProductsPage.jsx';
import ProductDetailPage from '@/pages/ProductDetailPage.jsx';
import ProductEditPage from '@/pages/ProductEditPage.jsx';
import DesignStudioPage from '@/pages/DesignStudioPage.jsx';
import ListingOptimizerPage from '@/pages/ListingOptimizerPage.jsx';
import BrandKitPage from '@/pages/BrandKitPage.jsx';
import AssetLibraryPage from '@/pages/AssetLibraryPage.jsx';
import ExportsPage from '@/pages/ExportsPage.jsx';
import PricingPage from '@/pages/PricingPage.jsx';
import SettingsPage from '@/pages/SettingsPage.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/idea-lab"
            element={
              <ProtectedRoute>
                <IdeaLabPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/product-generator"
            element={
              <ProtectedRoute>
                <ProductGeneratorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-product-generator"
            element={
              <ProtectedRoute>
                <AIProductGeneratorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-listing-optimizer"
            element={
              <ProtectedRoute>
                <AIListingOptimizerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved-products"
            element={
              <ProtectedRoute>
                <SavedProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved-products/:id"
            element={
              <ProtectedRoute>
                <ProductDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved-products/:id/edit"
            element={
              <ProtectedRoute>
                <ProductEditPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/design-studio"
            element={
              <ProtectedRoute>
                <DesignStudioPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/listing-optimizer"
            element={
              <ProtectedRoute>
                <ListingOptimizerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/brand-kit"
            element={
              <ProtectedRoute>
                <BrandKitPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/asset-library"
            element={
              <ProtectedRoute>
                <AssetLibraryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/exports"
            element={
              <ProtectedRoute>
                <ExportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/pricing"
            element={
              <ProtectedRoute>
                <PricingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
