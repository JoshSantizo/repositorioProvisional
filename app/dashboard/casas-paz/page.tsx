"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { getUserSession } from "@/lib/auth"
import { X, Home } from "lucide-react"

interface CasaPaz {
  id: number
  lider: string
  telefono: string
  direccion: string
  referencia: string
  dia: string
  hora: string
  sublideresNombres: string[]
  subliderTelefonos: string[]
  miembros: number
  liderSubred?: string
  red?: "Adultos" | "Jóvenes" | "Adolescentes"
  anfitrion?: {
    nombre: string
    telefono: string
  }
}

export default function CasasPazPage() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [selectedCasa, setSelectedCasa] = useState<CasaPaz | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [filterLiderSubred, setFilterLiderSubred] = useState<string>("all")
  const [filterLider, setFilterLider] = useState<string>("all")
  const [filterRed, setFilterRed] = useState<string>("all")
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [updateData, setUpdateData] = useState({
    liderSubred: "",
    lider: "",
    telefono: "",
    direccion: "",
    referencia: "",
    dia: "",
    hora: "",
    sublideresNombres: [""],
    subliderTelefonos: [""],
    anfitrionNombre: "",
    anfitrionTelefono: "",
    red: "Adultos" as "Adultos" | "Jóvenes" | "Adolescentes",
  })
  const [newCasa, setNewCasa] = useState({
    liderSubred: "",
    lider: "",
    telefono: "",
    direccion: "",
    referencia: "",
    dia: "",
    hora: "",
    sublideresNombres: [""],
    subliderTelefonos: [""],
    anfitrionNombre: "",
    anfitrionTelefono: "",
    red: "Adultos" as "Adultos" | "Jóvenes" | "Adolescentes",
  })

  useEffect(() => {
    const user = getUserSession()
    if (user) {
      setUserRole(user.role)
    }
  }, [])

  const casas: CasaPaz[] = [
    {
      id: 1,
      lider: "Daniela Juarez",
      liderSubred: "Josué Santizo",
      telefono: "5814-7616",
      direccion: "14 av. A, 14-68 Zona 5. S.M.",
      referencia: "En el tercer callejón, después de Tacos El Portón",
      dia: "Miércoles",
      hora: "19:00",
      sublideresNombres: ["Marlen Orozco", "Deyvid López"],
      subliderTelefonos: ["5534-4980", "4411-2233"],
      miembros: 12,
      red: "Adultos",
      anfitrion: {
        nombre: "Juan Pérez",
        telefono: "5555-1234",
      },
    },
    {
      id: 2,
      lider: "Marco Antonio López",
      liderSubred: "Josué Santizo",
      telefono: "4455-6677",
      direccion: "Zona 10, Ciudad de Guatemala",
      referencia: "Frente al parque central",
      dia: "Jueves",
      hora: "18:30",
      sublideresNombres: ["Ana García"],
      subliderTelefonos: ["5555-8899"],
      miembros: 8,
      red: "Jóvenes",
      anfitrion: {
        nombre: "María López",
        telefono: "5555-5678",
      },
    },
    {
      id: 3,
      lider: "Sofia García",
      liderSubred: "Josué Santizo",
      telefono: "3344-5566",
      direccion: "Zona 15, Ciudad",
      referencia: "Edificio azul",
      dia: "Viernes",
      hora: "19:30",
      sublideresNombres: ["Pedro Ramírez", "Laura Torres", "Juan Pérez"],
      subliderTelefonos: ["5555-7788", "3322-4455", "6677-8899"],
      miembros: 15,
      red: "Adolescentes",
      anfitrion: {
        nombre: "Carlos Méndez",
        telefono: "5555-9012",
      },
    },
  ]

  const usuariosLiderSubred = [
    {
      value: "Josué Santizo",
      label: "Josué Santizo",
      lideres: ["Daniela Juarez", "Marco Antonio López", "Sofia García"],
    },
    { value: "Carlos Méndez", label: "Carlos Méndez", lideres: ["Pedro Ramírez"] },
  ]

  const usuariosLider = [
    { value: "Daniela Juarez", label: "Daniela Juarez", liderSubred: "Josué Santizo" },
    { value: "Marco Antonio López", label: "Marco Antonio López", liderSubred: "Josué Santizo" },
    { value: "Sofia García", label: "Sofia García", liderSubred: "Josué Santizo" },
    { value: "Pedro Ramírez", label: "Pedro Ramírez", liderSubred: "Carlos Méndez" },
  ]

  const lideresSubred = [{ value: "Josué Santizo", label: "Josué Santizo" }]
  const lideres = [
    { value: "Daniela Juarez", label: "Daniela Juarez" },
    { value: "Marco Antonio López", label: "Marco Antonio López" },
    { value: "Sofia García", label: "Sofia García" },
  ]

  let filteredCasas = casas
  if (userRole === "Administración") {
    if (filterLiderSubred !== "all") {
      filteredCasas = filteredCasas.filter((c) => c.liderSubred === filterLiderSubred)
    }
    if (filterLider !== "all") {
      filteredCasas = filteredCasas.filter((c) => c.lider === filterLider)
    }
    if (filterRed !== "all") {
      filteredCasas = filteredCasas.filter((c) => c.red === filterRed)
    }
  }

  const getFilteredLideres = (liderSubredValue: string) => {
    if (liderSubredValue === "" || liderSubredValue === "all") {
      return usuariosLider
    }
    const subred = usuariosLiderSubred.find((ls) => ls.value === liderSubredValue)
    if (subred) {
      return usuariosLider.filter((l) => subred.lideres.includes(l.value))
    }
    return usuariosLider
  }

  const clearAllFilters = () => {
    setFilterLiderSubred("all")
    setFilterLider("all")
    setFilterRed("all")
  }

  const handleUpdateCasa = () => {
    console.log("Updating casa:", selectedCasa?.id, updateData)
    setShowUpdateDialog(false)
  }

  const handleCreateCasa = () => {
    console.log("Creating casa:", newCasa)
    setShowCreateDialog(false)
    setNewCasa({
      liderSubred: "",
      lider: "",
      telefono: "",
      direccion: "",
      referencia: "",
      dia: "",
      hora: "",
      sublideresNombres: [""],
      subliderTelefonos: [""],
      anfitrionNombre: "",
      anfitrionTelefono: "",
      red: "Adultos",
    })
  }

  const addSublider = () => {
    setNewCasa({
      ...newCasa,
      sublideresNombres: [...newCasa.sublideresNombres, ""],
      subliderTelefonos: [...newCasa.subliderTelefonos, ""],
    })
  }

  const removeSublider = (index: number) => {
    setNewCasa({
      ...newCasa,
      sublideresNombres: newCasa.sublideresNombres.filter((_, i) => i !== index),
      subliderTelefonos: newCasa.subliderTelefonos.filter((_, i) => i !== index),
    })
  }

  const addUpdateSublider = () => {
    setUpdateData({
      ...updateData,
      sublideresNombres: [...updateData.sublideresNombres, ""],
      subliderTelefonos: [...updateData.subliderTelefonos, ""],
    })
  }

  const removeUpdateSublider = (index: number) => {
    setUpdateData({
      ...updateData,
      sublideresNombres: updateData.sublideresNombres.filter((_, i) => i !== index),
      subliderTelefonos: updateData.subliderTelefonos.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Casas de Paz</h1>
          <p className="text-muted-foreground mt-2">Administra las casas de paz</p>
        </div>
        {userRole === "Administración" && (
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Home className="h-4 w-4 mr-2" />
            Crear Casa de Paz
          </Button>
        )}
      </div>

      {userRole === "Administración" && (
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Filtros</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="flex items-center gap-2 bg-transparent"
              >
                <X className="h-4 w-4" />
                Limpiar Filtros
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div>
                <Label className="text-muted-foreground mb-2 block">Red</Label>
                <Select value={filterRed} onValueChange={setFilterRed}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="Adultos">Adultos</SelectItem>
                    <SelectItem value="Jóvenes">Jóvenes</SelectItem>
                    <SelectItem value="Adolescentes">Adolescentes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="border-border">
          <CardHeader>
            <div className="text-sm text-muted-foreground">Total Casas</div>
            <CardTitle className="text-3xl font-bold text-foreground">{casas.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-accent">Activas</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <div className="text-sm text-muted-foreground">Total Miembros</div>
            <CardTitle className="text-3xl font-bold text-foreground">
              {casas.reduce((sum, casa) => sum + casa.miembros, 0)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-accent">En todas las casas</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <div className="text-sm text-muted-foreground">Promedio</div>
            <CardTitle className="text-3xl font-bold text-foreground">
              {Math.round(casas.reduce((sum, casa) => sum + casa.miembros, 0) / casas.length)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-accent">Miembros por casa</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredCasas.map((casa) => (
          <Card key={casa.id} className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">{casa.lider}</CardTitle>
              <div className="text-sm text-muted-foreground">{casa.direccion}</div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="text-sm text-foreground">{casa.telefono}</span>
              </div>
              <div className="flex gap-2">
                <Dialog open={showDetails && selectedCasa?.id === casa.id} onOpenChange={setShowDetails}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setSelectedCasa(casa)}>
                      Ver Detalles
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">Detalles de Casa de Paz</DialogTitle>
                    </DialogHeader>
                    {selectedCasa && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-semibold text-foreground mb-3">Información del Líder</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {userRole === "Administración" && selectedCasa.liderSubred && (
                              <div className="md:col-span-2">
                                <Label className="text-muted-foreground">Líder de Subred</Label>
                                <p className="text-foreground font-medium">{selectedCasa.liderSubred}</p>
                              </div>
                            )}
                            <div>
                              <Label className="text-muted-foreground">Nombre del Líder</Label>
                              <p className="text-foreground font-medium">{selectedCasa.lider}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Teléfono</Label>
                              <p className="text-foreground">{selectedCasa.telefono}</p>
                            </div>
                            <div className="md:col-span-2">
                              <Label className="text-muted-foreground">Dirección</Label>
                              <p className="text-foreground">{selectedCasa.direccion}</p>
                            </div>
                            <div className="md:col-span-2">
                              <Label className="text-muted-foreground">Referencia</Label>
                              <p className="text-foreground">{selectedCasa.referencia}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Día</Label>
                              <p className="text-foreground">{selectedCasa.dia}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Hora</Label>
                              <p className="text-foreground">{selectedCasa.hora}</p>
                            </div>
                            {selectedCasa.red && (
                              <div className="md:col-span-2">
                                <Label className="text-muted-foreground">Red</Label>
                                <p className="text-foreground font-medium">{selectedCasa.red}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {selectedCasa.anfitrion && (
                          <div>
                            <h3 className="font-semibold text-foreground mb-3">Anfitrión</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-muted-foreground">Nombre</Label>
                                <p className="text-foreground font-medium">{selectedCasa.anfitrion.nombre}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">Teléfono</Label>
                                <p className="text-foreground">{selectedCasa.anfitrion.telefono}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div>
                          <h3 className="font-semibold text-foreground mb-3">Sublíderes</h3>
                          <div className="space-y-3">
                            {selectedCasa.sublideresNombres.map((nombre, index) => (
                              <div key={index} className="p-3 bg-secondary rounded-lg">
                                <p className="text-foreground font-medium">{nombre}</p>
                                <p className="text-sm text-muted-foreground">{selectedCasa.subliderTelefonos[index]}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {userRole !== "Administración" && userRole !== "Lider de Subred" && (
                          <div>
                            <h3 className="font-semibold text-foreground mb-3">Estadísticas</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 bg-accent/10 rounded-lg">
                                <Label className="text-muted-foreground">Miembros</Label>
                                <p className="text-2xl font-bold text-foreground">{selectedCasa.miembros}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                {(userRole === "Administración" || userRole === "Lider de Subred") && (
                  <Dialog open={showUpdateDialog && selectedCasa !== null} onOpenChange={setShowUpdateDialog}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => {
                          setSelectedCasa(casa)
                          setUpdateData({
                            liderSubred: casa.liderSubred || "",
                            lider: casa.lider,
                            telefono: casa.telefono,
                            direccion: casa.direccion,
                            referencia: casa.referencia,
                            dia: casa.dia,
                            hora: casa.hora,
                            sublideresNombres: [...casa.sublideresNombres],
                            subliderTelefonos: [...casa.subliderTelefonos],
                            anfitrionNombre: casa.anfitrion?.nombre || "",
                            anfitrionTelefono: casa.anfitrion?.telefono || "",
                            red: casa.red || "Adultos",
                          })
                        }}
                      >
                        Actualizar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-foreground">Actualizar Casa de Paz</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {userRole === "Administración" && (
                            <>
                              <div className="md:col-span-2">
                                <Label className="text-muted-foreground">Líder de Subred</Label>
                                <Select
                                  value={updateData.liderSubred}
                                  onValueChange={(value) => {
                                    setUpdateData({ ...updateData, liderSubred: value, lider: "" })
                                  }}
                                >
                                  <SelectTrigger className="bg-background border-border mt-1">
                                    <SelectValue placeholder="Selecciona un líder de subred" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {usuariosLiderSubred.map((user) => (
                                      <SelectItem key={user.value} value={user.value}>
                                        {user.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="md:col-span-2">
                                <Label className="text-muted-foreground">Líder</Label>
                                <Select
                                  value={updateData.lider}
                                  onValueChange={(value) => setUpdateData({ ...updateData, lider: value })}
                                >
                                  <SelectTrigger className="bg-background border-border mt-1">
                                    <SelectValue placeholder="Selecciona un líder" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getFilteredLideres(updateData.liderSubred).map((user) => (
                                      <SelectItem key={user.value} value={user.value}>
                                        {user.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </>
                          )}
                          <div>
                            <Label className="text-muted-foreground">Teléfono del Líder</Label>
                            <Input
                              value={updateData.telefono}
                              onChange={(e) => setUpdateData({ ...updateData, telefono: e.target.value })}
                              className="bg-background border-border mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Día</Label>
                            <Select
                              value={updateData.dia}
                              onValueChange={(value) => setUpdateData({ ...updateData, dia: value })}
                            >
                              <SelectTrigger className="bg-background border-border mt-1">
                                <SelectValue placeholder="Selecciona un día" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Lunes">Lunes</SelectItem>
                                <SelectItem value="Martes">Martes</SelectItem>
                                <SelectItem value="Miércoles">Miércoles</SelectItem>
                                <SelectItem value="Jueves">Jueves</SelectItem>
                                <SelectItem value="Viernes">Viernes</SelectItem>
                                <SelectItem value="Sábado">Sábado</SelectItem>
                                <SelectItem value="Domingo">Domingo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Hora</Label>
                            <Input
                              type="time"
                              value={updateData.hora}
                              onChange={(e) => setUpdateData({ ...updateData, hora: e.target.value })}
                              className="bg-background border-border mt-1"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label className="text-muted-foreground">Dirección</Label>
                            <Input
                              value={updateData.direccion}
                              onChange={(e) => setUpdateData({ ...updateData, direccion: e.target.value })}
                              className="bg-background border-border mt-1"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label className="text-muted-foreground">Referencia</Label>
                            <Input
                              value={updateData.referencia}
                              onChange={(e) => setUpdateData({ ...updateData, referencia: e.target.value })}
                              className="bg-background border-border mt-1"
                            />
                          </div>
                          {userRole === "Administración" && (
                            <div className="md:col-span-2">
                              <Label className="text-muted-foreground">Red</Label>
                              <Select
                                value={updateData.red}
                                onValueChange={(value) =>
                                  setUpdateData({ ...updateData, red: value as "Adultos" | "Jóvenes" | "Adolescentes" })
                                }
                              >
                                <SelectTrigger className="bg-background border-border mt-1">
                                  <SelectValue placeholder="Selecciona una red" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Adultos">Adultos</SelectItem>
                                  <SelectItem value="Jóvenes">Jóvenes</SelectItem>
                                  <SelectItem value="Adolescentes">Adolescentes</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="font-semibold text-foreground mb-3">Anfitrión</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-muted-foreground">Nombre</Label>
                              <Input
                                value={updateData.anfitrionNombre}
                                onChange={(e) => setUpdateData({ ...updateData, anfitrionNombre: e.target.value })}
                                className="bg-background border-border mt-1"
                                placeholder="Nombre del anfitrión"
                              />
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Teléfono</Label>
                              <Input
                                type="tel"
                                value={updateData.anfitrionTelefono}
                                onChange={(e) => setUpdateData({ ...updateData, anfitrionTelefono: e.target.value })}
                                className="bg-background border-border mt-1"
                                placeholder="5555-5555"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-muted-foreground">Sublíderes</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addUpdateSublider}>
                              Agregar Sublíder
                            </Button>
                          </div>
                          {updateData.sublideresNombres.map((_, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <Input
                                  type="text"
                                  value={updateData.sublideresNombres[index]}
                                  onChange={(e) => {
                                    const nombres = [...updateData.sublideresNombres]
                                    nombres[index] = e.target.value
                                    setUpdateData({ ...updateData, sublideresNombres: nombres })
                                  }}
                                  className="bg-background border-border"
                                  placeholder="Nombre del sublíder"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  type="tel"
                                  value={updateData.subliderTelefonos[index]}
                                  onChange={(e) => {
                                    const telefonos = [...updateData.subliderTelefonos]
                                    telefonos[index] = e.target.value
                                    setUpdateData({ ...updateData, subliderTelefonos: telefonos })
                                  }}
                                  className="bg-background border-border flex-1"
                                  placeholder="5555-5555"
                                />
                                {updateData.sublideresNombres.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => removeUpdateSublider(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <Button onClick={handleUpdateCasa} className="w-full bg-accent text-accent-foreground">
                          Actualizar Casa de Paz
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Crear Nueva Casa de Paz</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label className="text-muted-foreground">Red</Label>
                <Select
                  value={newCasa.red}
                  onValueChange={(value) =>
                    setNewCasa({ ...newCasa, red: value as "Adultos" | "Jóvenes" | "Adolescentes" })
                  }
                >
                  <SelectTrigger className="bg-background border-border mt-1">
                    <SelectValue placeholder="Selecciona una red" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Adultos">Adultos</SelectItem>
                    <SelectItem value="Jóvenes">Jóvenes</SelectItem>
                    <SelectItem value="Adolescentes">Adolescentes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-muted-foreground">Líder de Subred</Label>
                <Select
                  value={newCasa.liderSubred}
                  onValueChange={(value) => setNewCasa({ ...newCasa, liderSubred: value, lider: "" })}
                >
                  <SelectTrigger className="bg-background border-border mt-1">
                    <SelectValue placeholder="Selecciona un líder de subred" />
                  </SelectTrigger>
                  <SelectContent>
                    {usuariosLiderSubred.map((user) => (
                      <SelectItem key={user.value} value={user.value}>
                        {user.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-muted-foreground">Líder</Label>
                <Select value={newCasa.lider} onValueChange={(value) => setNewCasa({ ...newCasa, lider: value })}>
                  <SelectTrigger className="bg-background border-border mt-1">
                    <SelectValue placeholder="Selecciona un líder" />
                  </SelectTrigger>
                  <SelectContent>
                    {getFilteredLideres(newCasa.liderSubred).map((user) => (
                      <SelectItem key={user.value} value={user.value}>
                        {user.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-muted-foreground">Teléfono del Líder</Label>
                <Input
                  type="tel"
                  value={newCasa.telefono}
                  onChange={(e) => setNewCasa({ ...newCasa, telefono: e.target.value })}
                  className="bg-background border-border mt-1"
                  placeholder="5555-5555"
                />
              </div>
              <div>
                <Label className="text-muted-foreground">Día</Label>
                <Select value={newCasa.dia} onValueChange={(value) => setNewCasa({ ...newCasa, dia: value })}>
                  <SelectTrigger className="bg-background border-border mt-1">
                    <SelectValue placeholder="Selecciona un día" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lunes">Lunes</SelectItem>
                    <SelectItem value="Martes">Martes</SelectItem>
                    <SelectItem value="Miércoles">Miércoles</SelectItem>
                    <SelectItem value="Jueves">Jueves</SelectItem>
                    <SelectItem value="Viernes">Viernes</SelectItem>
                    <SelectItem value="Sábado">Sábado</SelectItem>
                    <SelectItem value="Domingo">Domingo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-muted-foreground">Hora</Label>
                <Input
                  type="time"
                  value={newCasa.hora}
                  onChange={(e) => setNewCasa({ ...newCasa, hora: e.target.value })}
                  className="bg-background border-border mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-muted-foreground">Dirección</Label>
                <Input
                  type="text"
                  value={newCasa.direccion}
                  onChange={(e) => setNewCasa({ ...newCasa, direccion: e.target.value })}
                  className="bg-background border-border mt-1"
                  placeholder="Zona, calle, número"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-muted-foreground">Referencia</Label>
                <Input
                  type="text"
                  value={newCasa.referencia}
                  onChange={(e) => setNewCasa({ ...newCasa, referencia: e.target.value })}
                  className="bg-background border-border mt-1"
                  placeholder="Puntos de referencia"
                />
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3">Anfitrión</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Nombre</Label>
                  <Input
                    value={newCasa.anfitrionNombre}
                    onChange={(e) => setNewCasa({ ...newCasa, anfitrionNombre: e.target.value })}
                    className="bg-background border-border mt-1"
                    placeholder="Nombre del anfitrión"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground">Teléfono</Label>
                  <Input
                    type="tel"
                    value={newCasa.anfitrionTelefono}
                    onChange={(e) => setNewCasa({ ...newCasa, anfitrionTelefono: e.target.value })}
                    className="bg-background border-border mt-1"
                    placeholder="5555-5555"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-muted-foreground">Sublíderes</Label>
                <Button type="button" variant="outline" size="sm" onClick={addSublider}>
                  Agregar Sublíder
                </Button>
              </div>
              {newCasa.sublideresNombres.map((_, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <Input
                      type="text"
                      value={newCasa.sublideresNombres[index]}
                      onChange={(e) => {
                        const nombres = [...newCasa.sublideresNombres]
                        nombres[index] = e.target.value
                        setNewCasa({ ...newCasa, sublideresNombres: nombres })
                      }}
                      className="bg-background border-border"
                      placeholder="Nombre del sublíder"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="tel"
                      value={newCasa.subliderTelefonos[index]}
                      onChange={(e) => {
                        const telefonos = [...newCasa.subliderTelefonos]
                        telefonos[index] = e.target.value
                        setNewCasa({ ...newCasa, subliderTelefonos: telefonos })
                      }}
                      className="bg-background border-border flex-1"
                      placeholder="5555-5555"
                    />
                    {newCasa.sublideresNombres.length > 1 && (
                      <Button type="button" variant="outline" size="icon" onClick={() => removeSublider(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={handleCreateCasa} className="w-full bg-accent text-accent-foreground mt-4">
              Crear Casa de Paz
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
