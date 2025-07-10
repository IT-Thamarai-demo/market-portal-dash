
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import CartContent from '@/components/cart/CartContent';

const Cart: React.FC = () => {
  const { getTotalItems } = useCart();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Shopping Cart
            {getTotalItems() > 0 && (
              <span className="ml-2 text-lg font-normal text-gray-600">
                ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})
              </span>
            )}
          </h1>
        </div>

        <CartContent />
      </div>
    </div>
  );
};

export default Cart;