
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, Calendar, Tag } from 'lucide-react';

const SavedProductsCard = ({ product, onDelete }) => {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-300 border-gray-200 bg-white overflow-hidden group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4 mb-2">
          <CardTitle className="text-lg font-bold line-clamp-2 text-[#111111] group-hover:text-[#8A6CFF] transition-colors">
            {product.name}
          </CardTitle>
          <Badge className="bg-[#F4F4F6] text-[#111111] hover:bg-[#E5E5E8] whitespace-nowrap">
            {product.category}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Tag className="w-3.5 h-3.5 mr-1.5" />
          <span className="line-clamp-1">{product.niche}</span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 pb-4">
        <div className="flex items-center text-xs text-gray-400 bg-gray-50 w-fit px-2.5 py-1 rounded-md">
          <Calendar className="w-3.5 h-3.5 mr-1.5" />
          {new Date(product.created).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2 pt-4 border-t border-gray-100 bg-gray-50/50">
        <Button variant="outline" size="sm" className="h-8 px-3 text-gray-600 hover:text-[#8A6CFF] hover:border-[#8A6CFF]" asChild>
          <Link to={`/saved-products/${product.id}`}>
            <Eye className="w-4 h-4 mr-1.5" /> View
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="h-8 px-3 text-gray-600 hover:text-blue-600 hover:border-blue-600" asChild>
          <Link to={`/saved-products/${product.id}/edit`}>
            <Edit className="w-4 h-4 mr-1.5" /> Edit
          </Link>
        </Button>
        <Button variant="ghost" size="sm" className="h-8 px-3 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => onDelete(product.id)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SavedProductsCard;
