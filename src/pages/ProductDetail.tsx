import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Package, Truck, Shield, ArrowLeft, Minus, Plus } from 'lucide-react';
import { api } from '@/lib/api';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';

export default function ProductDetail() {
  const { sku } = useParams<{ sku: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (sku) {
      fetchProduct();
    }
  }, [sku]);

  const fetchProduct = async () => {
    if (!sku) return;

    setLoading(true);
    try {
      const response = await api.products.getOne(sku);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addToCart({ SKU: product.SKU, quantity });
    } catch (error) {
      // Error handled by context
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  const formatPrice = (price: number) => `₹${price.toFixed(2)}`;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate('/products')}>
          Browse All Products
        </Button>
      </div>
    );
  }

  const isOutOfStock = product.stock_quantity <= 0;
  const discountPercent = product.selling_price
    ? Math.round(((product.list_price - product.selling_price) / product.list_price) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div>
          <Card>
            <CardContent className="p-8">
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.displayName}
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <Package className="h-40 w-40 text-muted-foreground" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.displayName}</h1>
            <p className="text-muted-foreground">
              By <span className="font-medium">{product.manufacturer}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Model: {product.product_model} | SKU: {product.SKU}
            </p>
          </div>

          <Separator />

          {/* Price */}
          <div>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl font-bold text-primary">
                {formatPrice(product.selling_price || product.list_price)}
              </span>
              {product.selling_price && product.selling_price < product.list_price && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.list_price)}
                  </span>
                  <Badge variant="secondary">{discountPercent}% OFF</Badge>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Inclusive of all taxes</p>
          </div>

          {/* Stock Status */}
          <div>
            {isOutOfStock ? (
              <Badge variant="destructive" className="text-base py-1 px-3">
                Out of Stock
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-base py-1 px-3">
                In Stock ({product.stock_quantity} available)
              </Badge>
            )}
          </div>

          {/* Quantity Selector */}
          {!isOutOfStock && (
            <div>
              <label className="text-sm font-medium mb-2 block">Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center"
                  min="1"
                  max={product.stock_quantity}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setQuantity(Math.min(product.stock_quantity, quantity + 1))
                  }
                  disabled={quantity >= product.stock_quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="flex-1"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
            >
              Buy Now
            </Button>
          </div>

          {/* Features */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs font-medium">Fast Delivery</p>
                </div>
                <div>
                  <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs font-medium">Quality Assured</p>
                </div>
                <div>
                  <Package className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs font-medium">Genuine Product</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="font-semibold mb-2">Product Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
