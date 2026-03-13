
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, DollarSign, Target, Layers, BarChart } from 'lucide-react';

const SavedIdeasModal = ({ isOpen, onClose, idea, onSave, isSaving }) => {
  if (!idea) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-[#111111] text-[#F4F4F6] border-[#8A6CFF]/20">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge className="bg-[#8A6CFF]/20 text-[#8A6CFF] hover:bg-[#8A6CFF]/30 border-none">
              {idea.niche}
            </Badge>
            <div className="flex items-center text-[#D6FF3F]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < idea.demand ? 'fill-current' : 'text-gray-600'}`} />
              ))}
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-white">{idea.title}</DialogTitle>
          <DialogDescription className="text-gray-400 text-base mt-4">
            {idea.description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-6">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#D6FF3F]/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#D6FF3F]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Est. Price</p>
              <p className="text-lg font-bold text-white">${idea.price}</p>
            </div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#8A6CFF]/10 flex items-center justify-center">
              <BarChart className="w-5 h-5 text-[#8A6CFF]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Difficulty</p>
              <p className="text-lg font-bold text-white">{idea.difficulty}</p>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3 col-span-2">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Target Audience</p>
              <p className="text-base font-medium text-white">{idea.audience || 'General Audience'}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between items-center gap-4 border-t border-white/10 pt-6">
          <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white hover:bg-white/10">
            Close
          </Button>
          <Button 
            onClick={() => onSave(idea)} 
            disabled={isSaving}
            className="bg-[#8A6CFF] hover:bg-[#7a5ce6] text-white font-semibold px-6"
          >
            <Heart className={`w-4 h-4 mr-2 ${isSaving ? 'animate-pulse' : ''}`} />
            {isSaving ? 'Saving...' : 'Save to Favorites'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SavedIdeasModal;
