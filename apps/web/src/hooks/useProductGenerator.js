
import { useState } from 'react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

const MOCK_IDEAS = [
  { title: 'ADHD Productivity Planner', price: 12.99, difficulty: 'Medium', demand: 5, niche: 'Planners', description: 'A specialized planner designed for neurodivergent minds with visual cues and flexible layouts.' },
  { title: 'Wedding Planning Workbook', price: 14.99, difficulty: 'Hard', demand: 4, niche: 'Workbooks', description: 'Comprehensive guide covering timelines, budgets, vendor comparisons, and seating charts.' },
  { title: 'Budget Binder Printable', price: 9.99, difficulty: 'Easy', demand: 5, niche: 'Printables', description: 'Cash envelope trackers, sinking funds, and monthly budget overviews.' },
  { title: 'Kids Summer Activity Pack', price: 11.99, difficulty: 'Medium', demand: 4, niche: 'Printables', description: 'Educational games, coloring pages, and daily schedules for children.' },
  { title: 'Daily Habit Tracker', price: 7.99, difficulty: 'Easy', demand: 5, niche: 'Trackers', description: 'Minimalist 30-day and 90-day habit tracking sheets.' },
  { title: 'Meal Planning Templates', price: 8.99, difficulty: 'Easy', demand: 4, niche: 'Templates', description: 'Weekly meal grids, grocery lists, and recipe cards.' },
  { title: 'Fitness Tracker Printable', price: 6.99, difficulty: 'Easy', demand: 4, niche: 'Trackers', description: 'Workout logs, measurement trackers, and goal setting pages.' },
  { title: 'Goal Setting Workbook', price: 13.99, difficulty: 'Medium', demand: 4, niche: 'Workbooks', description: 'Quarterly planning, SMART goals breakdown, and reflection prompts.' },
  { title: 'Anxiety Relief Coloring Book', price: 10.99, difficulty: 'Medium', demand: 5, niche: 'Printables', description: 'Intricate mandala and nature designs with positive affirmations.' },
  { title: 'Debt Payoff Tracker', price: 7.99, difficulty: 'Easy', demand: 5, niche: 'Trackers', description: 'Snowball and avalanche method visual trackers.' },
  { title: 'Home Organization Binder', price: 11.99, difficulty: 'Medium', demand: 4, niche: 'Planners', description: 'Cleaning schedules, maintenance logs, and inventory sheets.' },
  { title: 'Teacher Lesson Planner', price: 9.99, difficulty: 'Medium', demand: 4, niche: 'Planners', description: 'Academic calendar, attendance records, and weekly lesson grids.' },
  { title: 'Baby Milestone Cards', price: 8.99, difficulty: 'Easy', demand: 3, niche: 'Printables', description: 'Printable cards for monthly photos and first achievements.' },
  { title: 'Gratitude Journal Printable', price: 5.99, difficulty: 'Easy', demand: 4, niche: 'Printables', description: 'Daily prompts for mindfulness and positive thinking.' },
  { title: 'Business Planner', price: 15.99, difficulty: 'Hard', demand: 4, niche: 'Planners', description: 'Marketing strategy, financial overview, and product launch plans.' },
  { title: 'Sticker Sheet Templates', price: 4.99, difficulty: 'Medium', demand: 5, niche: 'Templates', description: 'Pre-sized templates for GoodNotes and standard printing.' },
  { title: 'Vision Board Kit', price: 12.99, difficulty: 'Medium', demand: 3, niche: 'Templates', description: 'Curated quotes, images, and layout guides for digital or print.' },
  { title: 'Cleaning Schedule Printable', price: 6.99, difficulty: 'Easy', demand: 4, niche: 'Printables', description: 'Daily, weekly, and deep cleaning checklists.' },
  { title: 'Savings Challenge Tracker', price: 7.99, difficulty: 'Easy', demand: 5, niche: 'Trackers', description: '100 envelope challenge, 52-week savings, and visual jars.' },
  { title: 'Self-Care Checklist', price: 5.99, difficulty: 'Easy', demand: 4, niche: 'Trackers', description: 'Morning and evening routine builders with wellness prompts.' }
];

