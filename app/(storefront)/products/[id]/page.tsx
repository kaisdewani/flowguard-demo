"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useProducts, useCart } from "@/lib/store";
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

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { getProduct, products } = useProducts();
  const { addItem } = useCart();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const product = getProduct(id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="max-w-md mx-auto">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-40" />
          <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you are looking for does not exist or has been removed.
          </p>
          <Link href="/products">
            <Button>
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const productIndex = products.findIndex((p) => p.id === product.id);
  const colorClass = PRODUCT_COLORS[productIndex >= 0 ? productIndex % PRODUCT_COLORS.length : 0];
  const initial = product.title.charAt(0).toUpperCase();

  const inStock = product.stock === undefined || product.stock > 0;
  const maxQty = product.stock ?? 99;

  function decrementQty() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function incrementQty() {
    setQuantity((q) => Math.min(maxQty, q + 1));
  }

  function handleQtyInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      setQuantity(Math.max(1, Math.min(maxQty, val)));
    }
  }

  async function handleAddToCart() {
    if (isAdding || !inStock || !product) return;
    setIsAdding(true);
    addItem(product.id, quantity);
    toast.success(`Added ${quantity} x ${product.title} to cart`, {
      action: {
        label: "View Cart",
        onClick: () => router.push("/cart"),
      },
    });
    // Prevent double-click for 500ms
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/products" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Products
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Product Image Placeholder */}
        <div className="space-y-4">
          <div
            className={`w-full aspect-square rounded-2xl flex items-center justify-center text-9xl font-bold ${colorClass}`}
            aria-label={`Product image for ${product.title}`}
          >
            {initial}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          <div>
            {product.category && (
              <Badge variant="secondary" className="capitalize mb-3">
                {product.category}
              </Badge>
            )}
            <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>
            <p className="text-3xl font-bold text-primary mt-3">
              {formatCurrency(product.price)}
            </p>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {inStock ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  {product.stock !== undefined
                    ? `${product.stock} in stock`
                    : "In stock"}
                </span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-destructive" />
                <span className="text-sm font-medium text-destructive">
                  Out of stock
                </span>
              </>
            )}
          </div>

          <Separator />

          {/* Description */}
          {product.description && (
            <div>
              <h2 className="font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          <Separator />

          {/* Quantity Selector */}
          <div>
            <label className="text-sm font-semibold block mb-3" htmlFor="quantity">
              Quantity
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementQty}
                disabled={quantity <= 1 || !inStock}
                aria-label="Decrease quantity"
                className="h-10 w-10 flex-shrink-0"
              >
                <Minus className="w-4 h-4" />
              </Button>

              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={handleQtyInput}
                min={1}
                max={maxQty}
                disabled={!inStock}
                className="w-20 text-center"
                aria-label="Product quantity"
              />

              <Button
                variant="outline"
                size="icon"
                onClick={incrementQty}
                disabled={quantity >= maxQty || !inStock}
                aria-label="Increase quantity"
                className="h-10 w-10 flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>

              {product.stock !== undefined && product.stock > 0 && (
                <span className="text-sm text-muted-foreground ml-1">
                  of {product.stock} available
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            size="lg"
            onClick={handleAddToCart}
            disabled={isAdding || !inStock}
            className="w-full sm:w-auto"
          >
            {isAdding ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 w-4 h-4" />
                {inStock ? "Add to Cart" : "Out of Stock"}
              </>
            )}
          </Button>

          {/* Additional Info */}
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
            <div className="flex gap-2 text-sm">
              <span className="text-muted-foreground w-24 flex-shrink-0">Product ID</span>
              <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{product.id}</span>
            </div>
            {product.category && (
              <div className="flex gap-2 text-sm">
                <span className="text-muted-foreground w-24 flex-shrink-0">Category</span>
                <span className="capitalize">{product.category}</span>
              </div>
            )}
            <div className="flex gap-2 text-sm">
              <span className="text-muted-foreground w-24 flex-shrink-0">Price</span>
              <span>{formatCurrency(product.price)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
