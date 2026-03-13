
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import pb from '@/lib/pocketbaseClient';
import MagicPromptBar from '@/components/MagicPromptBar.jsx';
import {
  LayoutDashboard,
  Lightbulb,
  Wand2,
  Palette,
  TrendingUp,
  Package,
  FolderOpen,
  Download,
  CreditCard,
  Settings,
  Menu,
  X,
  LogOut,
  Archive,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Lightbulb, label: 'Idea Lab', path: '/dashboard/idea-lab' },
    { icon: Wand2, label: 'AI Product Generator', path: '/ai-product-generator' },
    { icon: TrendingUp, label: 'AI Listing Optimizer', path: '/ai-listing-optimizer' },
    { icon: Archive, label: 'Saved Products', path: '/saved-products' },
    { icon: Palette, label: 'Design Studio', path: '/dashboard/design-studio' },
    { icon: Package, label: 'Brand Kit', path: '/dashboard/brand-kit' },
    { icon: FolderOpen, label: 'Asset Library', path: '/dashboard/asset-library' },
    { icon: Download, label: 'Exports', path: '/dashboard/exports' },
    { icon: CreditCard, label: 'Pricing', path: '/dashboard/pricing' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getUserInitials = () => {
    if (currentUser?.name) {
      return currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return currentUser?.email?.[0]?.toUpperCase() || 'U';
  };

  const getUserAvatar = () => {
    if (currentUser?.avatar) {
      return pb.files.getUrl(currentUser, currentUser.avatar);
    }
    return null;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#111111] text-white">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link to="/" className="flex items-center group">
          <img 
            src="https://horizons-cdn.hostinger.com/2bafa71c-7ec8-449c-9d85-187e8155ba79/d17d85d9e8a2b816f5a3a7ec9570866a.png" 
            alt="Logo" 
            className="h-8 w-auto group-hover:scale-105 transition-transform duration-300 brightness-0 invert"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path === '/saved-products' && location.pathname.startsWith('/saved-products'));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group ${
                isActive
                  ? 'text-white font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-[#8A6CFF] rounded-xl z-0"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className={`w-5 h-5 z-10 relative ${isActive ? 'text-white' : 'group-hover:text-[#D6FF3F] transition-colors'}`} />
              <span className="text-sm z-10 relative">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
          <Avatar className="w-10 h-10 border border-white/20">
            <AvatarImage src={getUserAvatar()} alt={currentUser?.name || 'User'} />
            <AvatarFallback className="bg-[#8A6CFF] text-white font-bold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {currentUser?.name || 'User'}
            </p>
            <p className="text-xs text-white/50 truncate">
              {currentUser?.email}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-white/50 hover:text-white hover:bg-white/10 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-16 border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="flex items-center">
          <img 
            src="https://horizons-cdn.hostinger.com/2bafa71c-7ec8-449c-9d85-187e8155ba79/d17d85d9e8a2b816f5a3a7ec9570866a.png" 
            alt="Logo" 
            className="h-8 w-auto"
          />
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-foreground hover:text-primary transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-72 z-30 shadow-2xl">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 z-50 shadow-2xl"
            >
              <div className="absolute top-4 right-4 z-50">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-white/70 hover:text-white bg-black/20 rounded-full backdrop-blur-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 min-h-screen pt-16 lg:pt-0 relative">
        <MagicPromptBar />
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
