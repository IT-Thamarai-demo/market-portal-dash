import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ui/ProductCard';
import { useToast } from '@/hooks/use-toast';
import { Search, RefreshCw } from 'lucide-react';
import { CartProvider } from '@/contexts/CartContext';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  status: 'approved' | 'pending' | 'rejected';
  category?: string;
  vendorId?: string;
  cloudinaryPublicId?: string;
}

const dummyProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with titanium design and advanced camera system',
    price: 999.99,
    status: 'approved',
    category: 'Electronics',
    vendorId: 'vendor1',
    image: 'https://source.unsplash.com/300x200/?iphone',
  },
  {
    id: '2',
    name: 'MacBook Air M2',
    description: 'Lightweight laptop with M2 chip and all-day battery life',
    price: 1199.99,
    status: 'approved',
    category: 'Electronics',
    vendorId: 'vendor2',
    image: 'https://source.unsplash.com/300x200/?macbook',
  },
  {
    id: '3',
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes with Max Air unit',
    price: 149.99,
    status: 'approved',
    category: 'Clothing',
    vendorId: 'vendor3',
    image: 'https://source.unsplash.com/300x200/?shoes',
  },
  {
    id: '4',
    name: 'Samsung Galaxy S24',
    description: 'Flagship Android phone with AI features',
    price: 899.99,
    status: 'approved',
    category: 'Electronics',
    vendorId: 'vendor4',
    image: 'https://source.unsplash.com/300x200/?samsung',
  },
  {
    id: '5',
    name: 'Adidas Ultraboost 22',
    description: 'Premium running shoes with boost technology',
    price: 189.99,
    status: 'approved',
    category: 'Sports',
    vendorId: 'vendor5',
    image: 'https://source.unsplash.com/300x200/?adidas',
  },
  {
    id: '6',
    name: 'The Great Gatsby',
    description: 'Classic American novel by F. Scott Fitzgerald',
    price: 12.99,
    status: 'approved',
    category: 'Books',
    vendorId: 'vendor6',
    image: 'https://source.unsplash.com/300x200/?book',
  },
];

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [isServerConnected, setIsServerConnected] = useState<boolean>(false);
  const { toast } = useToast();

  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (showRetryMessage = false) => {
    if (showRetryMessage) {
      setLoading(true);
    }

    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/products/approved`;
      console.log('Fetching products from:', apiUrl);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(apiUrl, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched products:', data);
        setProducts(Array.isArray(data) ? data.map((p: any) => ({ ...p, id: p._id })) : []);
        setIsServerConnected(true);

        if (showRetryMessage) {
          toast({
            title: 'Connected!',
            description: 'Successfully connected to server.',
            variant: 'default',
          });
        }
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setIsServerConnected(false);
      setProducts(dummyProducts);

      if (showRetryMessage) {
        toast({
          title: 'Connection Failed',
          description: 'Could not connect to server. Using demo data.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Using Demo Data',
          description: 'Could not connect to server. Showing sample products.',
          variant: 'default',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchProducts(true);
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    return filtered;
  }, [products, searchTerm, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <CartProvider>
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to MarketPlace</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover amazing products from trusted vendors
            </p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className={`w-3 h-3 rounded-full ${isServerConnected ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
              <span className="text-sm opacity-90">
                {isServerConnected ? 'Connected to server' : 'Using demo data'}
              </span>
              {!isServerConnected && (
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  size="sm"
                  className="ml-2 text-white border-white hover:bg-white hover:text-primary"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Connection
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="md:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} showActions={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600 mb-4">No products found</p>
              {searchTerm || selectedCategory !== 'all' ? (
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              ) : (
                <p className="text-gray-500">Check back later for new products</p>
              )}
            </div>
          )}
        </div>
      </div>
    </CartProvider>
  );
};

export default Home;