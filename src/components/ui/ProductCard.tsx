import React, { useCallback } from 'react';
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
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  // Define role checks
  const isUser = user?.role === 'user';
  const isVendor = user?.role === 'vendor';
  const isAdmin = user?.role === 'admin';
  const isOwnProduct = isVendor && product.vendorId === user?.id;

  // Cloudinary URL generator with optional transformations
  const getCloudinaryImageUrl = (
    publicId: string,
    transformations = 'w_500,h_500,c_fill,q_auto,f_auto/'
  ) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dq43oxtjn';
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}${publicId}`;
  };

  // Determine image source with fallbacks
  const imageSrc = product.cloudinaryPublicId
    ? getCloudinaryImageUrl(product.cloudinaryPublicId)
    : product.image?.startsWith('http')
    ? product.image
    : product.image
    ? `${import.meta.env.VITE_API_BASE_URL}${product.image}`
    : null;

  // Add to cart action
  const handleAddToCart = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      addToCart({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        cloudinaryPublicId: product.cloudinaryPublicId,
        quantity: 1,
      });
    },
    [addToCart, product]
  );

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="aspect-square bg-gray-200 rounded-md mb-4 flex items-center justify-center overflow-hidden">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-product.png';
              }}
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
          {/* Add to Cart button - show for approved products for 'user' role or unauthenticated */}
          {product.status === 'approved' && !isAdmin && (!isAuthenticated || isUser) && (
            <Button onClick={handleAddToCart} className="flex-1">
              Add to Cart
            </Button>
          )}

          {/* Vendor: Edit button for own products */}
          {isOwnProduct && onEdit && (
            <Button onClick={() => onEdit(product)} variant="outline" className="flex-1">
              Edit
            </Button>
          )}

          {/* Admin: Approve/Reject buttons for pending products */}
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