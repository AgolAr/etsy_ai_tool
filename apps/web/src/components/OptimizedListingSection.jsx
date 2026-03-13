
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Save, RotateCcw, CheckCircle2, TrendingUp, Tag, MessageCircle, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ScoreImprovement = ({ label, newScore, improvement }) => {
  const isPositive = improvement > 0;
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-[#111111]">{newScore}</span>
        {improvement !== 0 && (
          <span className={`text-sm font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{improvement}
          </span>
        )}
      </div>
    </div>
  );
};

const OptimizedListingSection = ({ optimizedListing, newScores, improvements, onSave, onStartOver }) => {
  const { toast } = useToast();
  const [editableListing, setEditableListing] = useState(optimizedListing);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditableListing(optimizedListing);
  }, [optimizedListing]);

  if (!editableListing) return null;

  const handleCopy = () => {
    const textToCopy = `
Title: ${editableListing.title || editableListing.etsyTitle}

Description:
${editableListing.description}

Tags:
${editableListing.tags?.join(', ')}

FAQ:
${editableListing.faq?.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')}

Call to Action:
${editableListing.cta}
    `.trim();

    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    toast({ title: "Copied to clipboard! 📋" });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    await onSave(editableListing);
    setIsSaving(false);
  };

  const updateField = (field, value) => {
    setEditableListing(prev => ({ ...prev, [field]: value }));
  };

  const titleValue = editableListing.title || editableListing.etsyTitle || '';

  return (
    <div className="space-y-8">
      {/* Score Improvements */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ScoreImprovement label="SEO" newScore={newScores?.seoScore || 0} improvement={improvements?.seoImprovement || 0} />
        <ScoreImprovement label="Clarity" newScore={newScores?.clarityScore || 0} improvement={improvements?.clarityImprovement || 0} />
        <ScoreImprovement label="Conversion" newScore={newScores?.conversionScore || 0} improvement={improvements?.conversionImprovement || 0} />
        <ScoreImprovement label="Engagement" newScore={newScores?.engagementScore || 0} improvement={improvements?.engagementImprovement || 0} />
      </div>

      <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#8A6CFF] to-[#D6FF3F]"></div>
        <CardHeader className="pb-4 pt-8 px-8 flex flex-row items-center justify-between border-b border-gray-50">
          <CardTitle className="text-2xl font-extrabold text-[#111111] flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-[#8A6CFF]" /> Optimized Listing
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy} className="rounded-xl bg-white">
              {isCopied ? <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
              {isCopied ? 'Copied' : 'Copy All'}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-8 space-y-8">
          {/* Title */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="font-bold text-[#111111] text-sm uppercase tracking-wider">Optimized Title</label>
              <span className={`text-xs font-bold ${titleValue.length > 140 ? 'text-red-500' : 'text-gray-400'}`}>
                {titleValue.length}/140
              </span>
            </div>
            <Input 
              value={titleValue}
              onChange={(e) => updateField(editableListing.title !== undefined ? 'title' : 'etsyTitle', e.target.value)}
              className="text-lg font-semibold h-14 bg-gray-50 border-gray-200 focus-visible:ring-[#8A6CFF]"
              maxLength={140}
            />
            
            {editableListing.alternativeTitles && editableListing.alternativeTitles.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Alternative Options:</p>
                <div className="flex flex-wrap gap-2">
                  {editableListing.alternativeTitles.map((alt, idx) => (
                    <Badge 
                      key={idx} 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-[#8A6CFF] hover:text-white transition-colors bg-gray-100 text-gray-700 py-1.5 px-3"
                      onClick={() => updateField(editableListing.title !== undefined ? 'title' : 'etsyTitle', alt)}
                    >
                      {alt}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="font-bold text-[#111111] text-sm uppercase tracking-wider">Improved Description</label>
            <Textarea 
              value={editableListing.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              className="min-h-[300px] bg-gray-50 border-gray-200 focus-visible:ring-[#8A6CFF] text-gray-700 leading-relaxed p-4"
            />
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <label className="font-bold text-[#111111] text-sm uppercase tracking-wider flex items-center">
              <Tag className="w-4 h-4 mr-2 text-[#8A6CFF]" /> Optimized Tags (13)
            </label>
            <Input 
              value={(editableListing.tags || []).join(', ')}
              onChange={(e) => updateField('tags', e.target.value.split(',').map(t => t.trim()))}
              className="bg-gray-50 border-gray-200 focus-visible:ring-[#8A6CFF]"
              placeholder="tag1, tag2, tag3..."
            />
            <p className="text-xs text-gray-500">Comma separated. Etsy allows up to 13 tags, max 20 characters each.</p>
          </div>

          {/* FAQ */}
          {editableListing.faq && editableListing.faq.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <label className="font-bold text-[#111111] text-sm uppercase tracking-wider flex items-center">
                <MessageCircle className="w-4 h-4 mr-2 text-[#8A6CFF]" /> Suggested FAQ
              </label>
              <div className="space-y-4">
                {editableListing.faq.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-2xl space-y-3 border border-gray-100">
                    <Input 
                      value={item.question}
                      onChange={(e) => {
                        const newFaq = [...editableListing.faq];
                        newFaq[idx].question = e.target.value;
                        updateField('faq', newFaq);
                      }}
                      className="font-semibold bg-white"
                      placeholder="Question"
                    />
                    <Textarea 
                      value={item.answer}
                      onChange={(e) => {
                        const newFaq = [...editableListing.faq];
                        newFaq[idx].answer = e.target.value;
                        updateField('faq', newFaq);
                      }}
                      className="bg-white text-sm"
                      placeholder="Answer"
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          {editableListing.cta && (
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <label className="font-bold text-[#111111] text-sm uppercase tracking-wider">Call to Action</label>
              <Input 
                value={editableListing.cta}
                onChange={(e) => updateField('cta', e.target.value)}
                className="bg-blue-50 border-blue-100 text-blue-900 font-medium focus-visible:ring-blue-400"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
        <Button 
          variant="outline" 
          onClick={onStartOver}
          className="h-14 px-8 rounded-xl font-bold text-gray-600 hover:text-[#111111]"
        >
          <RotateCcw className="w-5 h-5 mr-2" /> Start Over
        </Button>
        <Button 
          onClick={handleSaveClick}
          disabled={isSaving}
          className="h-14 px-10 bg-[#D6FF3F] hover:bg-[#c4f02e] text-[#111111] font-extrabold text-lg rounded-xl shadow-lg"
        >
          {isSaving ? 'Saving...' : 'Save Optimization'} <Save className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default OptimizedListingSection;
