"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, Star, Truck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

const PRODUCT_COLORS = [
  "bg-blue-100 text-blue-600",
  "bg-violet-100 text-violet-600",
  "bg-emerald-100 text-emerald-600",
  "bg-amber-100 text-amber-600",
  "bg-rose-100 text-rose-600",
  "bg-cyan-100 text-cyan-600",
  "bg-indigo-100 text-indigo-600",
  "bg-orange-100 text-orange-600",
];

const FEATURES = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On all orders over $50",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Your data is always protected",
  },
  {
    icon: Star,
    title: "Quality Guarantee",
    description: "30-day return policy",
  },
];

export default function HomePage() {
  const { products } = useProducts();
  const featured = products.slice(0, 8);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500 rounded-full filter blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-white/10 text-white border-white/20 hover:bg-white/10">
              New arrivals every week
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                FlowGuard Demo Store
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed">
              Discover our curated collection of premium products. Quality you
              can trust, delivered to your door.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-white text-slate-900 hover:bg-white/90 font-semibold"
                >
                  Shop Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/products">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  View All Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-b bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex items-center gap-3 justify-center sm:justify-start"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Featured Products
            </h2>
            <p className="text-muted-foreground mt-1">
              Hand-picked selections just for you
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline" className="hidden sm:flex">
              View All
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No products yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map((product, index) => {
              const colorClass = PRODUCT_COLORS[index % PRODUCT_COLORS.length];
              const initial = product.title.charAt(0).toUpperCase();

              return (
                <Card
                  key={product.id}
                  className="group overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col"
                >
                  {/* Image Placeholder */}
                  <div
                    className={`h-48 flex items-center justify-center text-4xl font-bold ${colorClass}`}
                  >
                    {initial}
                  </div>

                  <CardContent className="p-4 flex-1">
                    <h3 className="font-semibold text-sm leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-lg font-bold text-primary">
                      {formatCurrency(product.price)}
                    </p>
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <Link href={`/products/${product.id}`} className="w-full">
                      <Button variant="outline" size="sm" className="w-full">
                        View
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link href="/products">
            <Button variant="outline">
              View All Products
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to start shopping?
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-lg mx-auto">
            Browse our full catalog and find exactly what you are looking for.
          </p>
          <Link href="/products">
            <Button
              size="lg"
              variant="secondary"
              className="font-semibold"
            >
              Browse All Products
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
