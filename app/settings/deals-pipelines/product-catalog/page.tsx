"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, FolderTree } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type ProductCategory = {
  id: number
  name: string
  description: string
  parent_id?: number
  is_active: boolean
  products_count: number
}

type Product = {
  id: number
  name: string
  description: string
  sku: string
  category_id: number
  base_price: number
  currency: string
  tax_rate: number
  is_service: boolean
  is_active: boolean
}

const currencies = [
  { value: "EUR", label: "€ Euro" },
  { value: "USD", label: "$ Dólar" },
  { value: "GBP", label: "£ Libra" },
]

export default function ProductCatalogSettingsPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    description: "",
    parent_id: 0,
    is_active: true,
  })
  const [productFormData, setProductFormData] = useState({
    name: "",
    description: "",
    sku: "",
    category_id: 0,
    base_price: 0,
    currency: "EUR",
    tax_rate: 21,
    is_service: false,
    is_active: true,
  })
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    // Simular carga de datos
    const mockCategories: ProductCategory[] = [
      { id: 1, name: "Servicios", description: "Servicios profesionales", is_active: true, products_count: 5 },
      { id: 2, name: "Productos", description: "Productos físicos", is_active: true, products_count: 3 },
      { id: 3, name: "Software", description: "Licencias de software", is_active: true, products_count: 2 },
      {
        id: 4,
        name: "Consultoría",
        description: "Servicios de consultoría",
        parent_id: 1,
        is_active: true,
        products_count: 2,
      },
    ]

    const mockProducts: Product[] = [
      {
        id: 1,
        name: "Consultoría CRM",
        description: "Implementación de sistema CRM",
        sku: "CONS-CRM-001",
        category_id: 4,
        base_price: 2500,
        currency: "EUR",
        tax_rate: 21,
        is_service: true,
        is_active: true,
      },
      {
        id: 2,
        name: "Licencia Software",
        description: "Licencia anual de software",
        sku: "LIC-SW-001",
        category_id: 3,
        base_price: 1200,
        currency: "EUR",
        tax_rate: 21,
        is_service: false,
        is_active: true,
      },
      {
        id: 3,
        name: "Soporte Técnico",
        description: "Soporte técnico mensual",
        sku: "SOP-TEC-001",
        category_id: 1,
        base_price: 300,
        currency: "EUR",
        tax_rate: 21,
        is_service: true,
        is_active: true,
      },
    ]

    setCategories(mockCategories)
    setProducts(mockProducts)
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingCategory) {
        setCategories(
          categories.map((c) =>
            c.id === editingCategory.id
              ? ({
                  ...categoryFormData,
                  id: editingCategory.id,
                  products_count: editingCategory.products_count,
                } as ProductCategory)
              : c,
          ),
        )
        toast({ title: "Categoría actualizada correctamente" })
      } else {
        const newCategory: ProductCategory = {
          ...categoryFormData,
          id: Date.now(),
          products_count: 0,
        } as ProductCategory
        setCategories([...categories, newCategory])
        toast({ title: "Categoría creada correctamente" })
      }

      resetCategoryForm()
      setIsCategoryDialogOpen(false)
    } catch (error) {
      toast({ title: "Error al guardar la categoría", variant: "destructive" })
    }
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingProduct) {
        setProducts(
          products.map((p) =>
            p.id === editingProduct.id ? ({ ...productFormData, id: editingProduct.id } as Product) : p,
          ),
        )
        toast({ title: "Producto actualizado correctamente" })
      } else {
        const newProduct: Product = { ...productFormData, id: Date.now() } as Product
        setProducts([...products, newProduct])
        toast({ title: "Producto creado correctamente" })
      }

      resetProductForm()
      setIsProductDialogOpen(false)
    } catch (error) {
      toast({ title: "Error al guardar el producto", variant: "destructive" })
    }
  }

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: "",
      description: "",
      parent_id: 0,
      is_active: true,
    })
    setEditingCategory(null)
  }

  const resetProductForm = () => {
    setProductFormData({
      name: "",
      description: "",
      sku: "",
      category_id: 0,
      base_price: 0,
      currency: "EUR",
      tax_rate: 21,
      is_service: false,
      is_active: true,
    })
    setEditingProduct(null)
  }

  const getCategoryName = (categoryId: number) => {
    return categories.find((c) => c.id === categoryId)?.name || "Sin categoría"
  }

  const getParentCategories = () => {
    return categories.filter((c) => !c.parent_id)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Catálogo de Productos</h1>
        <p className="text-muted-foreground">Gestiona productos/servicios, precios y variantes para tus negocios</p>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Productos y Servicios</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Productos y Servicios</h2>
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetProductForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Producto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="product_name">Nombre</Label>
                      <Input
                        id="product_name"
                        value={productFormData.name}
                        onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        value={productFormData.sku}
                        onChange={(e) => setProductFormData({ ...productFormData, sku: e.target.value })}
                        placeholder="Código único del producto"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="product_description">Descripción</Label>
                    <Textarea
                      id="product_description"
                      value={productFormData.description}
                      onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Categoría</Label>
                    <Select
                      value={productFormData.category_id.toString()}
                      onValueChange={(value) => setProductFormData({ ...productFormData, category_id: Number(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.parent_id
                              ? `${getCategoryName(category.parent_id)} > ${category.name}`
                              : category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="base_price">Precio Base</Label>
                      <Input
                        id="base_price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={productFormData.base_price}
                        onChange={(e) => setProductFormData({ ...productFormData, base_price: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency">Moneda</Label>
                      <Select
                        value={productFormData.currency}
                        onValueChange={(value) => setProductFormData({ ...productFormData, currency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.value} value={currency.value}>
                              {currency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tax_rate">IVA %</Label>
                      <Input
                        id="tax_rate"
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={productFormData.tax_rate}
                        onChange={(e) => setProductFormData({ ...productFormData, tax_rate: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_service"
                        checked={productFormData.is_service}
                        onCheckedChange={(checked) => setProductFormData({ ...productFormData, is_service: checked })}
                      />
                      <Label htmlFor="is_service">Es un servicio</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={productFormData.is_active}
                        onCheckedChange={(checked) => setProductFormData({ ...productFormData, is_active: checked })}
                      />
                      <Label htmlFor="is_active">Activo</Label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">{editingProduct ? "Actualizar" : "Crear"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-32">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.sku}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getCategoryName(product.category_id)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.is_service ? "default" : "secondary"}>
                          {product.is_service ? "Servicio" : "Producto"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {product.base_price.toFixed(2)} {product.currency}
                          </div>
                          <div className="text-sm text-muted-foreground">IVA: {product.tax_rate}%</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.is_active ? "default" : "secondary"}>
                          {product.is_active ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingProduct(product)
                              setProductFormData({
                                name: product.name,
                                description: product.description,
                                sku: product.sku,
                                category_id: product.category_id,
                                base_price: product.base_price,
                                currency: product.currency,
                                tax_rate: product.tax_rate,
                                is_service: product.is_service,
                                is_active: product.is_active,
                              })
                              setIsProductDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setProducts(products.filter((p) => p.id !== product.id))
                              toast({ title: "Producto eliminado" })
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Categorías</h2>
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetCategoryForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Categoría
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingCategory ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="category_name">Nombre</Label>
                    <Input
                      id="category_name"
                      value={categoryFormData.name}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category_description">Descripción</Label>
                    <Textarea
                      id="category_description"
                      value={categoryFormData.description}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="parent_category">Categoría Padre</Label>
                    <Select
                      value={categoryFormData.parent_id.toString()}
                      onValueChange={(value) => setCategoryFormData({ ...categoryFormData, parent_id: Number(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sin categoría padre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Sin categoría padre</SelectItem>
                        {getParentCategories().map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="category_active"
                      checked={categoryFormData.is_active}
                      onCheckedChange={(checked) => setCategoryFormData({ ...categoryFormData, is_active: checked })}
                    />
                    <Label htmlFor="category_active">Activa</Label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">{editingCategory ? "Actualizar" : "Crear"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Productos</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-32">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <FolderTree className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{category.name}</div>
                            {category.parent_id && (
                              <div className="text-sm text-muted-foreground">
                                Subcategoría de: {getCategoryName(category.parent_id)}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{category.products_count} productos</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={category.is_active ? "default" : "secondary"}>
                          {category.is_active ? "Activa" : "Inactiva"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingCategory(category)
                              setCategoryFormData({
                                name: category.name,
                                description: category.description,
                                parent_id: category.parent_id || 0,
                                is_active: category.is_active,
                              })
                              setIsCategoryDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCategories(categories.filter((c) => c.id !== category.id))
                              toast({ title: "Categoría eliminada" })
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
