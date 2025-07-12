import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/cartContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { getTotalItems } = useCart();
  const { toast } = useToast();
  const totalItems = getTotalItems();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
    setIsOpen(false);
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
      variant: 'default',
    });
  }, [logout, navigate, toast]);

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);

  const navItems = [
    { name: 'Home', path: '/', show: true },
    { name: 'Vendor Dashboard', path: '/vendor', show: isAuthenticated && user?.role === 'vendor' },
    { name: 'Admin Dashboard', path: '/admin', show: isAuthenticated && user?.role === 'admin' },
  ];

  const authItems = [
    { name: 'Login', path: '/login', show: !isAuthenticated },
    { name: 'Register', path: '/register', show: !isAuthenticated },
  ];

  return (
    <nav className="bg-white shadow-lg border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className=" folder path='C:\Users\user\Desktop\Projects\marketplace-app\src\components' file='Navbar.tsx' language='typescript'
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <ShoppingCart className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-gray-900">MarketPlace</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => item.show && (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}

              {/* Cart Icon */}
              <Link to="/cart" className="relative" aria-label={`Cart with ${totalItems} items`}>
                <ShoppingCart className="h-6 w-6 text-primary" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Welcome, {user?.email} ({user?.role})
                  </span>
                  <Button onClick={handleLogout} variant="outline" size="sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  {authItems.map((item) => item.show && (
                    <Link key={item.path} to={item.path}>
                      <Button variant={item.name === 'Register' ? 'default' : 'outline'} size="sm">
                        {item.name}
                      </Button>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMenu}
                className="p-2"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
            isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
            {navItems.map((item) => item.show && (
              <Link
                key={item.path}
                to={item.path}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Cart Link - Mobile */}
            <Link
              to="/cart"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart {totalItems > 0 && <span className="ml-1 text-sm text-red-500">({totalItems})</span>}
            </Link>

            {isAuthenticated ? (
              <div className="px-3 py-2 space-y-2">
                <div className="text-sm text-gray-600">
                  Welcome, {user?.email} ({user?.role})
                </div>
                <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="px-3 py-2 space-y-2">
                {authItems.map((item) => item.show && (
                  <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                    <Button
                      variant={item.name === 'Register' ? 'default' : 'outline'}
                      size="sm"
                      className="w-full"
                    >
                      {item.name}
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>
    );
};

export default React.memo(Navbar);