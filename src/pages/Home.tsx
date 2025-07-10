
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/ui/ProductCard';
import { useToast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';

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

// Dummy data for testing
const dummyProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with titanium design and advanced camera system',
    price: 999.99,
    status: 'approved',
    category: 'Electronics',
    vendorId: 'vendor1',
  },
  {
    id: '2',
    name: 'MacBook Air M2',
    description: 'Lightweight laptop with M2 chip and all-day battery life',
    price: 1199.99,
    status: 'approved',
    category: 'Electronics',
    vendorId: 'vendor2',
  },
  {
    id: '3',
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes with Max Air unit',
    price: 149.99,
    status: 'approved',
    category: 'Clothing',
    vendorId: 'vendor3',
  },
  {
    id: '4',
    name: 'Samsung Galaxy S24',
    description: 'Flagship Android phone with AI features',
    price: 899.99,
    status: 'approved',
    category: 'Electronics',
    vendorId: 'vendor4',
  },
  {
    id: '5',
    name: 'Adidas Ultraboost 22',
    description: 'Premium running shoes with boost technology',
    price: 189.99,
    status: 'approved',
    category: 'Sports',
    vendorId: 'vendor5',
  },
  {
    id: '6',
    name: 'The Great Gatsby',
    description: 'Classic American novel by F. Scott Fitzgerald',
    price: 12.99,
    status: 'approved',
    category: 'Books',
    vendorId: 'vendor6',
  },
];

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/products/approved`;
      console.log('Fetching products from:', apiUrl);
      
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched products:', data);
        setProducts(data);
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      
      // Use dummy data as fallback
      console.log('Using dummy data as fallback');
      setProducts(dummyProducts);
      
      toast({
        title: "Using Demo Data",
        description: "Could not connect to server. Showing sample products.",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

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
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to MarketPlace
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Discover amazing products from trusted vendors
          </p>
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
              <ProductCard
                key={product.id}
                product={product}
              />
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
  );
};

export default Home;
