
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

const ScoreGauge = ({ label, score }) => {
  const getScoreColor = (s) => {
    if (s < 40) return { text: 'text-red-500', bg: 'bg-red-50', stroke: 'stroke-red-500' };
    if (s < 70) return { text: 'text-yellow-500', bg: 'bg-yellow-50', stroke: 'stroke-yellow-500' };
    return { text: 'text-green-500', bg: 'bg-green-50', stroke: 'stroke-green-500' };
  };

  const colors = getScoreColor(score);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            className="stroke-gray-100"
            strokeWidth="8"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
          <circle
            className={`${colors.stroke} transition-all duration-1000 ease-out`}
            strokeWidth="8"
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
            style={{ strokeDasharray: circumference, strokeDashoffset }}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`text-2xl font-extrabold ${colors.text}`}>{score}</span>
        </div>
      </div>
      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-3 text-center">
        {label}
      </span>
    </div>
  );
};

const CurrentListingAnalysis = ({ listingText, scores, issues }) => {
  if (!scores) return null;

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Info className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-white">
        <CardHeader className="bg-gray-50 border-b border-gray-100 pb-4">
          <CardTitle className="text-lg font-bold text-[#111111]">Current Performance</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ScoreGauge label="SEO" score={scores.seoScore || 0} />
            <ScoreGauge label="Clarity" score={scores.clarityScore || 0} />
            <ScoreGauge label="Conversion" score={scores.conversionScore || 0} />
            <ScoreGauge label="Engagement" score={scores.engagementScore || 0} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-white">
        <CardHeader className="bg-gray-50 border-b border-gray-100 pb-4">
          <CardTitle className="text-lg font-bold text-[#111111]">Identified Issues</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {issues && issues.length > 0 ? (
            <div className="space-y-4">
              {issues.map((issue, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl border border-gray-100 bg-white hover:shadow-sm transition-shadow">
                  <div className="mt-0.5">{getPriorityIcon(issue.priority)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-[#111111] text-sm">{issue.issue}</h4>
                      <Badge variant="outline" className={`text-[10px] uppercase font-bold ${getPriorityColor(issue.priority)}`}>
                        {issue.priority} Priority
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{issue.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3 opacity-50" />
              <p>No major issues identified. Great job!</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-white">
        <CardHeader className="bg-gray-50 border-b border-gray-100 pb-4">
          <CardTitle className="text-lg font-bold text-[#111111]">Original Text</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-gray-50 p-4 rounded-2xl text-sm text-gray-600 whitespace-pre-wrap max-h-60 overflow-y-auto custom-scrollbar">
            {listingText}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrentListingAnalysis;
