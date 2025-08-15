"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Building, Phone, Globe, MapPin, Save, Upload, ImageIcon } from "lucide-react"

interface CompanyData {
  name: string
  legal_name: string
  tax_id: string
  phone: string
  mobile: string
  email: string
  website: string
  address: string
  city: string
  state: string
  postal_code: string
  country: string
  description: string
  logo_url: string
  facebook: string
  twitter: string
  linkedin: string
  instagram: string
  youtube: string
}

export default function CompanyDataPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: "",
    legal_name: "",
    tax_id: "",
    phone: "",
    mobile: "",
    email: "",
    website: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "México",
    description: "",
    logo_url: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    youtube: "",
  })

  useEffect(() => {
    loadCompanyData()
  }, [])

  const loadCompanyData = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/settings/company")
      if (response.ok) {
        const data = await response.json()
        const sanitizedData = Object.keys(data).reduce((acc, key) => {
          acc[key as keyof CompanyData] = data[key] || ""
          return acc
        }, {} as CompanyData)
        setCompanyData(sanitizedData)
      }
    } catch (error) {
      console.error("Error loading company data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/settings/company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyData),
      })

      if (response.ok) {
        toast({
          title: "Datos guardados",
          description: "La información de la empresa se ha actualizado correctamente.",
        })
      } else {
        throw new Error("Error saving company data")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron guardar los datos de la empresa.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof CompanyData, value: string) => {
    setCompanyData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="space-y-3">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <Building className="mr-3 h-8 w-8 text-blue-600" />
          Datos de la Empresa
        </h1>
        <p className="text-muted-foreground text-lg">
          Configura la información corporativa que se utilizará en campañas, propuestas y comunicaciones
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5 text-blue-600" />
              Información Básica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Comercial *</Label>
              <Input
                id="name"
                value={companyData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="NormaPymes"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="legal_name">Razón Social</Label>
              <Input
                id="legal_name"
                value={companyData.legal_name}
                onChange={(e) => handleInputChange("legal_name", e.target.value)}
                placeholder="NormaPymes S.A. de C.V."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax_id">RFC / Tax ID</Label>
              <Input
                id="tax_id"
                value={companyData.tax_id}
                onChange={(e) => handleInputChange("tax_id", e.target.value)}
                placeholder="NOR123456789"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={companyData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Descripción breve de la empresa..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="mr-2 h-5 w-5 text-green-600" />
              Información de Contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono Fijo</Label>
              <Input
                id="phone"
                value={companyData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+52 55 1234 5678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Teléfono Móvil</Label>
              <Input
                id="mobile"
                value={companyData.mobile}
                onChange={(e) => handleInputChange("mobile", e.target.value)}
                placeholder="+52 55 9876 5432"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Corporativo *</Label>
              <Input
                id="email"
                type="email"
                value={companyData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="contacto@normapymes.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Sitio Web</Label>
              <Input
                id="website"
                value={companyData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="https://www.normapymes.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-red-600" />
              Dirección
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={companyData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Av. Reforma 123, Col. Centro"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  value={companyData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Ciudad de México"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  value={companyData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="CDMX"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postal_code">Código Postal</Label>
                <Input
                  id="postal_code"
                  value={companyData.postal_code}
                  onChange={(e) => handleInputChange("postal_code", e.target.value)}
                  placeholder="06000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">País</Label>
                <Input
                  id="country"
                  value={companyData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  placeholder="México"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Networks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5 text-purple-600" />
              Redes Sociales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={companyData.facebook}
                onChange={(e) => handleInputChange("facebook", e.target.value)}
                placeholder="https://facebook.com/normapymes"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter / X</Label>
              <Input
                id="twitter"
                value={companyData.twitter}
                onChange={(e) => handleInputChange("twitter", e.target.value)}
                placeholder="https://twitter.com/normapymes"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={companyData.linkedin}
                onChange={(e) => handleInputChange("linkedin", e.target.value)}
                placeholder="https://linkedin.com/company/normapymes"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={companyData.instagram}
                onChange={(e) => handleInputChange("instagram", e.target.value)}
                placeholder="https://instagram.com/normapymes"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtube">YouTube</Label>
              <Input
                id="youtube"
                value={companyData.youtube}
                onChange={(e) => handleInputChange("youtube", e.target.value)}
                placeholder="https://youtube.com/@normapymes"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logo Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ImageIcon className="mr-2 h-5 w-5 text-orange-600" />
            Logo Corporativo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            {companyData.logo_url && (
              <img
                src={companyData.logo_url || "/placeholder.svg"}
                alt="Logo"
                className="h-16 w-16 object-contain border rounded"
              />
            )}
            <div className="flex-1">
              <Input
                value={companyData.logo_url}
                onChange={(e) => handleInputChange("logo_url", e.target.value)}
                placeholder="URL del logo corporativo"
              />
              <p className="text-sm text-muted-foreground mt-1">Ingresa la URL del logo o sube una imagen</p>
            </div>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Subir Logo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage Information */}
      <Card>
        <CardHeader>
          <CardTitle>Uso de la Información</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Campañas de Marketing</Badge>
              <span className="text-sm text-muted-foreground">Datos de remitente</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Propuestas Comerciales</Badge>
              <span className="text-sm text-muted-foreground">Información corporativa</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Emails Automáticos</Badge>
              <span className="text-sm text-muted-foreground">Firma y contacto</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="min-w-32">
          {saving ? (
            <>Guardando...</>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Guardar Datos
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
