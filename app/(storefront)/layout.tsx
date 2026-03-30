"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Store, LogOut, LogIn, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/store";
import { useAuth } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { totalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { href: "/products", label: "Products" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl text-foreground hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
                <Store className="w-4 h-4" />
              </div>
              <span className="hidden sm:block">FlowGuard Demo Store</span>
              <span className="sm:hidden">FG Store</span>
            </Link>

            {/* Center Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    pathname === link.href || pathname.startsWith(link.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Cart */}
              <Link href="/cart">
                <Button
                  variant="ghost"
                  className="relative"
                  aria-label={`Cart with ${totalItems} items`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <Badge
                      className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground"
                      aria-hidden="true"
                    >
                      {totalItems > 99 ? "99+" : totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>

              <Separator orientation="vertical" className="h-6" />

              {/* Auth */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>{user?.email ?? "Account"}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="w-4 h-4 sm:mr-1.5" />
                    <span className="hidden sm:block">Logout</span>
                  </Button>
                </div>
              ) : (
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">
                    <LogIn className="w-4 h-4 sm:mr-1.5" />
                    <span className="hidden sm:block">Login</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden border-t">
          <div className="max-w-7xl mx-auto px-4 py-2 flex gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                  pathname === link.href || pathname.startsWith(link.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <div className="flex items-center justify-center w-6 h-6 rounded bg-primary text-primary-foreground">
                <Store className="w-3 h-3" />
              </div>
              FlowGuard Demo Store
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/products" className="hover:text-foreground transition-colors">
                Products
              </Link>
              <Link href="/cart" className="hover:text-foreground transition-colors">
                Cart
              </Link>
              <Link href="/auth/login" className="hover:text-foreground transition-colors">
                Account
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} FlowGuard Demo Store. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <Toaster richColors position="top-right" />
    </div>
  );
}
