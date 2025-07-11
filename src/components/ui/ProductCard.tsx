import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/cartContext';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  cloudinaryPublicId?: string;
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
  showActions = true,
}) => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const getCloudinaryImageUrl = (
    publicId: string,
    transformations = 'w_500,h_500,c_fill,q_auto,f_auto/'
  ) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      console.warn('Cloudinary cloud name not set');
      return '/assets/placeholder-product.png';
    }
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}${publicId}`;
  };

  const imageSrc = product.cloudinaryPublicId
    ? getCloudinaryImageUrl(product.cloudinaryPublicId)
    : product.image?.startsWith('http')
    ? product.image
    : product.image
    ? `${import.meta.env.VITE_API_BASE_URL}${product.image}`
    : '/assets/placeholder-product.png';

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      cloudinaryPublicId: product.cloudinaryPublicId,
      quantity: 1,
    });
  };

  const isVendor = user?.role === 'vendor' && user?.id;
  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';
  const isOwnProduct = isVendor && product.vendorId === user?.id;

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="aspect-square bg-gray-200 rounded-md mb-4 flex items-center justify-center overflow-hidden">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/placeholder-product.png';
            }}
          />
        </div>
        <CardTitle className="line-clamp-2">{product.name}</CardTitle>
        <CardDescription className="line-clamp-3">{product.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          <Badge
            variant={
              product.status === 'approved'
                ? 'default'
                : product.status === 'pending'
                ? 'secondary'
                : 'destructive'
            }
          >
            {product.status}
          </Badge>
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="flex gap-2">
          {product.status === 'approved' && isUser && (
            <Button onClick={handleAddToCart} className="flex-1" aria-label={`Add ${product.name} to cart`}>
              Add to Cart
            </Button>
          )}
          {isOwnProduct && onEdit && (
            <Button onClick={() => onEdit(product)} variant="outline" className="flex-1">
              Edit
            </Button>
          )}
          {isAdmin && product.status === 'pending' && (
            <>
              {onApprove && (
                <Button onClick={() => onApprove(product.id)} className="flex-1">
                  Approve
                </Button>
              )}
              {onReject && (
                <Button
                  onClick={() => onReject(product.id)}
                  variant="destructive"
                  className="flex-1"
                >
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