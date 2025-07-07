
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  status: 'approved' | 'pending' | 'rejected';
  vendorId?: string;
}

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onApprove?: (productId: string) => void;
  onReject?: (productId: string) => void;
  showActions?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onEdit, 
  onApprove, 
  onReject, 
  showActions = true 
}) => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const isVendor = user?.role === 'vendor';
  const isAdmin = user?.role === 'admin';
  const isOwnProduct = isVendor && product.vendorId === user?.id;

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="aspect-square bg-gray-200 rounded-md mb-4 flex items-center justify-center">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <span className="text-gray-500">No Image</span>
          )}
        </div>
        <CardTitle className="line-clamp-2">{product.name}</CardTitle>
        <CardDescription className="line-clamp-3">{product.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          <Badge variant={product.status === 'approved' ? 'default' : 'secondary'}>
            {product.status}
          </Badge>
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="flex gap-2">
          {/* User actions */}
          {isAuthenticated && !isVendor && !isAdmin && product.status === 'approved' && (
            <Button onClick={handleAddToCart} className="flex-1">
              Add to Cart
            </Button>
          )}

          {/* Vendor actions */}
          {isOwnProduct && onEdit && (
            <Button onClick={() => onEdit(product)} variant="outline" className="flex-1">
              Edit
            </Button>
          )}

          {/* Admin actions */}
          {isAdmin && product.status === 'pending' && (
            <>
              {onApprove && (
                <Button onClick={() => onApprove(product.id)} className="flex-1">
                  Approve
                </Button>
              )}
              {onReject && (
                <Button onClick={() => onReject(product.id)} variant="destructive" className="flex-1">
                  Reject
                </Button>
              )}
            </>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default ProductCard;
