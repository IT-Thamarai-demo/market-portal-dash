import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/ui/ProductCard';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Package, TrendingUp, DollarSign } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  status: 'approved' | 'pending' | 'rejected';
  vendorId?: string;
}

const VendorDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (token) fetchVendorProducts();
  }, [token]);

  const fetchVendorProducts = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/my-products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch products');

      const data = await response.json();
      // Map _id to id for compatibility with ProductCard
      setProducts(data.map((p: any) => ({ ...p, id: p._id })));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    toast({
      title: "Edit Product",
      description: `Navigate to edit screen for ${product.name}`,
    });
    // For actual navigation: useNavigate(`/vendor/edit/${product._id}`);
  };

  const approved = products.filter(p => p.status === 'approved');
  const pending = products.filter(p => p.status === 'pending');
  const rejected = products.filter(p => p.status === 'rejected');
  const totalValue = approved.reduce((sum, p) => sum + p.price, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your products and track your performance</p>
          </div>
          <Link to="/vendor/add">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Products" icon={<Package />} value={products.length} />
          <StatCard title="Approved" icon={<TrendingUp />} value={approved.length} color="text-green-600" />
          <StatCard title="Pending" icon={<Package />} value={pending.length} color="text-yellow-600" />
          <StatCard title="Total Revenue" icon={<DollarSign />} value={`$${totalValue.toFixed(2)}`} />
        </div>

        {/* Product Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Your Products</CardTitle>
            <CardDescription>Manage your product listings</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({products.length})</TabsTrigger>
                <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
              </TabsList>

              {['all', 'approved', 'pending', 'rejected'].map(tab => (
                <TabsContent key={tab} value={tab} className="mt-6">
                  <ProductGrid
                    products={
                      tab === 'all'
                        ? products
                        : products.filter(p => p.status === tab)
                    }
                    onEdit={handleEditProduct}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  icon,
  color = 'text-black',
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: string;
}) => (
  <Card>
    <CardHeader className="flex items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-4 w-4 text-muted-foreground">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </CardContent>
  </Card>
);

const ProductGrid = ({
  products,
  onEdit,
}: {
  products: Product[];
  onEdit: (product: Product) => void;
}) =>
  products.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} onEdit={onEdit} />
      ))}
    </div>
      ) : (
    <div className="text-center py-8 text-gray-500">
      No products found in this tab.
    </div>
  );

export default VendorDashboard;
