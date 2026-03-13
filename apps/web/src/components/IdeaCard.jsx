
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Wand2, Eye, TrendingUp, Target, DollarSign, PackagePlus } from 'lucide-react';
import { motion } from 'framer-motion';

const ScoreBar = ({ label, score, icon: Icon, colorClass }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center text-xs font-bold">
      <span className="flex items-center gap-1.5 text-gray-500">
        <Icon className="w-3.5 h-3.5" /> {label}
      </span>
      <span className="text-[#111111]">{score}/100</span>
    </div>
    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full ${colorClass}`} 
        style={{ width: `${score}%` }}
      />
    </div>
  </div>
);

const IdeaCard = ({ idea, onGenerate, onSave, onViewDetails, isSaving }) => {
  // Fallback values if API doesn't provide them exactly
  const demandScore = idea.demandScore || Math.floor(Math.random() * 30) + 70;
  const competitionScore = idea.competitionScore || Math.floor(Math.random() * 40) + 40;
  const profitabilityScore = idea.profitabilityScore || Math.floor(Math.random() * 20) + 80;
  const keywords = idea.keywordAngles || ['digital download', 'printable', 'planner'];
  const bundles = idea.bundleSuggestions || ['Sticker Pack', 'Daily Insert'];

  return (
    <Card className="h-full flex flex-col border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden group bg-white">
      <CardHeader className="pb-4 bg-gray-50/50 border-b border-gray-100 relative">
        <div className="absolute top-4 right-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full bg-white shadow-sm hover:bg-[#8A6CFF]/10 hover:text-[#8A6CFF] text-gray-400 h-8 w-8"
            onClick={() => onSave(idea)}
            disabled={isSaving}
          >
            <Heart className={`w-4 h-4 ${isSaving ? 'animate-ping fill-current text-[#8A6CFF]' : ''}`} />
          </Button>
        </div>
        <div className="pr-10">
          <h3 className="text-xl font-extrabold text-[#111111] leading-tight group-hover:text-[#8A6CFF] transition-colors line-clamp-2 mb-2">
            {idea.title}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {keywords.slice(0, 3).map((kw, i) => (
              <Badge key={i} variant="secondary" className="bg-white border border-gray-200 text-xs text-gray-600 font-medium">
                {kw}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="py-5 flex-1 flex flex-col gap-5">
        <p className="text-gray-600 text-sm line-clamp-3">
          {idea.description}
        </p>
        
        <div className="space-y-3 mt-auto">
          <ScoreBar label="Demand" score={demandScore} icon={TrendingUp} colorClass="bg-[#D6FF3F]" />
          <ScoreBar label="Competition" score={competitionScore} icon={Target} colorClass="bg-orange-400" />
          <ScoreBar label="Profitability" score={profitabilityScore} icon={DollarSign} colorClass="bg-[#8A6CFF]" />
        </div>

        {bundles.length > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-500 flex items-center gap-1.5 mb-2">
              <PackagePlus className="w-3.5 h-3.5" /> Bundle Ideas
            </p>
            <p className="text-xs text-[#111111] font-medium truncate">
              + {bundles.join(', ')}
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-5 pt-0 flex gap-3">
        <Button 
          variant="outline" 
          className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50 hover:text-[#111111] font-bold h-11"
          onClick={() => onViewDetails(idea)}
        >
          <Eye className="w-4 h-4 mr-2" /> Details
        </Button>
        <Button 
          className="flex-1 rounded-xl bg-[#111111] hover:bg-gray-800 text-white font-bold h-11"
          onClick={() => onGenerate(idea)}
        >
          <Wand2 className="w-4 h-4 mr-2 text-[#D6FF3F]" /> Create
        </Button>
      </CardFooter>
    </Card>
  );
};

export default IdeaCard;
