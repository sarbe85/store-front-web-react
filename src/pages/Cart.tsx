import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Decimal from 'decimal.js';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, isLoading } = useCart();
  const { isAuthenticated } = useAuth();

  const cartItems = cart.filter((item) => !item.isWishlist);

  const formatPrice = (price: number) => `₹${price.toFixed(2)}`;

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = item.selling_price || item.list_price;
      return new Decimal(sum).plus(new Decimal(price).times(item.quantity)).toNumber();
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 500 ? 0 : 50;
  const total = new Decimal(subtotal).plus(shipping).toNumber();

  const handleUpdateQuantity = async (sku: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(sku, newQuantity);
    } catch (error) {
      // Error handled by context
    }
  };

  const handleRemove = async (sku: string) => {
    try {
      await removeFromCart(sku);
    } catch (error) {
      // Error handled by context
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingCart className="h-20 w-20 mx-auto mb-6 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Please Sign In</h2>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to view your cart
          </p>
          <Button size="lg" onClick={() => navigate('/auth/login?redirect=/cart')}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingCart className="h-20 w-20 mx-auto mb-6 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
          <p className="text-muted-foreground mb-6">
            Start adding some products to your cart
          </p>
          <Button size="lg" asChild>
            <Link to="/products">
              Browse Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.SKU}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <Link
                    to={`/product/${item.manufacturer}/${item.SKU}/details/${item.SKU}`}
                    className="flex-shrink-0"
                  >
                    <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.displayName}
                          className="object-contain w-full h-full"
                        />
                      ) : (
                        <ShoppingCart className="h-10 w-10 text-muted-foreground" />
                      )}
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.manufacturer}/${item.SKU}/details/${item.SKU}`}
                    >
                      <h3 className="font-semibold mb-1 hover:text-primary transition-colors line-clamp-2">
                        {item.displayName}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.manufacturer}
                    </p>

                    <div className="flex items-center gap-4 flex-wrap">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.SKU, item.quantity - 1)}
                          disabled={item.quantity <= 1 || isLoading}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.SKU, item.quantity + 1)}
                          disabled={isLoading}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Price */}
                      <div className="font-bold text-primary">
                        {formatPrice(
                          (item.selling_price || item.list_price) * item.quantity
                        )}
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive ml-auto"
                        onClick={() => handleRemove(item.SKU)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-success">FREE</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Free shipping on orders above ₹500
                  </p>
                )}
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>

              <Button size="lg" className="w-full" onClick={() => navigate('/checkout')}>
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button variant="outline" size="lg" className="w-full" asChild>
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
