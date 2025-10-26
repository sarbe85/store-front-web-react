import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Package, ShoppingCart } from 'lucide-react';
import { api } from '@/lib/api';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { addToCart } = useCart();

  const categorySlug = searchParams.get('category');
  const searchQuery = searchParams.get('q');

  useEffect(() => {
    fetchProducts();
  }, [categorySlug, searchQuery, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let response;
      if (searchQuery) {
        response = await api.products.search(searchQuery);
      } else if (categorySlug) {
        response = await api.products.getByCategory(categorySlug);
      } else {
        response = await api.products.getAll({ page, limit: 24 });
      }

      const newProducts = response.data || [];
      setProducts((prev) => (page === 1 ? newProducts : [...prev, ...newProducts]));
      setHasMore(newProducts.length === 24);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart({ SKU: product.SKU, quantity: 1 });
    } catch (error) {
      // Error handled by context
    }
  };

  const formatPrice = (price: number) => `₹${price.toFixed(2)}`;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {searchQuery
            ? `Search Results for "${searchQuery}"`
            : categorySlug
            ? 'Category Products'
            : 'All Products'}
        </h1>
        <p className="text-muted-foreground">
          {loading && page === 1
            ? 'Loading products...'
            : `${products.length} products found`}
        </p>
      </div>

      {/* Products Grid */}
      {loading && page === 1 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="aspect-square mb-4 rounded-lg" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-2xl font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or browse our categories
          </p>
          <Button asChild>
            <Link to="/categories">Browse Categories</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card
                key={product.SKU}
                className="group hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <CardContent className="p-4">
                  <Link
                    to={`/product/${product.manufacturer}/${product.product_model}/details/${product.SKU}`}
                  >
                    <div className="aspect-square bg-muted mb-4 rounded-lg flex items-center justify-center overflow-hidden relative">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.displayName}
                          className="object-contain w-full h-full group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <Package className="h-20 w-20 text-muted-foreground" />
                      )}
                      {product.stock_quantity <= 0 && (
                        <Badge className="absolute top-2 right-2 bg-destructive">
                          Out of Stock
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.displayName}
                    </h3>

                    <p className="text-xs text-muted-foreground mb-3">
                      {product.manufacturer}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-primary text-lg">
                        {formatPrice(product.selling_price || product.list_price)}
                      </span>
                      {product.selling_price && product.selling_price < product.list_price && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatPrice(product.list_price)}
                        </span>
                      )}
                    </div>
                  </Link>

                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock_quantity <= 0}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          {hasMore && !loading && (
            <div className="text-center mt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setPage((p) => p + 1)}
              >
                Load More Products
              </Button>
            </div>
          )}

          {loading && page > 1 && (
            <div className="text-center mt-8 text-muted-foreground">
              Loading more products...
            </div>
          )}
        </>
      )}
    </div>
  );
}
