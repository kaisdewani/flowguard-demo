"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/sonner"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  Menu,
  LogOut,
  User,
  X,
} from "lucide-react"

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  href: string
  label: string
  icon: React.ElementType
  active: boolean
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="size-4 shrink-0" />
      {label}
    </Link>
  )
}

function ReLoginDialog() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const ok = login(email, password)
      if (!ok) {
        setError("Invalid email or password. Please try again.")
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open>
      <DialogContent showCloseButton={false} className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Session Expired</DialogTitle>
          <DialogDescription>
            Your session has expired. Please sign in to continue.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="relogin-email">Email</Label>
            <Input
              id="relogin-email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="relogin-password">Password</Label>
            <Input
              id="relogin-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function SidebarNav({
  pathname,
  onNavClick,
}: {
  pathname: string
  onNavClick?: () => void
}) {
  return (
    <nav className="flex flex-col gap-1 px-2 py-4">
      {navLinks.map((link) => (
        <NavLink
          key={link.href}
          href={link.href}
          label={link.label}
          icon={link.icon}
          active={
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href)
          }
          onClick={onNavClick}
        />
      ))}
    </nav>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAuthenticated, isExpired, logout, checkAuth } = useAuth()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const needsLogin = !isAuthenticated || isExpired

  return (
    <div className="flex min-h-screen bg-background">
      {needsLogin && <ReLoginDialog />}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:shrink-0 border-r bg-card">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/admin" className="flex items-center gap-2 font-semibold text-sm">
            <Package className="size-5 text-primary" />
            <span>FlowGuard Shop</span>
          </Link>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto">
          <SidebarNav pathname={pathname} />
        </div>
        <div className="border-t p-3">
          <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <User className="size-4 text-primary" />
            </div>
            <span className="flex-1 truncate text-xs font-medium">
              {user?.name ?? user?.email ?? "Admin"}
            </span>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="flex h-14 items-center border-b bg-card px-4 gap-3 shrink-0">
          {/* Mobile sidebar trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="lg:hidden" />
              }
            >
              <Menu className="size-4" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 p-0" showCloseButton={false}>
              <div className="flex h-14 items-center border-b px-4">
                <Link
                  href="/admin"
                  className="flex items-center gap-2 font-semibold text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  <Package className="size-5 text-primary" />
                  <span>FlowGuard Shop</span>
                </Link>
                <SheetClose
                  render={
                    <Button variant="ghost" size="icon-sm" className="ml-auto" />
                  }
                >
                  <X className="size-4" />
                </SheetClose>
              </div>
              <SidebarNav
                pathname={pathname}
                onNavClick={() => setMobileOpen(false)}
              />
            </SheetContent>
          </Sheet>

          <span className="font-semibold text-sm hidden lg:block">Admin Panel</span>
          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
              <User className="size-3.5" />
              <span>{user?.name ?? user?.email ?? "Admin"}</span>
            </div>
            <Separator orientation="vertical" className="hidden sm:block h-4" />
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="gap-1.5"
            >
              <LogOut className="size-3.5" />
              <span>Logout</span>
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>

      <Toaster />
    </div>
  )
}
