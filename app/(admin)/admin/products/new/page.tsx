"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useProducts } from "@/lib/store"
import type { Product } from "@/lib/data/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports",
  "Books",
  "Food & Drink",
]

interface FormState {
  title: string
  description: string
  price: string
  category: string
  stock: string
  imageUrl: string
  tags: string
}

interface FormErrors {
  title?: string
  description?: string
  price?: string
  category?: string
  stock?: string
}

const initialForm: FormState = {
  title: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  imageUrl: "",
  tags: "",
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {}
  if (!form.title.trim()) errors.title = "Title is required."
  if (!form.description.trim()) errors.description = "Description is required."
  if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0) {
    errors.price = "A valid price is required."
  }
  if (!form.category) errors.category = "Category is required."
  if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0) {
    errors.stock = "A valid stock quantity is required."
  }
  return errors
}

export default function NewProductPage() {
  const router = useRouter()
  const { addProduct } = useProducts()

  const [form, setForm] = useState<FormState>(initialForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      addProduct({
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category as Product["category"],
        stock: Number(form.stock),
        imageUrl: form.imageUrl.trim() || "",
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      })
      toast.success("Product created successfully.")
      router.push("/admin/products")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon-sm">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Fill in the details to create a new product listing.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g. Wireless Headphones Pro"
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                aria-invalid={!!errors.title}
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <textarea
                id="description"
                placeholder="Describe the product..."
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                rows={4}
                className="flex min-h-[80px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive"
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description}</p>
              )}
            </div>

            {/* Price and Category row */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="price">
                  Price ($) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setField("price", e.target.value)}
                  aria-invalid={!!errors.price}
                />
                {errors.price && (
                  <p className="text-xs text-destructive">{errors.price}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => { if (v !== null) setField("category", v) }}
                >
                  <SelectTrigger
                    id="category"
                    className="w-full"
                    aria-invalid={!!errors.category}
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-xs text-destructive">{errors.category}</p>
                )}
              </div>
            </div>

            {/* Stock */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="stock">
                Stock Quantity <span className="text-destructive">*</span>
              </Label>
              <Input
                id="stock"
                type="number"
                placeholder="0"
                min="0"
                step="1"
                value={form.stock}
                onChange={(e) => setField("stock", e.target.value)}
                aria-invalid={!!errors.stock}
                className="max-w-xs"
              />
              {errors.stock && (
                <p className="text-xs text-destructive">{errors.stock}</p>
              )}
            </div>

            {/* Image URL */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="imageUrl">
                Image URL{" "}
                <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={form.imageUrl}
                onChange={(e) => setField("imageUrl", e.target.value)}
              />
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tags">
                Tags{" "}
                <span className="text-muted-foreground text-xs">
                  (optional, comma-separated)
                </span>
              </Label>
              <Input
                id="tags"
                placeholder="e.g. featured, sale, new-arrival"
                value={form.tags}
                onChange={(e) => setField("tags", e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={loading} className="min-w-24">
                {loading ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Product"
                )}
              </Button>
              <Link href="/admin/products">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
