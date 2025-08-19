"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { Users, UserPlus, Shield, Eye, Edit, Trash2, Key } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive"
  lastLogin: string
  permissions: string[]
  createdAt: string
}

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
}

const AVAILABLE_PERMISSIONS = [
  { id: "dashboard_view", name: "Ver Dashboard", category: "Dashboard" },
  { id: "contacts_view", name: "Ver Contactos", category: "Contactos" },
  { id: "contacts_create", name: "Crear Contactos", category: "Contactos" },
  { id: "contacts_edit", name: "Editar Contactos", category: "Contactos" },
  { id: "contacts_delete", name: "Eliminar Contactos", category: "Contactos" },
  { id: "deals_view", name: "Ver Oportunidades", category: "Ventas" },
  { id: "deals_create", name: "Crear Oportunidades", category: "Ventas" },
  { id: "deals_edit", name: "Editar Oportunidades", category: "Ventas" },
  { id: "deals_delete", name: "Eliminar Oportunidades", category: "Ventas" },
  { id: "appointments_view", name: "Ver Citas", category: "Citas" },
  { id: "appointments_create", name: "Crear Citas", category: "Citas" },
  { id: "appointments_edit", name: "Editar Citas", category: "Citas" },
  { id: "marketing_view", name: "Ver Marketing", category: "Marketing" },
  { id: "marketing_create", name: "Crear Campañas", category: "Marketing" },
  { id: "reports_view", name: "Ver Reportes", category: "Reportes" },
  { id: "settings_view", name: "Ver Configuración", category: "Configuración" },
  { id: "settings_edit", name: "Editar Configuración", category: "Configuración" },
  { id: "users_manage", name: "Gestionar Usuarios", category: "Administración" },
  { id: "system_admin", name: "Administrador del Sistema", category: "Administración" },
]

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadUsersAndRoles()
  }, [])

  const loadUsersAndRoles = async () => {
    try {
      setLoading(true)

      // Sample data - in real implementation, this would come from API
      const sampleUsers: User[] = [
        {
          id: "1",
          name: "Juan Pérez",
          email: "juan.perez@normapymes.com",
          role: "Administrador",
          status: "active",
          lastLogin: "2025-01-08 14:30",
          permissions: ["system_admin", "users_manage", "settings_edit"],
          createdAt: "2024-12-01",
        },
        {
          id: "2",
          name: "María García",
          email: "maria.garcia@normapymes.com",
          role: "Comercial",
          status: "active",
          lastLogin: "2025-01-08 09:15",
          permissions: ["contacts_view", "contacts_create", "deals_view", "deals_create"],
          createdAt: "2024-12-15",
        },
        {
          id: "3",
          name: "Carlos López",
          email: "carlos.lopez@normapymes.com",
          role: "Comercial",
          status: "inactive",
          lastLogin: "2025-01-05 16:45",
          permissions: ["contacts_view", "deals_view"],
          createdAt: "2025-01-02",
        },
      ]

      const sampleRoles: Role[] = [
        {
          id: "1",
          name: "Administrador",
          description: "Acceso completo al sistema con permisos de administración",
          permissions: ["system_admin", "users_manage", "settings_edit", "settings_view"],
          userCount: 1,
        },
        {
          id: "2",
          name: "Comercial",
          description: "Acceso a funciones de ventas y gestión de clientes",
          permissions: [
            "contacts_view",
            "contacts_create",
            "contacts_edit",
            "deals_view",
            "deals_create",
            "deals_edit",
          ],
          userCount: 2,
        },
        {
          id: "3",
          name: "Marketing",
          description: "Acceso a funciones de marketing y campañas",
          permissions: ["marketing_view", "marketing_create", "contacts_view", "reports_view"],
          userCount: 0,
        },
      ]

      setUsers(sampleUsers)
      setRoles(sampleRoles)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios y roles",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (userData: Partial<User>) => {
    try {
      // In real implementation, this would call an API
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name || "",
        email: userData.email || "",
        role: userData.role || "Comercial",
        status: "active",
        lastLogin: "Nunca",
        permissions: userData.permissions || [],
        createdAt: new Date().toISOString().split("T")[0],
      }

      setUsers((prev) => [...prev, newUser])
      setIsUserDialogOpen(false)
      toast({
        title: "Usuario creado",
        description: `Usuario ${newUser.name} creado exitosamente`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el usuario",
        variant: "destructive",
      })
    }
  }

  const handleCreateRole = async (roleData: Partial<Role>) => {
    try {
      const newRole: Role = {
        id: Date.now().toString(),
        name: roleData.name || "",
        description: roleData.description || "",
        permissions: roleData.permissions || [],
        userCount: 0,
      }

      setRoles((prev) => [...prev, newRole])
      setIsRoleDialogOpen(false)
      toast({
        title: "Rol creado",
        description: `Rol ${newRole.name} creado exitosamente`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el rol",
        variant: "destructive",
      })
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const groupedPermissions = AVAILABLE_PERMISSIONS.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = []
      }
      acc[permission.category].push(permission)
      return acc
    },
    {} as Record<string, typeof AVAILABLE_PERMISSIONS>,
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando usuarios y roles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            Gestión de Usuarios
          </h1>
          <p className="text-gray-600 mt-2">Administra usuarios, roles y permisos del sistema</p>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Usuarios
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Roles y Permisos
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80"
              />
            </div>
            <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Nuevo Usuario
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                  <DialogDescription>Completa la información del nuevo usuario y asigna sus permisos</DialogDescription>
                </DialogHeader>
                <UserForm onSubmit={handleCreateUser} roles={roles} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <p className="text-gray-600">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={user.status === "active" ? "default" : "secondary"}>
                            {user.status === "active" ? "Activo" : "Inactivo"}
                          </Badge>
                          <Badge variant="outline">{user.role}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Último acceso:</p>
                      <p className="font-medium">{user.lastLogin}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Key className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Roles y Permisos</h2>
              <p className="text-gray-600">Gestiona los roles del sistema y sus permisos</p>
            </div>
            <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Nuevo Rol
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Rol</DialogTitle>
                  <DialogDescription>Define un nuevo rol y asigna sus permisos correspondientes</DialogDescription>
                </DialogHeader>
                <RoleForm onSubmit={handleCreateRole} permissions={groupedPermissions} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {roles.map((role) => (
              <Card key={role.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        {role.name}
                      </h3>
                      <p className="text-gray-600">{role.description}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {role.userCount} usuario{role.userCount !== 1 ? "s" : ""} asignado
                        {role.userCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Permisos asignados:</p>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permissionId) => {
                        const permission = AVAILABLE_PERMISSIONS.find((p) => p.id === permissionId)
                        return permission ? (
                          <Badge key={permissionId} variant="secondary" className="text-xs">
                            {permission.name}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// User Form Component
function UserForm({ onSubmit, roles }: { onSubmit: (data: Partial<User>) => void; roles: Role[] }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    permissions: [] as string[],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre completo</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="role">Rol</Label>
        <Select value={formData.role} onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar rol" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.name}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="submit">Crear Usuario</Button>
      </div>
    </form>
  )
}

// Role Form Component
function RoleForm({
  onSubmit,
  permissions,
}: {
  onSubmit: (data: Partial<Role>) => void
  permissions: Record<string, typeof AVAILABLE_PERMISSIONS>
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const togglePermission = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((p) => p !== permissionId)
        : [...prev.permissions, permissionId],
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="roleName">Nombre del rol</Label>
          <Input
            id="roleName"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="roleDescription">Descripción</Label>
          <Input
            id="roleDescription"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <Label>Permisos</Label>
        <div className="mt-2 space-y-4 max-h-96 overflow-y-auto border rounded-lg p-4">
          {Object.entries(permissions).map(([category, categoryPermissions]) => (
            <div key={category}>
              <h4 className="font-medium text-sm text-gray-700 mb-2">{category}</h4>
              <div className="space-y-2 ml-4">
                {categoryPermissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Switch
                      id={permission.id}
                      checked={formData.permissions.includes(permission.id)}
                      onCheckedChange={() => togglePermission(permission.id)}
                    />
                    <Label htmlFor={permission.id} className="text-sm">
                      {permission.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="submit">Crear Rol</Button>
      </div>
    </form>
  )
}
