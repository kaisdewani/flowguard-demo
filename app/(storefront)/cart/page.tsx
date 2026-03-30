"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useCart, useProducts } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

function RemoveButton({
  productTitle,
  onConfirm,
  size = "default",
}: {
  productTitle: string;
  onConfirm: () => void;
  size?: "default" | "sm";
}) {
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const btnSize = size === "sm" ? "h-7 w-7" : "h-8 w-8";

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <button
            className={`inline-flex items-center justify-center rounded-md ${btnSize} text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors`}
            aria-label={`Remove ${productTitle} from cart`}
          />
        }
      >
        <Trash2 className={iconSize} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove item?</AlertDialogTitle>
          <AlertDialogDescription>
            Remove <strong>{productTitle}</strong> from your cart? This cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep it</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const { getProduct } = useProducts();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag className="w-20 h-20 mx-auto mb-6 text-muted-foreground opacity-25" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you have not added anything yet.
          </p>
          <Link href="/products">
            <Button size="lg">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const enrichedItems = items.map((item) => ({
    ...item,
    product: getProduct(item.productId),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-1">
          {/* Table Header */}
          <div className="hidden sm:grid grid-cols-12 gap-4 pb-3 border-b text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <div className="col-span-5">Product</div>
            <div className="col-span-3 text-center">Quantity</div>
            <div className="col-span-2 text-right">Unit Price</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          {enrichedItems.map(({ productId, quantity, product }) => {
            if (!product) return null;
            const lineTotal = product.price * quantity;

            return (
              <div
                key={productId}
                className="grid grid-cols-12 gap-4 py-4 border-b items-center"
              >
                {/* Product Info */}
                <div className="col-span-12 sm:col-span-5 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center text-xl font-bold text-muted-foreground flex-shrink-0">
                    {product.title.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/products/${productId}`}
                      className="font-medium text-sm leading-tight hover:text-primary transition-colors line-clamp-2"
                    >
                      {product.title}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                      {product.category}
                    </p>
                    {/* Mobile price */}
                    <p className="sm:hidden text-sm font-bold text-primary mt-1">
                      {formatCurrency(lineTotal)}
                    </p>
                  </div>
                </div>

                {/* Quantity */}
                <div className="col-span-8 sm:col-span-3 flex items-center justify-start sm:justify-center gap-1.5">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => updateQuantity(productId, quantity - 1)}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium tabular-nums">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() =>
                      updateQuantity(
                        productId,
                        Math.min(product.stock ?? 99, quantity + 1)
                      )
                    }
                    disabled={quantity >= (product.stock ?? 99)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>

                {/* Remove button - Mobile */}
                <div className="col-span-4 sm:hidden flex justify-end">
                  <RemoveButton
                    productTitle={product.title}
                    onConfirm={() => removeItem(productId)}
                  />
                </div>

                {/* Unit Price - Desktop */}
                <div className="hidden sm:block col-span-2 text-right text-sm text-muted-foreground">
                  {formatCurrency(product.price)}
                </div>

                {/* Line Total + Remove - Desktop */}
                <div className="hidden sm:flex col-span-2 items-center justify-end gap-2">
                  <span className="text-sm font-semibold">
                    {formatCurrency(lineTotal)}
                  </span>
                  <RemoveButton
                    productTitle={product.title}
                    onConfirm={() => removeItem(productId)}
                    size="sm"
                  />
                </div>
              </div>
            );
          })}

          {/* Back to shopping link */}
          <div className="pt-4">
            <Link href="/products">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <ArrowLeft className="mr-1.5 w-3.5 h-3.5" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border bg-card p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              {enrichedItems.map(({ productId, quantity, product }) => {
                if (!product) return null;
                return (
                  <div key={productId} className="flex justify-between text-sm">
                    <span className="text-muted-foreground truncate mr-2 flex-1">
                      {product.title}{" "}
                      <span className="text-xs">x{quantity}</span>
                    </span>
                    <span className="flex-shrink-0 font-medium">
                      {formatCurrency(product.price * quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center mb-6">
              <span className="font-semibold">Subtotal</span>
              <span className="text-xl font-bold text-primary">
                {formatCurrency(totalPrice)}
              </span>
            </div>

            <p className="text-xs text-muted-foreground mb-4 text-center">
              Shipping and taxes calculated at checkout
            </p>

            <Button
              className="w-full"
              size="lg"
              onClick={() => router.push("/checkout")}
            >
              Proceed to Checkout
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
