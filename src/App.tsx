<<<<<<< HEAD
// App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/cartContext";
import Navbar from "@/components/layout/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VendorDashboard from "./pages/VendorDashboard";
import AddProduct from "./pages/AddProduct";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Cart from "./pages/cartscreen";
=======

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import Navbar from '@/components/layout/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import Home from '@/components/Home';
import Login from '@/components/Login';
import Register from '@/components/Register';
import Cart from '@/components/Cart';
import VendorDashboard from '@/components/VendorDashboard';
import AddProduct from '@/components/AddProduct';
import AdminDashboard from '@/components/AdminDashboard';
import Success from '@/components/Success';
import Cancel from '@/components/Cancel';
import NotFound from '@/components/NotFound';
>>>>>>> 4d72d3e96d2306c59dfc29fbf4b4cf60aaa15ed7

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
<<<<<<< HEAD
                <Route
                  path="/vendor"
                  element={
                    <ProtectedRoute allowedRoles={["vendor"]}>
=======
                <Route path="/cart" element={<Cart />} />
                <Route path="/success" element={<Success />} />
                <Route path="/cancel" element={<Cancel />} />
                <Route
                  path="/vendor"
                  element={
                    <ProtectedRoute allowedRoles={['vendor']}>
>>>>>>> 4d72d3e96d2306c59dfc29fbf4b4cf60aaa15ed7
                      <VendorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor/add"
                  element={
<<<<<<< HEAD
                    <ProtectedRoute allowedRoles={["vendor"]}>
=======
                    <ProtectedRoute allowedRoles={['vendor']}>
>>>>>>> 4d72d3e96d2306c59dfc29fbf4b4cf60aaa15ed7
                      <AddProduct />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
<<<<<<< HEAD
                    <ProtectedRoute allowedRoles={["admin"]}>
=======
                    <ProtectedRoute allowedRoles={['admin']}>
>>>>>>> 4d72d3e96d2306c59dfc29fbf4b4cf60aaa15ed7
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
<<<<<<< HEAD
                <Route path="/cart" element={<Cart />} />
=======
>>>>>>> 4d72d3e96d2306c59dfc29fbf4b4cf60aaa15ed7
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
