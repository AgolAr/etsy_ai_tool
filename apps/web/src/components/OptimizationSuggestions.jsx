
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, ShoppingCart, ArrowRight, Zap } from 'lucide-react';

const OptimizationSuggestions = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) return null;

  // Group suggestions by type
  const groupedSuggestions = {
    seo: suggestions.filter(s => s.type?.toLowerCase().includes('seo')),
    clarity: suggestions.filter(s => s.type?.toLowerCase().includes('clarity') || s.type?.toLowerCase().includes('readability')),
    conversion: suggestions.filter(s => s.type?.toLowerCase().includes('conversion') || s.type?.toLowerCase().includes('engagement')),
  };

  // Fallback for uncategorized
  const uncategorized = suggestions.filter(s => 
    !s.type?.toLowerCase().includes('seo') && 
    !s.type?.toLowerCase().includes('clarity') && 
    !s.type?.toLowerCase().includes('readability') && 
    !s.type?.toLowerCase().includes('conversion') && 
    !s.type?.toLowerCase().includes('engagement')
  );

  if (uncategorized.length > 0) {
    groupedSuggestions.other = uncategorized;
  }

  const SuggestionCard = ({ suggestion }) => (
    <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-bold text-[#111111] text-base">{suggestion.issue}</h4>
          <Badge variant="outline" className={`
            ${suggestion.priority?.toLowerCase() === 'high' ? 'bg-red-50 text-red-700 border-red-200' : ''}
            ${suggestion.priority?.toLowerCase() === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
            ${suggestion.priority?.toLowerCase() === 'low' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
          `}>
            {suggestion.priority}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
            <div className="flex items-center gap-2 mb-1 text-blue-800 font-semibold text-sm">
              <Zap className="w-4 h-4" /> Recommendation
            </div>
            <p className="text-sm text-gray-700">{suggestion.recommendation}</p>
          </div>
          
          <div className="flex items-start gap-2 text-sm">
            <ArrowRight className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
            <p className="text-gray-600"><span className="font-semibold text-gray-900">Impact:</span> {suggestion.impact}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-extrabold text-[#111111]">Optimization Strategy</h3>
      
      <Tabs defaultValue="seo" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-14 rounded-2xl bg-white p-1 shadow-sm mb-6 border border-gray-100">
          <TabsTrigger value="seo" className="rounded-xl font-bold data-[state=active]:bg-[#8A6CFF] data-[state=active]:text-white">
            <Search className="w-4 h-4 mr-2 hidden sm:inline-block" /> SEO
          </TabsTrigger>
          <TabsTrigger value="clarity" className="rounded-xl font-bold data-[state=active]:bg-[#8A6CFF] data-[state=active]:text-white">
            <Eye className="w-4 h-4 mr-2 hidden sm:inline-block" /> Clarity
          </TabsTrigger>
          <TabsTrigger value="conversion" className="rounded-xl font-bold data-[state=active]:bg-[#8A6CFF] data-[state=active]:text-white">
            <ShoppingCart className="w-4 h-4 mr-2 hidden sm:inline-block" /> Conversion
          </TabsTrigger>
        </TabsList>

        <TabsContent value="seo" className="outline-none space-y-2">
          {groupedSuggestions.seo?.length > 0 ? (
            groupedSuggestions.seo.map((s, i) => <SuggestionCard key={i} suggestion={s} />)
          ) : (
            <p className="text-gray-500 text-center py-8 bg-white rounded-2xl border border-gray-100">No specific SEO suggestions.</p>
          )}
        </TabsContent>

        <TabsContent value="clarity" className="outline-none space-y-2">
          {groupedSuggestions.clarity?.length > 0 ? (
            groupedSuggestions.clarity.map((s, i) => <SuggestionCard key={i} suggestion={s} />)
          ) : (
            <p className="text-gray-500 text-center py-8 bg-white rounded-2xl border border-gray-100">No specific clarity suggestions.</p>
          )}
        </TabsContent>

        <TabsContent value="conversion" className="outline-none space-y-2">
          {groupedSuggestions.conversion?.length > 0 ? (
            groupedSuggestions.conversion.map((s, i) => <SuggestionCard key={i} suggestion={s} />)
          ) : (
            <p className="text-gray-500 text-center py-8 bg-white rounded-2xl border border-gray-100">No specific conversion suggestions.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OptimizationSuggestions;
