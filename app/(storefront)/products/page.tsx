"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
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
  "bg-teal-100 text-teal-600",
  "bg-pink-100 text-pink-600",
];

type SortOption = "price-asc" | "price-desc" | "name-asc" | "name-desc";

const ITEMS_PER_PAGE = 6;

function FilterPanel({
  categories,
  selectedCategories,
  onToggleCategory,
  onClearCategories,
}: {
  categories: string[];
  selectedCategories: Set<string>;
  onToggleCategory: (cat: string) => void;
  onClearCategories: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
          Categories
        </h3>
        {selectedCategories.size > 0 && (
          <button
            onClick={onClearCategories}
            className="text-xs text-primary hover:underline"
          >
            Clear
          </button>
        )}
      </div>
      <div className="space-y-2.5">
        {categories.map((cat) => (
          <div key={cat} className="flex items-center gap-2.5">
            <Checkbox
              id={`cat-${cat}`}
              checked={selectedCategories.has(cat)}
              onCheckedChange={() => onToggleCategory(cat)}
            />
            <Label
              htmlFor={`cat-${cat}`}
              className="text-sm cursor-pointer capitalize leading-none"
            >
              {cat}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const { products } = useProducts();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("name-asc");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category).filter(Boolean));
    return Array.from(cats).sort() as string[];
  }, [products]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    if (selectedCategories.size > 0) {
      result = result.filter((p) => p.category && selectedCategories.has(p.category));
    }

    result.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
      }
    });

    return result;
  }, [products, search, selectedCategories, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
    setPage(1);
  }

  function clearCategories() {
    setSelectedCategories(new Set());
    setPage(1);
  }

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleSort(value: string) {
    setSort(value as SortOption);
    setPage(1);
  }

  function getPageNumbers(): (number | "ellipsis-start" | "ellipsis-end")[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "ellipsis-start" | "ellipsis-end")[] = [1];
    if (currentPage > 3) pages.push("ellipsis-start");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("ellipsis-end");
    pages.push(totalPages);
    return pages;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
        <p className="text-muted-foreground mt-1">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
            aria-label="Search products"
          />
          {search && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <Select value={sort} onValueChange={(v) => v && handleSort(v)}>
            <SelectTrigger className="w-[200px]" aria-label="Sort products">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
              <SelectItem value="name-desc">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>

          {/* Mobile filter toggle */}
          <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  className="lg:hidden relative"
                  aria-label="Open filters"
                />
              }
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {selectedCategories.size > 0 && (
                <Badge className="ml-1.5 h-4 min-w-4 text-xs px-1 py-0">
                  {selectedCategories.size}
                </Badge>
              )}
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <Separator className="my-4" />
              <FilterPanel
                categories={categories}
                selectedCategories={selectedCategories}
                onToggleCategory={toggleCategory}
                onClearCategories={clearCategories}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Active filter badges */}
      {selectedCategories.size > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {Array.from(selectedCategories).map((cat) => (
            <Badge
              key={cat}
              variant="secondary"
              className="cursor-pointer capitalize"
              onClick={() => toggleCategory(cat)}
            >
              {cat}
              <X className="ml-1 w-3 h-3" />
            </Badge>
          ))}
          <button
            onClick={clearCategories}
            className="text-xs text-muted-foreground hover:text-foreground underline"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="flex gap-8">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-24 rounded-lg border bg-card p-5">
            <FilterPanel
              categories={categories}
              selectedCategories={selectedCategories}
              onToggleCategory={toggleCategory}
              onClearCategories={clearCategories}
            />
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {paginated.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  handleSearch("");
                  clearCategories();
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginated.map((product, index) => {
                  const colorClass =
                    PRODUCT_COLORS[
                      (products.indexOf(product)) % PRODUCT_COLORS.length
                    ];
                  const initial = product.title.charAt(0).toUpperCase();

                  return (
                    <Card
                      key={product.id}
                      className="group overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col"
                    >
                      {/* Image Placeholder */}
                      <div
                        className={`h-44 flex items-center justify-center text-4xl font-bold ${colorClass}`}
                      >
                        {initial}
                      </div>

                      <CardContent className="p-4 flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors flex-1">
                            {product.title}
                          </h3>
                        </div>
                        {product.category && (
                          <Badge
                            variant="secondary"
                            className="capitalize text-xs mb-2"
                          >
                            {product.category}
                          </Badge>
                        )}
                        <p className="text-lg font-bold text-primary">
                          {formatCurrency(product.price)}
                        </p>
                      </CardContent>

                      <CardFooter className="p-4 pt-0">
                        <Link
                          href={`/products/${product.id}`}
                          className="w-full"
                        >
                          <Button variant="outline" size="sm" className="w-full">
                            View Details
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          aria-disabled={currentPage === 1}
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {getPageNumbers().map((p, i) =>
                        p === "ellipsis-start" || p === "ellipsis-end" ? (
                          <PaginationItem key={`${p}-${i}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={p}>
                            <PaginationLink
                              isActive={p === currentPage}
                              onClick={() => setPage(p)}
                              className="cursor-pointer"
                            >
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                          }
                          aria-disabled={currentPage === totalPages}
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                  <p className="text-center text-xs text-muted-foreground mt-2">
                    Page {currentPage} of {totalPages} &mdash; {filtered.length} products
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