export const useProductGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const generateIdeas = async (niche, audience, skillLevel) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Filter mock ideas based on inputs (simplified logic for demonstration)
      let filtered = [...MOCK_IDEAS];
      if (niche && niche !== 'All') {
        filtered = filtered.filter(idea => idea.niche.toLowerCase() === niche.toLowerCase());
      }
      
      // If filtering results in too few, just return a mix to ensure we show something
      if (filtered.length < 5) {
        filtered = [...filtered, ...MOCK_IDEAS.slice(0, 20 - filtered.length)];
      }
      
      return filtered.slice(0, 20);
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const generateOutline = async (productType) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const outlines = {
        'Planner': ['Cover Page', 'Introduction & How to Use', 'Yearly Overview', 'Monthly Spreads', 'Weekly Layouts', 'Daily Pages', 'Goal Setting', 'Habit Tracking', 'Notes', 'Back Cover'],
        'Workbook': ['Cover Page', 'Welcome & Instructions', 'Module 1: Assessment', 'Module 2: Strategy', 'Interactive Exercises', 'Checklists', 'Resource Library', 'Next Steps'],
        'Tracker': ['Cover Page', 'Instructions', '30-Day Grid', '90-Day Grid', 'Yearly Pixel Chart', 'Milestone Rewards', 'Notes'],
        'Default': ['Cover Page', 'Introduction', 'Main Content Section 1', 'Main Content Section 2', 'Worksheets', 'Notes']
      };

      const typeKey = Object.keys(outlines).find(k => productType.toLowerCase().includes(k.toLowerCase())) || 'Default';
      return outlines[typeKey].map(title => ({ id: crypto.randomUUID(), title }));
    } finally {
      setLoading(false);
    }
  };

  const generateDesignSuggestions = () => {
    return {
      palettes: [
        { id: 'minimalist', name: 'Minimalist B&W', colors: ['#ffffff', '#f4f4f6', '#888888', '#111111'] },
        { id: 'pastel', name: 'Pastel Soft', colors: ['#fdfbf7', '#f4e8e1', '#e2d5de', '#a89f91'] },
        { id: 'vibrant', name: 'Bold Vibrant', colors: ['#111111', '#8a6cff', '#d6ff3f', '#ffffff'] },
        { id: 'corporate', name: 'Professional', colors: ['#ffffff', '#e2e8f0', '#3b82f6', '#0f172a'] }
      ],
      layouts: [
        { id: 'single', name: 'Single Column' },
        { id: 'two', name: 'Two Column' },
        { id: 'grid', name: 'Grid Based' }
      ],
      fonts: [
        { id: 'modern', name: 'Modern Sans (Inter)' },
        { id: 'classic', name: 'Classic Serif (Merriweather)' },
        { id: 'playful', name: 'Playful (Comic Sans)' }
      ]
    };
  };

  const saveIdea = async (ideaData) => {
    if (!currentUser) throw new Error('Must be logged in to save ideas');
    setLoading(true);
    try {
      const record = await pb.collection('saved_ideas').create({
        title: ideaData.title,
        description: ideaData.description,
        niche: ideaData.niche,
        audience: ideaData.audience || '',
        price: ideaData.price,
        difficulty: ideaData.difficulty,
        market_demand: ideaData.demand,
        user_id: currentUser.id
      }, { $autoCancel: false });
      return record;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = async (productData) => {
    if (!currentUser) throw new Error('Must be logged in to save drafts');
    setLoading(true);
    try {
      const record = await pb.collection('generated_products').create({
        name: productData.name,
        niche: productData.niche,
        audience: productData.audience,
        description: productData.description,
        outline: productData.outline,
        design_preferences: productData.design,
        status: 'draft',
        user_id: currentUser.id
      }, { $autoCancel: false });
      return record;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSavedIdeas = async () => {
    if (!currentUser) return [];
    setLoading(true);
    try {
      const records = await pb.collection('saved_ideas').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      return records;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getDrafts = async () => {
    if (!currentUser) return [];
    setLoading(true);
    try {
      const records = await pb.collection('generated_products').getFullList({
        filter: 'status="draft"',
        sort: '-created',
        $autoCancel: false
      });
      return records;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    generateIdeas,
    generateOutline,
    generateDesignSuggestions,
    saveIdea,
    saveDraft,
    getSavedIdeas,
    getDrafts
  };
};
