
import React from 'react';
<<<<<<< HEAD
import { useCart } from '@/contexts/cartContext';
=======
import { useCart } from '@/contexts/CartContext';
>>>>>>> 4d72d3e96d2306c59dfc29fbf4b4cf60aaa15ed7
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  cloudinaryPublicId?: string;
  quantity: number;
}

const CartContent: React.FC = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  // Cloudinary URL generator with optional transformations
  const getCloudinaryImageUrl = (
    publicId: string,
    transformations = 'w_100,h_100,c_fill,q_auto,f_auto/'
  ) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dq43oxtjn';
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}${publicId}`;
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ShoppingCart className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 text-center">Add some products to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Shopping Cart ({items.length} items)</CardTitle>
          <Button
            onClick={clearCart}
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cart
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item: CartItem) => {
            const imageSrc = item.cloudinaryPublicId
              ? getCloudinaryImageUrl(item.cloudinaryPublicId)
              : item.image?.startsWith('http')
              ? item.image
              : item.image
              ? `${import.meta.env.VITE_API_BASE_URL}${item.image}`
              : null;

            return (
              <div key={item.id} className="flex items-center space-x-4 border-b pb-4 last:border-b-0">
                <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-product.png';
                      }}
                    />
                  ) : (
                    <span className="text-gray-500 text-xs">No Image</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                  <p className="text-sm text-gray-600 truncate">{item.description}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-lg font-bold text-primary">${item.price.toFixed(2)}</span>
                    <Badge variant="secondary" className="ml-2">
                      Total: ${(item.price * item.quantity).toFixed(2)}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>

                  <span className="w-8 text-center font-medium">{item.quantity}</span>

                  <Button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>

                  <Button
                    onClick={() => removeFromCart(item.id)}
                    variant="destructive"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total: ${getTotalPrice().toFixed(2)}</span>
            <Button size="lg" className="ml-4">
              Proceed to Checkout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CartContent;