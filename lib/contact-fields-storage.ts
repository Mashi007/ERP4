// In-memory storage for contact fields and groups when database is not available
interface ContactField {
  id: number
  field_name: string
  field_label: string
  field_type: string
  is_required: boolean
  is_active: boolean
  field_order: number
  default_value?: string
  validation_rules: any
  field_options: any[]
  help_text?: string
  field_group: string
}

interface ContactGroup {
  id: number
  group_name: string
  group_label: string
  group_description?: string
  group_order: number
  is_active: boolean
  is_collapsible: boolean
}

class ContactFieldsStorage {
  private static instance: ContactFieldsStorage
  private fields: ContactField[] = []
  private groups: ContactGroup[] = []
  private nextFieldId = 1
  private nextGroupId = 1

  private constructor() {
    this.initializeDefaults()
  }

  static getInstance(): ContactFieldsStorage {
    if (!ContactFieldsStorage.instance) {
      ContactFieldsStorage.instance = new ContactFieldsStorage()
    }
    return ContactFieldsStorage.instance
  }

  private initializeDefaults() {
    // Default groups
    this.groups = [
      {
        id: 1,
        group_name: "general",
        group_label: "Información General",
        group_description: "Datos básicos del contacto",
        group_order: 1,
        is_active: true,
        is_collapsible: false,
      },
      {
        id: 2,
        group_name: "contact_info",
        group_label: "Información de Contacto",
        group_description: "Medios de comunicación",
        group_order: 2,
        is_active: true,
        is_collapsible: false,
      },
      {
        id: 3,
        group_name: "business",
        group_label: "Información Empresarial",
        group_description: "Datos de la empresa",
        group_order: 3,
        is_active: true,
        is_collapsible: true,
      },
    ]

    // Default fields
    this.fields = [
      {
        id: 1,
        field_name: "name",
        field_label: "Nombre",
        field_type: "text",
        is_required: true,
        is_active: true,
        field_order: 1,
        validation_rules: {},
        field_options: [],
        help_text: "Nombre completo del contacto",
        field_group: "general",
      },
      {
        id: 2,
        field_name: "email",
        field_label: "Email",
        field_type: "email",
        is_required: true,
        is_active: true,
        field_order: 2,
        validation_rules: {},
        field_options: [],
        help_text: "Dirección de correo electrónico",
        field_group: "contact_info",
      },
      {
        id: 3,
        field_name: "phone",
        field_label: "Teléfono",
        field_type: "phone",
        is_required: false,
        is_active: true,
        field_order: 3,
        validation_rules: {},
        field_options: [],
        help_text: "Número de teléfono principal",
        field_group: "contact_info",
      },
      {
        id: 4,
        field_name: "company",
        field_label: "Empresa",
        field_type: "text",
        is_required: false,
        is_active: true,
        field_order: 4,
        validation_rules: {},
        field_options: [],
        help_text: "Nombre de la empresa",
        field_group: "business",
      },
      {
        id: 5,
        field_name: "position",
        field_label: "Cargo",
        field_type: "text",
        is_required: false,
        is_active: true,
        field_order: 5,
        validation_rules: {},
        field_options: [],
        help_text: "Posición en la empresa",
        field_group: "business",
      },
      {
        id: 6,
        field_name: "lead_source",
        field_label: "Fuente del Lead",
        field_type: "select",
        is_required: false,
        is_active: true,
        field_order: 6,
        validation_rules: {},
        field_options: [
          { value: "website", label: "Sitio Web" },
          { value: "referral", label: "Referencia" },
          { value: "social_media", label: "Redes Sociales" },
          { value: "advertising", label: "Publicidad" },
          { value: "event", label: "Evento" },
          { value: "other", label: "Otro" },
        ],
        help_text: "Cómo conoció sobre nosotros",
        field_group: "general",
      },
    ]

    this.nextFieldId = Math.max(...this.fields.map((f) => f.id)) + 1
    this.nextGroupId = Math.max(...this.groups.map((g) => g.id)) + 1
  }

  // Field operations
  getFields(): ContactField[] {
    return [...this.fields]
  }

  getFieldById(id: number): ContactField | undefined {
    return this.fields.find((f) => f.id === id)
  }

  createField(fieldData: Omit<ContactField, "id">): ContactField {
    const newField: ContactField = {
      ...fieldData,
      id: this.nextFieldId++,
      field_order: fieldData.field_order || this.fields.length + 1,
    }
    this.fields.push(newField)
    return newField
  }

  updateField(id: number, fieldData: Partial<ContactField>): ContactField | null {
    const index = this.fields.findIndex((f) => f.id === id)
    if (index === -1) return null

    this.fields[index] = { ...this.fields[index], ...fieldData }
    return this.fields[index]
  }

  deleteField(id: number): boolean {
    const index = this.fields.findIndex((f) => f.id === id)
    if (index === -1) return false

    this.fields.splice(index, 1)
    return true
  }

  // Group operations
  getGroups(): ContactGroup[] {
    const groupsWithCounts = this.groups.map((group) => ({
      ...group,
      field_count: this.fields.filter((f) => f.field_group === group.group_name).length,
    }))
    return groupsWithCounts
  }

  getGroupById(id: number): ContactGroup | undefined {
    return this.groups.find((g) => g.id === id)
  }

  createGroup(groupData: Omit<ContactGroup, "id">): ContactGroup {
    const newGroup: ContactGroup = {
      ...groupData,
      id: this.nextGroupId++,
      group_order: groupData.group_order || this.groups.length + 1,
    }
    this.groups.push(newGroup)
    return newGroup
  }

  updateGroup(id: number, groupData: Partial<ContactGroup>): ContactGroup | null {
    const index = this.groups.findIndex((g) => g.id === id)
    if (index === -1) return null

    this.groups[index] = { ...this.groups[index], ...groupData }
    return this.groups[index]
  }

  deleteGroup(id: number): boolean {
    const group = this.getGroupById(id)
    if (!group) return false

    // Check if group has fields
    const hasFields = this.fields.some((f) => f.field_group === group.group_name)
    if (hasFields) {
      throw new Error("No se puede eliminar un grupo que contiene campos")
    }

    const index = this.groups.findIndex((g) => g.id === id)
    this.groups.splice(index, 1)
    return true
  }

  // Utility methods
  getFieldsByGroup(groupName: string): ContactField[] {
    return this.fields.filter((f) => f.field_group === groupName)
  }

  getActiveFields(): ContactField[] {
    return this.fields.filter((f) => f.is_active)
  }

  reorderFields(fieldIds: number[]): void {
    fieldIds.forEach((id, index) => {
      const field = this.getFieldById(id)
      if (field) {
        field.field_order = index + 1
      }
    })
  }

  reorderGroups(groupIds: number[]): void {
    groupIds.forEach((id, index) => {
      const group = this.getGroupById(id)
      if (group) {
        group.group_order = index + 1
      }
    })
  }
}

export default ContactFieldsStorage
