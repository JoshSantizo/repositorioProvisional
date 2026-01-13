"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getUserSession } from "@/lib/auth"
import { Calendar, Clock, Plus, Trash2, Edit } from "lucide-react"

interface Evento {
  id: number
  nombre: string
  dia: string
  fecha: string
  hora: string
  descripcion?: string
}

export default function EventosPage() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [eventos, setEventos] = useState<Evento[]>([
    {
      id: 1,
      nombre: "Noches de Avivamiento",
      dia: "Viernes",
      fecha: "09 de Enero, 2026",
      hora: "7:00 PM",
      descripcion: "Estará compartiendo con nosotros el apóstol Juan Pablo Avelar.",
    },
    {
      id: 2,
      nombre: "Noches de Avivamiento",
      dia: "Viernes",
      fecha: "16 de Enero, 2026",
      hora: "7:00 PM",
      descripcion: "Estará compartiendo con nosotros el Profeta Omar Álvarez.",
    },
    {
      id: 3,
      nombre: "Retiro Ministerial",
      dia: "Sábado",
      fecha: "07 de Febrero, 2026",
      hora: "6:00 AM",
      descripcion:
        "Este retiro esta enfocado a todo el liderazgo y miembros de ministerios. El Lugar del retiro es el centro recreativo de iglesia el Rey de Gloria de El Porvenir. EL costo será el valor de un tiempo de comida y se prevee el regreso a las 7 PM.",
    },
  ])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null)
  const [nuevoEvento, setNuevoEvento] = useState({
    nombre: "",
    dia: "",
    fecha: "",
    hora: "",
    descripcion: "",
  })

  useEffect(() => {
    const user = getUserSession()
    if (user) {
      setUserRole(user.role)
    }
  }, [])

  const parseFecha = (fechaStr: string): Date => {
    const meses: { [key: string]: number } = {
      Enero: 0,
      Febrero: 1,
      Marzo: 2,
      Abril: 3,
      Mayo: 4,
      Junio: 5,
      Julio: 6,
      Agosto: 7,
      Septiembre: 8,
      Octubre: 9,
      Noviembre: 10,
      Diciembre: 11,
    }
    const parts = fechaStr.split(" de ")
    const dia = Number.parseInt(parts[0])
    const mes = meses[parts[1]]
    const año = Number.parseInt(parts[2])
    return new Date(año, mes, dia)
  }

  const eventosPorMes = eventos.reduce(
    (acc, evento) => {
      const fecha = parseFecha(evento.fecha)
      const mesAño = `${fecha.toLocaleString("es", { month: "long" })} ${fecha.getFullYear()}`
      if (!acc[mesAño]) {
        acc[mesAño] = []
      }
      acc[mesAño].push(evento)
      return acc
    },
    {} as Record<string, Evento[]>,
  )

  // Sort events within each month by date
  Object.keys(eventosPorMes).forEach((mes) => {
    eventosPorMes[mes].sort((a, b) => {
      const fechaA = parseFecha(a.fecha)
      const fechaB = parseFecha(b.fecha)
      return fechaA.getTime() - fechaB.getTime()
    })
  })

  // Sort months chronologically
  const mesesOrdenados = Object.keys(eventosPorMes).sort((a, b) => {
    const fechaA = parseFecha(eventosPorMes[a][0].fecha)
    const fechaB = parseFecha(eventosPorMes[b][0].fecha)
    return fechaA.getTime() - fechaB.getTime()
  })

  const handleCreateEvento = () => {
    const evento: Evento = {
      id: Date.now(),
      nombre: nuevoEvento.nombre,
      dia: nuevoEvento.dia,
      fecha: nuevoEvento.fecha,
      hora: nuevoEvento.hora,
      descripcion: nuevoEvento.descripcion || undefined,
    }
    setEventos([...eventos, evento])
    setShowCreateDialog(false)
    setNuevoEvento({ nombre: "", dia: "", fecha: "", hora: "", descripcion: "" })
  }

  const handleUpdateEvento = () => {
    if (selectedEvento) {
      setEventos(eventos.map((e) => (e.id === selectedEvento.id ? selectedEvento : e)))
      setShowUpdateDialog(false)
      setSelectedEvento(null)
    }
  }

  const handleDeleteEvento = (id: number) => {
    setEventos(eventos.filter((e) => e.id !== id))
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Eventos</h1>
          <p className="text-muted-foreground mt-2">Próximos eventos de la iglesia</p>
        </div>
        {userRole === "Administración" && (
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear Evento
          </Button>
        )}
      </div>

      {mesesOrdenados.map((mes) => (
        <div key={mes} className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground capitalize">{mes}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {eventosPorMes[mes].map((evento) => (
              <Card key={evento.id} className="border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">{evento.nombre}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-accent" />
                    <span className="text-sm text-foreground">
                      {evento.dia}, {evento.fecha}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-accent" />
                    <span className="text-sm text-foreground">{evento.hora}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    {evento.descripcion && (
                      <Dialog
                        open={showDetailsDialog && selectedEvento?.id === evento.id}
                        onOpenChange={setShowDetailsDialog}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1 bg-transparent"
                            onClick={() => setSelectedEvento(evento)}
                          >
                            Leer Más
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-border">
                          <DialogHeader>
                            <DialogTitle className="text-foreground">{selectedEvento?.nombre}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label className="text-muted-foreground">Fecha y Hora</Label>
                              <p className="text-foreground">
                                {selectedEvento?.dia}, {selectedEvento?.fecha} - {selectedEvento?.hora}
                              </p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Descripción</Label>
                              <p className="text-foreground">{selectedEvento?.descripcion}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    {userRole === "Administración" && (
                      <>
                        <Dialog
                          open={showUpdateDialog && selectedEvento?.id === evento.id}
                          onOpenChange={setShowUpdateDialog}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => setSelectedEvento({ ...evento })}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-card border-border">
                            <DialogHeader>
                              <DialogTitle className="text-foreground">Actualizar Evento</DialogTitle>
                            </DialogHeader>
                            {selectedEvento && (
                              <div className="space-y-4">
                                <div>
                                  <Label>Nombre del Evento</Label>
                                  <Input
                                    value={selectedEvento.nombre}
                                    onChange={(e) => setSelectedEvento({ ...selectedEvento, nombre: e.target.value })}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Día</Label>
                                    <Input
                                      value={selectedEvento.dia}
                                      onChange={(e) => setSelectedEvento({ ...selectedEvento, dia: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <Label>Hora</Label>
                                    <Input
                                      value={selectedEvento.hora}
                                      onChange={(e) => setSelectedEvento({ ...selectedEvento, hora: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label>Fecha</Label>
                                  <Input
                                    value={selectedEvento.fecha}
                                    onChange={(e) => setSelectedEvento({ ...selectedEvento, fecha: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label>Descripción</Label>
                                  <Textarea
                                    value={selectedEvento.descripcion || ""}
                                    onChange={(e) =>
                                      setSelectedEvento({ ...selectedEvento, descripcion: e.target.value })
                                    }
                                    rows={4}
                                  />
                                </div>
                                <Button
                                  onClick={handleUpdateEvento}
                                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                                >
                                  Guardar Cambios
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteEvento(evento.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {userRole === "Administración" && (
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Crear Nuevo Evento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nombre del Evento</Label>
                <Input
                  value={nuevoEvento.nombre}
                  onChange={(e) => setNuevoEvento({ ...nuevoEvento, nombre: e.target.value })}
                  placeholder="Ej: Retiro de Jóvenes"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Día</Label>
                  <Input
                    value={nuevoEvento.dia}
                    onChange={(e) => setNuevoEvento({ ...nuevoEvento, dia: e.target.value })}
                    placeholder="Ej: Sábado"
                  />
                </div>
                <div>
                  <Label>Hora</Label>
                  <Input
                    value={nuevoEvento.hora}
                    onChange={(e) => setNuevoEvento({ ...nuevoEvento, hora: e.target.value })}
                    placeholder="Ej: 9:00 AM"
                  />
                </div>
              </div>
              <div>
                <Label>Fecha</Label>
                <Input
                  value={nuevoEvento.fecha}
                  onChange={(e) => setNuevoEvento({ ...nuevoEvento, fecha: e.target.value })}
                  placeholder="Ej: 15 de Febrero, 2026"
                />
              </div>
              <div>
                <Label>Descripción (Opcional)</Label>
                <Textarea
                  value={nuevoEvento.descripcion}
                  onChange={(e) => setNuevoEvento({ ...nuevoEvento, descripcion: e.target.value })}
                  placeholder="Información adicional del evento..."
                  rows={4}
                />
              </div>
              <Button
                onClick={handleCreateEvento}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Crear Evento
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
