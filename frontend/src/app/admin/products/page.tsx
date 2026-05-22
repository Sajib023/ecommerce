"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { fetchAdminProducts, createProduct, updateProduct, deleteProduct, uploadImage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";
import { CATEGORIES, Category } from "@/types";
import { Loader2, Plus, Pencil, Trash2, Upload, X, Image as ImageIcon } from "lucide-react";

interface Product {
  id: number;
  title: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  sizes: string[];
  images: string[];
  category: Category;
  is_active: boolean;
  created_at: string;
}

interface ProductFormData {
  title: string;
  description: string;
  price: string;
  stock_quantity: string;
  sizes: string;
  images: string[];
  category: Category;
  is_active: boolean;
}

const INITIAL_FORM_DATA: ProductFormData = {
  title: "",
  description: "",
  price: "",
  stock_quantity: "",
  sizes: "",
  images: [],
  category: "TSHIRT",
  is_active: true,
};

const SIZES = ["S", "M", "L", "XL", "XXL"];

export default function AdminProductsPage() {
  const router = useRouter();
  const { token } = useAuthStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(INITIAL_FORM_DATA);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const loadProducts = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const data = await fetchAdminProducts(token);
      setProducts(data.products || data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (!token) {
      router.push("/admin/login");
    }
  }, [token, router]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData(INITIAL_FORM_DATA);
    setShowDialog(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description || "",
      price: product.price.toString(),
      stock_quantity: product.stock_quantity.toString(),
      sizes: product.sizes.join(", "),
      images: product.images,
      category: product.category || "TSHIRT",
      is_active: product.is_active,
    });
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingProduct(null);
    setFormData(INITIAL_FORM_DATA);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setIsUploading(true);
    try {
      const result = await uploadImage(token, file);
      const imageUrl = result.url || result.file_path;
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl],
      }));
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsSubmitting(true);
    try {
      const sizesArray = formData.sizes
        .split(",")
        .map(s => s.trim().toUpperCase())
        .filter(s => SIZES.includes(s));

      const data = {
        title: formData.title,
        description: formData.description || undefined,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        sizes: sizesArray,
        images: formData.images,
        category: formData.category,
        is_active: formData.is_active,
      };

      if (editingProduct) {
        await updateProduct(token, editingProduct.id, data);
      } else {
        await createProduct(token, data);
      }

      await loadProducts();
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to save product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!token) return;

    try {
      await deleteProduct(token, productId);
      await loadProducts();
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleToggleActive = async (product: Product) => {
    if (!token) return;

    try {
      await updateProduct(token, product.id, { is_active: !product.is_active });
      await loadProducts();
    } catch (error) {
      console.error("Failed to toggle product status:", error);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Products</h1>
          <p className="text-neutral-500 mt-1">
            {products.length} {products.length === 1 ? "product" : "products"} in catalog
          </p>
        </div>

        <Button onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-lg border border-neutral-200 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
            <Package className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No products yet</h3>
          <p className="text-neutral-500 mb-4">Add your first product to get started.</p>
          <Button onClick={handleOpenCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className={`bg-white rounded-lg border overflow-hidden transition-all ${
                product.is_active ? "border-neutral-200" : "border-neutral-300 opacity-60"
              }`}
            >
              {/* Image */}
              <div className="aspect-square bg-neutral-100 relative">
                {product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-neutral-300" />
                  </div>
                )}
                <Badge
                  className={`absolute top-2 right-2 ${
                    product.is_active
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-neutral-500 hover:bg-neutral-600"
                  }`}
                >
                  {product.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-neutral-900 truncate">{product.title}</h3>
                <p className="text-lg font-bold text-neutral-900 mt-1">
                  {formatPrice(product.price)}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {product.sizes.map((size) => (
                    <span
                      key={size}
                      className="text-xs bg-neutral-100 px-2 py-0.5 rounded"
                    >
                      {size}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-neutral-500 mt-2">
                  Stock: {product.stock_quantity}
                </p>
              </div>

              {/* Actions */}
              <div className="border-t border-neutral-200 p-4 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(product)}
                >
                  {product.is_active ? "Deactivate" : "Activate"}
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(product)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteConfirmId(product.id)}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Form Dialog */}
      <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? `Editing ${editingProduct.title}`
                : "Fill in the details to add a new product"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Premium Cotton T-Shirt"
                  required
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Product description..."
                  rows={3}
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData(prev => ({ ...prev, category: value as Category }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">Price (৳) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, price: e.target.value }))
                  }
                  placeholder="2999.00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock_quantity}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))
                  }
                  placeholder="50"
                  required
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="sizes">Sizes * (comma-separated)</Label>
                <Input
                  id="sizes"
                  value={formData.sizes}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, sizes: e.target.value }))
                  }
                  placeholder="S, M, L, XL"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {SIZES.map((size) => (
                    <Button
                      key={size}
                      type="button"
                      variant={
                        formData.sizes
                          .split(",")
                          .map(s => s.trim().toUpperCase())
                          .includes(size)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => {
                        const currentSizes = formData.sizes
                          .split(",")
                          .map(s => s.trim().toUpperCase())
                          .filter(s => SIZES.includes(s));
                        if (currentSizes.includes(size)) {
                          setFormData(prev => ({
                            ...prev,
                            sizes: currentSizes.filter(s => s !== size).join(", "),
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            sizes: [...currentSizes, size].join(", "),
                          }));
                        }
                      }}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="col-span-2">
                <Label>Images</Label>
                <div className="border border-neutral-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row gap-2 mb-4">
                    <div className="relative flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isUploading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isUploading}
                        className="w-full sm:w-auto flex items-center gap-2"
                      >
                        {isUploading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        Upload Image
                      </Button>
                    </div>
                    <div className="flex gap-2 flex-1">
                      <Input
                        type="url"
                        placeholder="Paste image URL (e.g., https://example.com/image.jpg)"
                        className="flex-1"
                        id="image-url"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const input = document.getElementById("image-url") as HTMLInputElement;
                          const url = input?.value?.trim();
                          if (url) {
                            setFormData(prev => ({
                              ...prev,
                              images: [...prev.images, url],
                            }));
                            if (input) input.value = "";
                          }
                        }}
                      >
                        <Plus className="w-4 h-4" />
                        Add URL
                      </Button>
                    </div>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {formData.images.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100">
                          <img
                            src={url}
                            alt={`Image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, is_active: e.target.checked }))
                  }
                  className="w-4 h-4 rounded border-neutral-300"
                />
                <Label htmlFor="is_active">Active (visible on storefront)</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingProduct ? "Update Product" : "Create Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Package(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}