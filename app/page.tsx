import Link from "next/link";
import { ShoppingBag, LayoutDashboard, ArrowRight, Shield } from "lucide-react";

export default function RootPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full filter blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-5">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-2xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
            FlowGuard Demo
          </h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto">
            A demo e-commerce application for testing FlowGuard regression flows.
            Choose a section to get started.
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Storefront */}
          <Link href="/products" className="group">
            <div className="relative h-full rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 flex flex-col">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-blue-500/20 border border-blue-500/30 mb-6">
                <ShoppingBag className="w-7 h-7 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Shop</h2>
              <p className="text-slate-400 text-sm leading-relaxed flex-1">
                Browse products, manage your cart, and complete checkout flows.
                Full storefront with authentication, search, and order processing.
              </p>
              <div className="flex items-center gap-2 mt-6 text-blue-400 text-sm font-medium">
                Go to Storefront
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-2xl" />
            </div>
          </Link>

          {/* Admin Dashboard */}
          <Link href="/admin" className="group">
            <div className="relative h-full rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 flex flex-col">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-violet-500/20 border border-violet-500/30 mb-6">
                <LayoutDashboard className="w-7 h-7 text-violet-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h2>
              <p className="text-slate-400 text-sm leading-relaxed flex-1">
                Manage products, orders, and users. Inventory control, order
                fulfillment, and analytics at your fingertips.
              </p>
              <div className="flex items-center gap-2 mt-6 text-violet-400 text-sm font-medium">
                Go to Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-violet-500/5 rounded-2xl" />
            </div>
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-center text-slate-600 text-sm mt-10">
          FlowGuard Demo Store &mdash; Built for regression flow testing
        </p>
      </div>
    </div>
  );
}
