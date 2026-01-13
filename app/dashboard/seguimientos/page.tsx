"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { getUserSession } from "@/lib/auth"
import { X, Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface Seguimiento {
  id: number
  nombre: string
  telefono: string
  direccion: string
  referencia: string
  invitadoPor: string
  iglesia: string
  asisteIglesia: boolean
  tipo: "Amigo" | "Miembro"
  decision: "Ninguna" | "Convertido" | "Reconciliado"
  fecha: string
  liderSubred: string
  lider: string
  notas: Array<{
    id: number
    fecha: string
    autor: string
    contenido: string
  }>
}

export default function SeguimientosPage() {
  const [seguimientos, setSeguimientos] = useState<Seguimiento[]>([
    {
      id: 1,
      nombre: "Pedro Ramírez",
      telefono: "5555-1234",
      direccion: "Zona 10, Ciudad",
      referencia: "Cerca del parque central",
      invitadoPor: "María López",
      iglesia: "Rey Eterno",
      asisteIglesia: true,
      tipo: "Amigo",
      decision: "Convertido",
      fecha: "2024-01-15",
      liderSubred: "sublider1",
      lider: "lider1",
      notas: [
        {
          id: 1,
          fecha: "2024-01-20",
          autor: "Daniela Juárez",
          contenido: "Primera llamada realizada, se sintiío muy feliz en el servicio",
        },
        {
          id: 2,
          fecha: "2024-01-22",
          autor: "Briana de León",
          contenido: "Asistió al servicio, mostró interés en asistir a una casa de paz, ya se programó la visita",
        },
      ],
    },
    {
      id: 2,
      nombre: "Laura Torres",
      telefono: "5555-5678",
      direccion: "Zona 15, Ciudad",
      referencia: "Edificio azul",
      invitadoPor: "Carlos Méndez",
      iglesia: "",
      asisteIglesia: false,
      tipo: "Amigo",
      decision: "Ninguna",
      fecha: "2024-01-14",
      liderSubred: "sublider1",
      lider: "lider2",
      notas: [
        {
          id: 1,
          fecha: "2024-01-18",
          autor: "Josué Santizo",
          contenido: "Se realizó la visita y acepto a Jesus. Se recogerá para llevarlo al servicio esta semana",
        },
      ],
    },
    {
      id: 3,
      nombre: "Juan Pérez",
      telefono: "5555-9999",
      direccion: "Zona 11, Ciudad",
      referencia: "Casa roja",
      invitadoPor: "Ana García",
      iglesia: "",
      asisteIglesia: false,
      tipo: "Miembro",
      decision: "Reconciliado",
      fecha: "2024-01-20",
      liderSubred: "sublider1",
      lider: "lider3",
      notas: [],
    },
  ])

  const [selectedSeguimiento, setSelectedSeguimiento] = useState<Seguimiento | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showNotas, setShowNotas] = useState(false)
  const [newNota, setNewNota] = useState("")
  const [userRole, setUserRole] = useState<string | null>(null)
  const [filterLider, setFilterLider] = useState<string>("all")
  const [filterLiderSubred, setFilterLiderSubred] = useState<string>("all")
  const [showNewSeguimiento, setShowNewSeguimiento] = useState(false)

  // New seguimiento form states
  const [newSeguimientoForm, setNewSeguimientoForm] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
    referencia: "",
    invitadoPor: "",
    asisteIglesia: false,
    iglesia: "",
    tipo: "Amigo" as "Amigo" | "Miembro",
    decision: "Ninguna" as "Ninguna" | "Convertido" | "Reconciliado",
    liderSubred: "",
    lider: "",
  })

  useEffect(() => {
    const user = getUserSession()
    if (user) {
      setUserRole(user.role)
    }
  }, [])

  const lideres = [
    { value: "lider1", label: "Daniela Juarez" },
    { value: "lider2", label: "Alejandro Miranda" },
    { value: "lider3", label: "Samuel López" },
  ]

  const lideresSubred = [{ value: "sublider1", label: "Josué Santizo" }]

  const getLideresForSubred = (subred: string) => {
    if (subred === "sublider1") {
      return [
        { value: "lider1", label: "Daniela Juarez" },
        { value: "lider2", label: "Alejandro Miranda" },
        { value: "lider3", label: "Samuel López" },
      ]
    }
    return []
  }

  const clearAllFilters = () => {
    setFilterLider("all")
    setFilterLiderSubred("all")
  }

  let filteredSeguimientos = seguimientos

  if (userRole === "Administración") {
    if (filterLiderSubred !== "all") {
      filteredSeguimientos = filteredSeguimientos.filter((s) => s.liderSubred === filterLiderSubred)
    }
    if (filterLider !== "all") {
      filteredSeguimientos = filteredSeguimientos.filter((s) => s.lider === filterLider)
    }
  } else if (userRole === "Lider de Subred") {
    if (filterLider !== "all") {
      filteredSeguimientos = filteredSeguimientos.filter((s) => s.lider === filterLider)
    }
  }

  const handleAddNota = () => {
    if (!selectedSeguimiento || !newNota.trim()) return

    const updatedSeguimiento = {
      ...selectedSeguimiento,
      notas: [
        ...selectedSeguimiento.notas,
        {
          id: selectedSeguimiento.notas.length + 1,
          fecha: new Date().toISOString().split("T")[0],
          autor: "Usuario Actual",
          contenido: newNota,
        },
      ],
    }

    setSeguimientos(seguimientos.map((s) => (s.id === selectedSeguimiento.id ? updatedSeguimiento : s)))
    setSelectedSeguimiento(updatedSeguimiento)
    setNewNota("")
  }

  const handleSubmitNewSeguimiento = () => {
    const nuevoSeguimiento: Seguimiento = {
      id: Math.max(...seguimientos.map((s) => s.id), 0) + 1,
      nombre: newSeguimientoForm.nombre,
      telefono: newSeguimientoForm.telefono,
      direccion: newSeguimientoForm.direccion,
      referencia: newSeguimientoForm.referencia,
      invitadoPor: newSeguimientoForm.invitadoPor,
      iglesia: newSeguimientoForm.iglesia,
      asisteIglesia: newSeguimientoForm.asisteIglesia,
      tipo: newSeguimientoForm.tipo,
      decision: newSeguimientoForm.decision,
      fecha: new Date().toISOString().split("T")[0],
      liderSubred: newSeguimientoForm.liderSubred,
      lider: newSeguimientoForm.lider,
      notas: [],
    }

    // Add to beginning of array to show most recent first
    setSeguimientos([nuevoSeguimiento, ...seguimientos])
    setShowNewSeguimiento(false)

    // Reset form
    setNewSeguimientoForm({
      nombre: "",
      telefono: "",
      direccion: "",
      referencia: "",
      invitadoPor: "",
      asisteIglesia: false,
      iglesia: "",
      tipo: "Amigo",
      decision: "Ninguna",
      liderSubred: "",
      lider: "",
    })
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Seguimientos</h1>
          <p className="text-muted-foreground mt-2">Reporta el seguimiento de las visitas y el fruto</p>
        </div>
        {userRole === "Administración" && (
          <Dialog open={showNewSeguimiento} onOpenChange={setShowNewSeguimiento}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 w-full md:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Seguimiento
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-foreground">Nuevo Seguimiento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      value={newSeguimientoForm.nombre}
                      onChange={(e) => setNewSeguimientoForm({ ...newSeguimientoForm, nombre: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={newSeguimientoForm.telefono}
                      onChange={(e) => setNewSeguimientoForm({ ...newSeguimientoForm, telefono: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      value={newSeguimientoForm.direccion}
                      onChange={(e) => setNewSeguimientoForm({ ...newSeguimientoForm, direccion: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="referencia">Referencia</Label>
                    <Input
                      id="referencia"
                      value={newSeguimientoForm.referencia}
                      onChange={(e) => setNewSeguimientoForm({ ...newSeguimientoForm, referencia: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="invitadoPor">Invitado por</Label>
                    <Input
                      id="invitadoPor"
                      value={newSeguimientoForm.invitadoPor}
                      onChange={(e) => setNewSeguimientoForm({ ...newSeguimientoForm, invitadoPor: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="asisteIglesia"
                      checked={newSeguimientoForm.asisteIglesia}
                      onCheckedChange={(checked) =>
                        setNewSeguimientoForm({ ...newSeguimientoForm, asisteIglesia: checked as boolean })
                      }
                    />
                    <Label htmlFor="asisteIglesia">Asiste a una iglesia</Label>
                  </div>
                  {newSeguimientoForm.asisteIglesia && (
                    <div className="md:col-span-2">
                      <Label htmlFor="iglesia">Nombre de la iglesia</Label>
                      <Input
                        id="iglesia"
                        value={newSeguimientoForm.iglesia}
                        onChange={(e) => setNewSeguimientoForm({ ...newSeguimientoForm, iglesia: e.target.value })}
                        className="bg-secondary border-border"
                      />
                    </div>
                  )}
                  <div>
                    <Label>Tipo</Label>
                    <Select
                      value={newSeguimientoForm.tipo}
                      onValueChange={(value: "Amigo" | "Miembro") =>
                        setNewSeguimientoForm({ ...newSeguimientoForm, tipo: value })
                      }
                    >
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Amigo">Amigo</SelectItem>
                        <SelectItem value="Miembro">Miembro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Decisión</Label>
                    <Select
                      value={newSeguimientoForm.decision}
                      onValueChange={(value: "Ninguna" | "Convertido" | "Reconciliado") =>
                        setNewSeguimientoForm({ ...newSeguimientoForm, decision: value })
                      }
                    >
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ninguna">Ninguna</SelectItem>
                        <SelectItem value="Convertido">Convertido</SelectItem>
                        <SelectItem value="Reconciliado">Reconciliado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Líder de Subred</Label>
                    <Select
                      value={newSeguimientoForm.liderSubred}
                      onValueChange={(value) => {
                        setNewSeguimientoForm({ ...newSeguimientoForm, liderSubred: value, lider: "" })
                      }}
                    >
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Selecciona..." />
                      </SelectTrigger>
                      <SelectContent>
                        {lideresSubred.map((ls) => (
                          <SelectItem key={ls.value} value={ls.value}>
                            {ls.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Líder</Label>
                    <Select
                      value={newSeguimientoForm.lider}
                      onValueChange={(value) => setNewSeguimientoForm({ ...newSeguimientoForm, lider: value })}
                      disabled={!newSeguimientoForm.liderSubred}
                    >
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Selecciona..." />
                      </SelectTrigger>
                      <SelectContent>
                        {getLideresForSubred(newSeguimientoForm.liderSubred).map((lider) => (
                          <SelectItem key={lider.value} value={lider.value}>
                            {lider.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  onClick={handleSubmitNewSeguimiento}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Crear Seguimiento
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Lista de Seguimientos</CardTitle>
            {(userRole === "Lider de Subred" || userRole === "Administración") && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="flex items-center gap-2 bg-transparent"
              >
                <X className="h-4 w-4" />
                Limpiar Filtros
              </Button>
            )}
          </div>
          {userRole === "Administración" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label className="text-muted-foreground mb-2 block">Líder de Subred</Label>
                <Select value={filterLiderSubred} onValueChange={setFilterLiderSubred}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {lideresSubred.map((ls) => (
                      <SelectItem key={ls.value} value={ls.value}>
                        {ls.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-muted-foreground mb-2 block">Líder</Label>
                <Select value={filterLider} onValueChange={setFilterLider}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {lideres.map((lider) => (
                      <SelectItem key={lider.value} value={lider.value}>
                        {lider.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          {userRole === "Lider de Subred" && (
            <div className="mt-4">
              <Label className="text-muted-foreground mb-2 block">Filtrar por Líder</Label>
              <Select value={filterLider} onValueChange={setFilterLider}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Todos los líderes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los líderes</SelectItem>
                  {lideres.map((lider) => (
                    <SelectItem key={lider.value} value={lider.value}>
                      {lider.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredSeguimientos.length} {filteredSeguimientos.length === 1 ? "seguimiento" : "seguimientos"}
            </p>
          </div>
          <div className="space-y-4">
            {filteredSeguimientos.map((seguimiento) => (
              <div
                key={seguimiento.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-border rounded-lg gap-3"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{seguimiento.nombre}</h3>
                  <span className="text-sm text-muted-foreground">{seguimiento.fecha}</span>
                </div>
                <div className="flex gap-2">
                  {userRole === "Administración" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950 bg-transparent"
                      onClick={() => {
                        setSeguimientos(seguimientos.filter((s) => s.id !== seguimiento.id))
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Dialog
                    open={showDetails && selectedSeguimiento?.id === seguimiento.id}
                    onOpenChange={setShowDetails}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 md:flex-initial bg-transparent"
                        onClick={() => setSelectedSeguimiento(seguimiento)}
                      >
                        Ver Detalles
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-foreground">
                          Seguimiento - {selectedSeguimiento?.nombre}
                        </DialogTitle>
                      </DialogHeader>
                      {selectedSeguimiento && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="font-semibold text-foreground mb-3">Información de la Visita</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-muted-foreground">Nombre</Label>
                                <p className="text-foreground">{selectedSeguimiento.nombre}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">Teléfono</Label>
                                <p className="text-foreground">{selectedSeguimiento.telefono}</p>
                              </div>
                              <div className="md:col-span-2">
                                <Label className="text-muted-foreground">Dirección</Label>
                                <p className="text-foreground">{selectedSeguimiento.direccion}</p>
                              </div>
                              <div className="md:col-span-2">
                                <Label className="text-muted-foreground">Referencia</Label>
                                <p className="text-foreground">{selectedSeguimiento.referencia}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">Invitado por</Label>
                                <p className="text-foreground">{selectedSeguimiento.invitadoPor}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">Asiste a una iglesia</Label>
                                <p className="text-foreground">{selectedSeguimiento.asisteIglesia ? "Sí" : "No"}</p>
                              </div>
                              {selectedSeguimiento.asisteIglesia && (
                                <div className="md:col-span-2">
                                  <Label className="text-muted-foreground">Nombre de la iglesia</Label>
                                  <p className="text-foreground">{selectedSeguimiento.iglesia}</p>
                                </div>
                              )}
                              <div>
                                <Label className="text-muted-foreground">Tipo</Label>
                                <p className="text-foreground">{selectedSeguimiento.tipo}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">Decisión</Label>
                                <p className="text-foreground">{selectedSeguimiento.decision}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Dialog open={showNotas && selectedSeguimiento?.id === seguimiento.id} onOpenChange={setShowNotas}>
                    <DialogTrigger asChild>
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1 md:flex-initial bg-accent text-accent-foreground hover:bg-accent/90"
                        onClick={() => setSelectedSeguimiento(seguimiento)}
                      >
                        Actualizar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-foreground">
                          Notas de Seguimiento - {selectedSeguimiento?.nombre}
                        </DialogTitle>
                      </DialogHeader>
                      {selectedSeguimiento && (
                        <div className="space-y-4">
                          <div className="space-y-3">
                            {selectedSeguimiento.notas.map((nota) => (
                              <div key={nota.id} className="p-4 border border-border rounded-lg bg-secondary/50">
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-sm font-medium text-foreground">{nota.autor}</span>
                                  <span className="text-xs text-muted-foreground">{nota.fecha}</span>
                                </div>
                                <p className="text-sm text-foreground">{nota.contenido}</p>
                              </div>
                            ))}
                          </div>

                          <div className="space-y-3 pt-4 border-t border-border">
                            <Label htmlFor="newNota" className="text-foreground">
                              Agregar Nueva Nota
                            </Label>
                            <Textarea
                              id="newNota"
                              placeholder="Escribe tu nota aquí..."
                              value={newNota}
                              onChange={(e) => setNewNota(e.target.value)}
                              className="bg-secondary border-border text-foreground min-h-24"
                            />
                            <Button
                              onClick={handleAddNota}
                              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                            >
                              Guardar Nota
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
