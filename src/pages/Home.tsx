import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Package, Zap, Shield, HeadphonesIcon } from 'lucide-react';
import { api } from '@/lib/api';
import { Product, Category } from '@/types';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.products.getAll({ limit: 8 }),
        api.categories.getFiltered(),
      ]);

      setFeaturedProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Failed to fetch home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => `₹${price.toFixed(2)}`;

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="gradient-hero text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-white/20 text-white border-white/40">
              Trusted by 10,000+ Makers
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Explore Top-Notch
              <br />
              <span className="text-primary">Electronic Components</span>
            </h1>
            <p className="text-xl mb-8 opacity-90">
              From hobbyists to professionals - discover quality components
              for all your electronic projects.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="default" className="shadow-primary" asChild>
                <Link to="/products">
                  Browse Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/categories">View Categories</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              icon: Zap,
              title: 'Fast Delivery',
              desc: 'Quick shipping across India',
            },
            {
              icon: Shield,
              title: 'Quality Assured',
              desc: 'Genuine components only',
            },
            {
              icon: HeadphonesIcon,
              title: '24/7 Support',
              desc: 'Always here to help',
            },
            {
              icon: Package,
              title: '10K+ Products',
              desc: 'Vast component library',
            },
          ].map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Shop by Category</h2>
            <p className="text-muted-foreground">
              Explore our wide range of electronic components
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/categories">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(0, 12).map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="group"
            >
              <Card className="hover:shadow-md transition-all hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="mb-3 text-4xl">
                    {category.image || '📦'}
                  </div>
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  {category.productCount && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {category.productCount} items
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
            <p className="text-muted-foreground">
              Handpicked components for your next project
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/products">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="aspect-square bg-muted mb-4 rounded-lg" />
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.SKU}
                to={`/product/${product.manufacturer}/${product.product_model}/details/${product.SKU}`}
              >
                <Card className="group hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-muted mb-4 rounded-lg flex items-center justify-center overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.displayName}
                          className="object-contain w-full h-full group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <Package className="h-20 w-20 text-muted-foreground" />
                      )}
                    </div>
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.displayName}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {product.manufacturer}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">
                        {formatPrice(product.selling_price || product.list_price)}
                      </span>
                      {product.selling_price && product.selling_price < product.list_price && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatPrice(product.list_price)}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Next Project?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of makers who trust DIY Components for their electronic needs.
            Get started today with quality components and fast delivery.
          </p>
          <Button size="lg" className="shadow-primary" asChild>
            <Link to="/products">
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
