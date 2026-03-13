
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Send, History, Trash2, Loader2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MagicPromptBar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recentPrompts, setRecentPrompts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      fetchRecentPrompts();
    }
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [currentUser]);

  const fetchRecentPrompts = async () => {
    try {
      const records = await pb.collection('prompts').getList(1, 5, {
        sort: '-created',
        $autoCancel: false
      });
      setRecentPrompts(records.items);
    } catch (error) {
      console.error('Error fetching prompts:', error);
    }
  };

  const handleClearHistory = async (e) => {
    e.stopPropagation();
    try {
      // In a real app, we might delete them or just clear local state
      // For safety, we'll just clear local state to avoid mass deletion issues
      setRecentPrompts([]);
      toast({
        title: "History cleared",
        description: "Your recent prompts have been cleared from view.",
        className: "bg-[#111111] text-white border-[#8A6CFF]"
      });
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    setShowDropdown(false);

    try {
      // Save prompt to history
      if (currentUser) {
        await pb.collection('prompts').create({
          user_id: currentUser.id,
          prompt_text: input,
          feature_type: 'magic_bar'
        }, { $autoCancel: false });
        fetchRecentPrompts();
      }

      // Simple intent parsing
      const lowerInput = input.toLowerCase();
      
      setTimeout(() => {
        setIsProcessing(false);
        setInput('');
        
        if (lowerInput.includes('create') || lowerInput.includes('generate product')) {
          toast({
            title: "Routing to Product Generator",
            description: "Setting up your workspace...",
            className: "bg-[#111111] text-white border-[#D6FF3F]"
          });
          navigate('/dashboard/product-generator');
        } else if (lowerInput.includes('idea') || lowerInput.includes('niche')) {
          toast({
            title: "Routing to Idea Lab",
            description: "Preparing AI idea generation...",
            className: "bg-[#111111] text-white border-[#D6FF3F]"
          });
          navigate('/dashboard/idea-lab');
        } else if (lowerInput.includes('optimize') || lowerInput.includes('listing') || lowerInput.includes('seo')) {
          toast({
            title: "Routing to Listing Optimizer",
            description: "Loading SEO tools...",
            className: "bg-[#111111] text-white border-[#D6FF3F]"
          });
          navigate('/dashboard/listing-optimizer');
        } else {
          // Default fallback
          toast({
            title: "AI Assistant",
            description: "I've noted your request. Let's start by generating some ideas!",
            className: "bg-[#111111] text-white border-[#8A6CFF]"
          });
          navigate('/dashboard/idea-lab');
        }
      }, 1000);

    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Error processing prompt",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="sticky top-0 z-30 bg-[#F4F4F6]/90 backdrop-blur-md pt-4 pb-4 px-6 lg:px-10 border-b border-gray-200/50 mb-6 -mx-6 lg:-mx-10">
      <div className="max-w-4xl mx-auto relative" ref={dropdownRef}>
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <div className="absolute left-4 text-[#8A6CFF]">
            <Sparkles className="w-5 h-5" />
          </div>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            placeholder="Ask AI anything... e.g., create a pastel ADHD planner"
            className="w-full h-14 pl-12 pr-32 rounded-2xl bg-white border-gray-200 shadow-sm focus:ring-2 focus:ring-[#8A6CFF] focus:border-transparent text-base font-medium text-[#111111] placeholder:text-gray-400 transition-all"
            disabled={isProcessing}
          />
          <div className="absolute right-2 flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-gray-400 hover:text-[#111111] rounded-xl h-10 w-10"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </Button>
            <Button
              type="submit"
              disabled={!input.trim() || isProcessing}
              className="bg-[#111111] hover:bg-gray-800 text-white rounded-xl h-10 px-4 font-bold transition-all"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </form>

        <AnimatePresence>
          {showDropdown && recentPrompts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
            >
              <div className="p-3 flex items-center justify-between border-b border-gray-50 bg-gray-50/50">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <History className="w-3.5 h-3.5" /> Recent Prompts
                </span>
                <button 
                  onClick={handleClearHistory}
                  className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto p-2">
                {recentPrompts.map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() => {
                      setInput(prompt.prompt_text);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-[#111111] hover:bg-[#8A6CFF]/10 hover:text-[#8A6CFF] rounded-xl transition-colors flex items-center gap-3 group"
                  >
                    <History className="w-4 h-4 text-gray-300 group-hover:text-[#8A6CFF]" />
                    <span className="truncate font-medium">{prompt.prompt_text}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MagicPromptBar;
