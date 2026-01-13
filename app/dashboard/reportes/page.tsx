"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getUserSession } from "@/lib/auth"
import { X, Search, ChevronLeft, ChevronRight } from "lucide-react"

interface Miembro {
  id: number
  nombre: string
  asiste: boolean
}

interface Visita {
  id: number
  nombre: string
  telefono: string
  direccion: string
  referencia: string
  invitadoPor: string
  asisteIglesia: boolean
  nombreIglesia?: string
  tipo: "Amigo" | "Miembro"
  estado: "Ninguna" | "Convertido" | "Reconciliado"
}

interface Reporte {
  id: number
  fecha: string
  asistenciaTotal: number
  amigosFruto: number
  ofrendaTotal: number
  lider: string
  mes: string
  año: string
}

export default function ReportesPage() {
  const [miembros, setMiembros] = useState<Miembro[]>([
    { id: 1, nombre: "Madelyn Andrea Velásquez López", asiste: false },
    { id: 2, nombre: "Daniela Esther Juárez Mazariegos", asiste: false },
    { id: 3, nombre: "Braulio Josué Bautista Colop", asiste: false },
    { id: 4, nombre: "Deyvid Omar López Miranda", asiste: false },
    { id: 5, nombre: "Mynor Yobany López Tojil", asiste: false },
    { id: 6, nombre: "Gerberth Leonel López Tojil", asiste: false },
    { id: 7, nombre: "Séfora Consuelo Ortiz Roblero", asiste: false },
    { id: 8, nombre: "Marlen Nicolle Orozco Ochoa", asiste: false },
  ])

  const [visitas, setVisitas] = useState<Visita[]>([])
  const [addVisitaOpen, setAddVisitaOpen] = useState(false)
  const [ubicacionEnviada, setUbicacionEnviada] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)

  // Ofrendas
  const [ofrendas, setOfrendas] = useState("")
  const [diezmos, setDiezmos] = useState("")
  const [pactos, setPactos] = useState("")
  const [primicias, setPrimicias] = useState("")
  const [metodoEntrega, setMetodoEntrega] = useState<"Transferencia" | "Servicio">("Servicio")

  // Comentarios
  const [comentarios, setComentarios] = useState("")

  // Nueva visita
  const [nuevaVisita, setNuevaVisita] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
    referencia: "",
    invitadoPor: "",
    asisteIglesia: false,
    nombreIglesia: "",
    tipo: "Amigo" as "Amigo" | "Miembro",
    estado: "Ninguna" as "Ninguna" | "Convertido" | "Reconciliado",
  })

  // Role state
  const [userRole, setUserRole] = useState<string | null>(null)

  const [fechaReporte, setFechaReporte] = useState(new Date().toISOString().split("T")[0])
  const [grupos, setGrupos] = useState({
    apostol: 0,
    profeta: 0,
    pastores: 0,
    ancianos: 0,
    diaconos: 0,
    lideres: 0,
    servidores: 0,
    parqueo: 0,
    ninos: 0,
    maestrosNinos: 0,
    alabanza: 0,
    danza: 0,
    mediosTV: 0,
    pueblo: 0,
  })

  const totalAsistencia = Object.values(grupos).reduce((sum, val) => sum + val, 0)

  // Filter states for Lider de Subred
  const [filterLider, setFilterLider] = useState("all")
  const [selectedMonth, setSelectedMonth] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [reportes, setReportes] = useState<Reporte[]>([])

  const [selectedLiderEval, setSelectedLiderEval] = useState("")
  const [checklistItems, setChecklistItems] = useState({
    reunion: false,
    asistencia: false,
    consolidacion: false,
    visitasSemana: false,
    visitasTotales: false,
    oracion: false,
    alabanza: false,
    adoracion: false,
    delega: false,
    comparteTema: false,
    preparaTema: false,
    usoTiempo: false,
    ministraOfrendas: false,
    llamado: false,
    anuncios: false,
  })
  const [comentariosEval, setComentariosEval] = useState("")

  const meses = [
    { value: "01", label: "Enero" },
    { value: "02", label: "Febrero" },
    { value: "03", label: "Marzo" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Mayo" },
    { value: "06", label: "Junio" },
    { value: "07", label: "Julio" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ]

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i)

  const lideres = [
    { id: 1, nombre: "Daniela Juarez" },
    { id: 2, nombre: "Alejandro Miranda" },
    { id: 3, nombre: "Samuel López" },
  ]

  // Dummy data for reportes (replace with actual data fetching)
  useEffect(() => {
    setReportes([
      {
        id: 1,
        fecha: "2023-10-26",
        asistenciaTotal: 50,
        amigosFruto: 5,
        ofrendaTotal: 1500.75,
        lider: "Daniela Juarez",
        mes: "10",
        año: "2023",
      },
      {
        id: 2,
        fecha: "2023-11-02",
        asistenciaTotal: 65,
        amigosFruto: 8,
        ofrendaTotal: 2100.5,
        lider: "Alejandro Miranda",
        mes: "11",
        año: "2023",
      },
      {
        id: 3,
        fecha: "2023-11-09",
        asistenciaTotal: 58,
        amigosFruto: 3,
        ofrendaTotal: 1850.0,
        lider: "Samuel López",
        mes: "11",
        año: "2023",
      },
      {
        id: 4,
        fecha: "2023-11-16",
        asistenciaTotal: 70,
        amigosFruto: 10,
        ofrendaTotal: 2500.0,
        lider: "Daniela Juarez",
        mes: "11",
        año: "2023",
      },
      {
        id: 5,
        fecha: "2023-11-23",
        asistenciaTotal: 62,
        amigosFruto: 7,
        ofrendaTotal: 1950.25,
        lider: "Alejandro Miranda",
        mes: "11",
        año: "2023",
      },
      {
        id: 6,
        fecha: "2023-11-30",
        asistenciaTotal: 75,
        amigosFruto: 12,
        ofrendaTotal: 2800.0,
        lider: "Samuel López",
        mes: "11",
        año: "2023",
      },
      {
        id: 7,
        fecha: "2023-12-07",
        asistenciaTotal: 80,
        amigosFruto: 15,
        ofrendaTotal: 3000.0,
        lider: "Daniela Juarez",
        mes: "12",
        año: "2023",
      },
      {
        id: 8,
        fecha: "2024-01-04",
        asistenciaTotal: 70,
        amigosFruto: 9,
        ofrendaTotal: 2200.0,
        lider: "Alejandro Miranda",
        mes: "01",
        año: "2024",
      },
    ])
  }, [])

  useEffect(() => {
    const user = getUserSession()
    if (user) {
      setUserRole(user.role)
    }
  }, [])

  const handleAsistenciaChange = (id: number) => {
    setMiembros(miembros.map((m) => (m.id === id ? { ...m, asiste: !m.asiste } : m)))
  }

  const handleAgregarVisita = () => {
    const visita: Visita = {
      id: Date.now(),
      nombre: nuevaVisita.nombre,
      telefono: nuevaVisita.telefono,
      direccion: nuevaVisita.direccion,
      referencia: nuevaVisita.referencia,
      invitadoPor: nuevaVisita.invitadoPor,
      asisteIglesia: nuevaVisita.asisteIglesia,
      nombreIglesia: nuevaVisita.asisteIglesia ? nuevaVisita.nombreIglesia : undefined,
      tipo: nuevaVisita.tipo,
      estado: nuevaVisita.estado,
    }
    setVisitas([...visitas, visita])
    setAddVisitaOpen(false)
    setNuevaVisita({
      nombre: "",
      telefono: "",
      direccion: "",
      referencia: "",
      invitadoPor: "",
      asisteIglesia: false,
      nombreIglesia: "",
      tipo: "Amigo",
      estado: "Ninguna",
    })
  }

  const handleEnviarUbicacion = () => {
    setUbicacionEnviada(true)
  }

  const calcularTotalOfrendas = () => {
    const o = Number.parseFloat(ofrendas) || 0
    const d = Number.parseFloat(diezmos) || 0
    const p = Number.parseFloat(pactos) || 0
    const pr = Number.parseFloat(primicias) || 0
    return o + d + p + pr
  }

  const handleEnviarReporte = () => {
    if (!ubicacionEnviada) {
      alert("Por favor, envía tu ubicación antes de enviar el reporte")
      return
    }
    setConfirmDialogOpen(true)
  }

  const confirmarEnvio = () => {
    setConfirmDialogOpen(false)
    setSuccessDialogOpen(true)
    // Reset form
    setTimeout(() => {
      setMiembros(miembros.map((m) => ({ ...m, asiste: false })))
      setVisitas([])
      setOfrendas("")
      setDiezmos("")
      setPactos("")
      setPrimicias("")
      setComentarios("")
      setUbicacionEnviada(false)
      setSuccessDialogOpen(false)
    }, 2000)
  }

  const asistenciaTotal = miembros.filter((m) => m.asiste).length + visitas.length
  const totalOfrendas = calcularTotalOfrendas()

  // Filters for Lider de Subred
  const filteredReportes = reportes.filter((reporte) => {
    const matchesLider = filterLider === "all" || reporte.lider === filterLider
    const matchesMonth = selectedMonth === "all" || reporte.mes === selectedMonth
    const matchesYear = selectedYear === "all" || reporte.año === selectedYear
    const matchesSearch =
      reporte.lider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reporte.año.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reporte.mes.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesLider && matchesMonth && matchesYear && matchesSearch
  })

  const totalPages = Math.ceil(filteredReportes.length / 10) // Assuming 10 reports per page
  const paginatedReportes = filteredReportes.slice((currentPage - 1) * 10, currentPage * 10)

  const clearAllFilters = () => {
    setFilterLider("all")
    setSelectedMonth("all")
    setSelectedYear("all")
    setSearchQuery("")
    setCurrentPage(1)
  }

  if (userRole === "Lider") {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Reportes</h1>
          <p className="text-muted-foreground mt-2">Realiza tu reporte semanal de la Casa de Paz</p>
        </div>

        {/* Asistencia */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">1. Asistencia</CardTitle>
            <div className="text-sm text-muted-foreground">Presiona sobre los miembros para marcar su asistencia</div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {miembros.map((miembro) => (
                <button
                  key={miembro.id}
                  onClick={() => handleAsistenciaChange(miembro.id)}
                  className={`w-full text-left p-3 rounded-lg border border-border transition-all ${
                    miembro.asiste
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                >
                  <span className="font-medium">{miembro.nombre}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-lg bg-accent/10 border border-accent/20">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Total Asistencia:</span>
                <span className="text-xl font-bold text-accent">{asistenciaTotal}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amigos/Fruto */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">2. Amigos/Fruto</CardTitle>
                <div className="text-sm text-muted-foreground">Registra las visitas de la Casa de Paz</div>
              </div>
              <Dialog open={addVisitaOpen} onOpenChange={setAddVisitaOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-accent text-accent-foreground">Agregar Visita</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Agregar Nueva Visita</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="visita-nombre">Nombre Completo</Label>
                      <Input
                        id="visita-nombre"
                        value={nuevaVisita.nombre}
                        onChange={(e) => setNuevaVisita({ ...nuevaVisita, nombre: e.target.value })}
                        placeholder="Nombre completo de la visita"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="visita-telefono">Teléfono</Label>
                      <Input
                        id="visita-telefono"
                        value={nuevaVisita.telefono}
                        onChange={(e) => setNuevaVisita({ ...nuevaVisita, telefono: e.target.value })}
                        placeholder="1234-5678"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="visita-direccion">Dirección</Label>
                      <Input
                        id="visita-direccion"
                        value={nuevaVisita.direccion}
                        onChange={(e) => setNuevaVisita({ ...nuevaVisita, direccion: e.target.value })}
                        placeholder="Dirección completa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="visita-referencia">Referencia</Label>
                      <Input
                        id="visita-referencia"
                        value={nuevaVisita.referencia}
                        onChange={(e) => setNuevaVisita({ ...nuevaVisita, referencia: e.target.value })}
                        placeholder="Punto de referencia"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="visita-invitado">Invitado Por</Label>
                      <Input
                        id="visita-invitado"
                        value={nuevaVisita.invitadoPor}
                        onChange={(e) => setNuevaVisita({ ...nuevaVisita, invitadoPor: e.target.value })}
                        placeholder="Nombre de quien lo invitó"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="asiste-iglesia"
                        checked={nuevaVisita.asisteIglesia}
                        onCheckedChange={(checked) =>
                          setNuevaVisita({ ...nuevaVisita, asisteIglesia: checked as boolean })
                        }
                      />
                      <Label htmlFor="asiste-iglesia" className="cursor-pointer">
                        Asiste a una iglesia
                      </Label>
                    </div>
                    {nuevaVisita.asisteIglesia && (
                      <div className="space-y-2">
                        <Label htmlFor="nombre-iglesia">Nombre de la Iglesia</Label>
                        <Input
                          id="nombre-iglesia"
                          value={nuevaVisita.nombreIglesia}
                          onChange={(e) => setNuevaVisita({ ...nuevaVisita, nombreIglesia: e.target.value })}
                          placeholder="Nombre de la iglesia"
                        />
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tipo">Miembro/Amigo</Label>
                        <select
                          id="tipo"
                          value={nuevaVisita.tipo}
                          onChange={(e) =>
                            setNuevaVisita({ ...nuevaVisita, tipo: e.target.value as "Amigo" | "Miembro" })
                          }
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="Amigo">Amigo</option>
                          <option value="Miembro">Miembro</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="estado">Decisión</Label>
                        <select
                          id="estado"
                          value={nuevaVisita.estado}
                          onChange={(e) =>
                            setNuevaVisita({
                              ...nuevaVisita,
                              estado: e.target.value as "Ninguna" | "Convertido" | "Reconciliado",
                            })
                          }
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="Ninguna">Ninguna</option>
                          <option value="Convertido">Convertido</option>
                          <option value="Reconciliado">Reconciliado</option>
                        </select>
                      </div>
                    </div>
                    <Button onClick={handleAgregarVisita} className="w-full bg-accent text-accent-foreground">
                      Agregar Visita
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {visitas.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No se han agregado visitas aún</p>
            ) : (
              <div className="space-y-3">
                {visitas.map((visita) => (
                  <div key={visita.id} className="p-4 rounded-lg border border-border">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <p className="font-medium text-foreground">{visita.nombre}</p>
                        <p className="text-sm text-muted-foreground">Invitado por: {visita.invitadoPor}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent">{visita.tipo}</span>
                        {visita.estado !== "Ninguna" && (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            {visita.estado}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ofrendas */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">3. Ofrendas</CardTitle>
            <div className="text-sm text-muted-foreground">Registra las ofrendas de la Casa de Paz</div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metodo-entrega">Método de Entrega</Label>
                <Select
                  value={metodoEntrega}
                  onValueChange={(value) => setMetodoEntrega(value as "Transferencia" | "Servicio")}
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Selecciona método de entrega" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Transferencia">Transferencia</SelectItem>
                    <SelectItem value="Servicio">En el Servicio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ofrendas">Ofrendas</Label>
                  <Input
                    id="ofrendas"
                    type="number"
                    value={ofrendas}
                    onChange={(e) => setOfrendas(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diezmos">Diezmos</Label>
                  <Input
                    id="diezmos"
                    type="number"
                    value={diezmos}
                    onChange={(e) => setDiezmos(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pactos">Pactos</Label>
                  <Input
                    id="pactos"
                    type="number"
                    value={pactos}
                    onChange={(e) => setPactos(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primicias">Primicias</Label>
                  <Input
                    id="primicias"
                    type="number"
                    value={primicias}
                    onChange={(e) => setPrimicias(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="mt-4 p-4 rounded-lg bg-accent/10 border border-accent/20">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Total:</span>
                  <span className="text-xl font-bold text-accent">Q {totalOfrendas.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comentarios */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">4. Comentarios/Observaciones</CardTitle>
            <div className="text-sm text-muted-foreground">
              Agrega cualquier información relevante que quieras comentar al departamento de la visión
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              placeholder="Escribe aquí tus comentarios u observaciones..."
              rows={4}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Ubicación y Envío */}
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Button
                onClick={handleEnviarUbicacion}
                variant={ubicacionEnviada ? "outline" : "default"}
                className="w-full"
                disabled={ubicacionEnviada}
              >
                {ubicacionEnviada ? (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Ubicación Enviada
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Enviar Ubicación
                  </>
                )}
              </Button>
              <Button
                onClick={handleEnviarReporte}
                disabled={!ubicacionEnviada}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
              >
                Enviar Reporte
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Confirm Dialog */}
        <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Envío de Reporte</AlertDialogTitle>
              <div className="text-sm text-muted-foreground">
                <div className="space-y-4 mt-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Fecha</p>
                        <p className="font-semibold">{new Date().toLocaleDateString("es-GT")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Asistencia Total</p>
                        <p className="font-semibold">{asistenciaTotal}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Amigos/Fruto</p>
                        <p className="font-semibold">{visitas.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ofrenda Total</p>
                        <p className="font-semibold">Q {totalOfrendas.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm">¿Deseas enviar este reporte?</p>
                </div>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmarEnvio} className="bg-accent text-accent-foreground">
                Confirmar Envío
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Success Dialog */}
        <AlertDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Reporte Enviado
              </AlertDialogTitle>
              <div className="text-sm text-muted-foreground text-center">Tu reporte ha sido enviado exitosamente</div>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  }

  if (userRole === "Lider de Servicio") {
    const today = new Date().toLocaleDateString("es-GT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    return (
      <div className="p-4 md:p-8 space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Reportes</h1>
          <p className="text-muted-foreground mt-2">Registra la asistencia y ofrendas de la reunión</p>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Fecha del Reporte</CardTitle>
            <div className="text-sm text-muted-foreground">Fecha actual del reporte</div>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-secondary border border-border">
              <p className="text-lg font-semibold text-foreground">{today}</p>
            </div>
          </CardContent>
        </Card>

        {/* Asistencia */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">1. Asistencia</CardTitle>
            <div className="text-sm text-muted-foreground">Registra la asistencia por grupo</div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="apostol">Apostoles</Label>
                <Input
                  id="apostol"
                  type="number"
                  value={grupos.apostol.toString()}
                  onChange={(e) => setGrupos({ ...grupos, apostol: Number.parseInt(e.target.value) })}
                  placeholder="0"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profeta">Profetas</Label>
                <Input
                  id="profeta"
                  type="number"
                  value={grupos.profeta.toString()}
                  onChange={(e) => setGrupos({ ...grupos, profeta: Number.parseInt(e.target.value) })}
                  placeholder="0"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pastores">Pastores</Label>
                <Input
                  id="pastores"
                  type="number"
                  value={grupos.pastores.toString()}
                  onChange={(e) => setGrupos({ ...grupos, pastores: Number.parseInt(e.target.value) })}
                  placeholder="0"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ancianos">Ancianos</Label>
                <Input
                  id="ancianos"
                  type="number"
                  value={grupos.ancianos.toString()}
                  onChange={(e) => setGrupos({ ...grupos, ancianos: Number.parseInt(e.target.value) })}
                  placeholder="0"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diaconos">Diáconos</Label>
                <Input
                  id="diaconos"
                  type="number"
                  value={grupos.diaconos.toString()}
                  onChange={(e) => setGrupos({ ...grupos, diaconos: Number.parseInt(e.target.value) })}
                  placeholder="0"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lideres">Líderes</Label>
                <Input
                  id="lideres"
                  type="number"
                  value={grupos.lideres.toString()}
                  onChange={(e) => setGrupos({ ...grupos, lideres: Number.parseInt(e.target.value) })}
                  placeholder="0"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="servidores">Servidores</Label>
                <Input
                  id="servidores"
                  type="number"
                  value={grupos.servidores.toString()}
                  onChange={(e) => setGrupos({ ...grupos, servidores: Number.parseInt(e.target.value) })}
                  placeholder="0"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parqueo">Parqueo</Label>
                <Input
                  id="parqueo"
                  type="number"
                  value={grupos.parqueo.toString()}
                  onChange={(e) => setGrupos({ ...grupos, parqueo: Number.parseInt(e.target.value) })}
                  placeholder="0"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ninos">Niños</Label>
                <Input
                  id="ninos"
                  type="number"
                  value={grupos.ninos.toString()}
                  onChange={(e) => setGrupos({ ...grupos, ninos: Number.parseInt(e.target.value) })}
                  placeholder="0"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maestrosNinos">Maestros de Niños</Label>
                <Input
                  id="maestrosNinos"
                  type="number"
                  value={grupos.maestrosNinos.toString()}
                  onChange={(e) => setGrupos({ ...grupos, maestrosNinos: Number.parseInt(e.target.value) })}
                  placeholder="0"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alabanza">Alabanza</Label>
                <Input
                  id="alabanza"
                  type="number"
                  value={grupos.alabanza.toString()}
                  onChange={(e) => setGrupos({ ...grupos, alabanza: Number.parseInt(e.target.value) })}
                  placeholder="0"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="danza">Danza</Label>
                <Input
                  id="danza"
                  type="number"
                  value={grupos.danza.toString()}
                  onChange={(e) => setGrupos({ ...grupos, danza: Number.parseInt(e.target.value) })}
                  placeholder="0"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mediosTV">Medios TV</Label>
                <Input
                  id="mediosTV"
                  type="number"
                  value={grupos.mediosTV.toString()}
                  onChange={(e) => setGrupos({ ...grupos, mediosTV: Number.parseInt(e.target.value) })}
                  placeholder="0"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pueblo">Pueblo</Label>
                <Input
                  id="pueblo"
                  type="number"
                  value={grupos.pueblo.toString()}
                  onChange={(e) => setGrupos({ ...grupos, pueblo: Number.parseInt(e.target.value) })}
                  placeholder="0"
                  className="w-full"
                />
              </div>
            </div>
            <div className="mt-4 p-4 rounded-lg bg-accent/10 border border-accent/20">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Total Asistencia:</span>
                <span className="text-xl font-bold text-accent">{totalAsistencia}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">2. Amigos/Fruto</CardTitle>
                <div className="text-sm text-muted-foreground">Visitas, Convertidos y Reconciliados</div>
              </div>
              <Dialog open={addVisitaOpen} onOpenChange={setAddVisitaOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 w-full md:w-auto">
                    Agregar Amigo/Fruto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Agregar Amigo/Fruto</DialogTitle>
                    <div className="text-sm text-muted-foreground">Registra los datos de la visita</div>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="visita-nombre">Nombre</Label>
                      <Input
                        id="visita-nombre"
                        value={nuevaVisita.nombre}
                        onChange={(e) => setNuevaVisita({ ...nuevaVisita, nombre: e.target.value })}
                        placeholder="Nombre completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="visita-telefono">Teléfono</Label>
                      <Input
                        id="visita-telefono"
                        value={nuevaVisita.telefono}
                        onChange={(e) => setNuevaVisita({ ...nuevaVisita, telefono: e.target.value })}
                        placeholder="1234-5678"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="visita-direccion">Dirección</Label>
                      <Input
                        id="visita-direccion"
                        value={nuevaVisita.direccion}
                        onChange={(e) => setNuevaVisita({ ...nuevaVisita, direccion: e.target.value })}
                        placeholder="Dirección completa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="visita-referencia">Referencia</Label>
                      <Input
                        id="visita-referencia"
                        value={nuevaVisita.referencia}
                        onChange={(e) => setNuevaVisita({ ...nuevaVisita, referencia: e.target.value })}
                        placeholder="Punto de referencia"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="visita-invitado">Invitado Por</Label>
                      <Input
                        id="visita-invitado"
                        value={nuevaVisita.invitadoPor}
                        onChange={(e) => setNuevaVisita({ ...nuevaVisita, invitadoPor: e.target.value })}
                        placeholder="Nombre de quien lo invitó"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="asiste-iglesia"
                        checked={nuevaVisita.asisteIglesia}
                        onCheckedChange={(checked) =>
                          setNuevaVisita({ ...nuevaVisita, asisteIglesia: checked as boolean })
                        }
                      />
                      <Label htmlFor="asiste-iglesia" className="cursor-pointer">
                        Asiste a una iglesia
                      </Label>
                    </div>
                    {nuevaVisita.asisteIglesia && (
                      <div className="space-y-2">
                        <Label htmlFor="nombre-iglesia">Nombre de la Iglesia</Label>
                        <Input
                          id="nombre-iglesia"
                          value={nuevaVisita.nombreIglesia}
                          onChange={(e) => setNuevaVisita({ ...nuevaVisita, nombreIglesia: e.target.value })}
                          placeholder="Nombre de la iglesia"
                        />
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tipo">Miembro/Amigo</Label>
                        <select
                          id="tipo"
                          value={nuevaVisita.tipo}
                          onChange={(e) =>
                            setNuevaVisita({ ...nuevaVisita, tipo: e.target.value as "Amigo" | "Miembro" })
                          }
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="Amigo">Amigo</option>
                          <option value="Miembro">Miembro</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="estado">Decisión</Label>
                        <select
                          id="estado"
                          value={nuevaVisita.estado}
                          onChange={(e) =>
                            setNuevaVisita({
                              ...nuevaVisita,
                              estado: e.target.value as "Ninguna" | "Convertido" | "Reconciliado",
                            })
                          }
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="Ninguna">Ninguna</option>
                          <option value="Convertido">Convertido</option>
                          <option value="Reconciliado">Reconciliado</option>
                        </select>
                      </div>
                    </div>
                    <Button onClick={handleAgregarVisita} className="w-full bg-accent text-accent-foreground">
                      Agregar Visita
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {visitas.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No se han agregado visitas aún</p>
            ) : (
              <div className="space-y-3">
                {visitas.map((visita) => (
                  <div key={visita.id} className="p-4 rounded-lg border border-border">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <p className="font-medium text-foreground">{visita.nombre}</p>
                        <p className="text-sm text-muted-foreground">Invitado por: {visita.invitadoPor}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent">{visita.tipo}</span>
                        {visita.estado !== "Ninguna" && (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            {visita.estado}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botón de Envío */}
        <Card className="border-border">
          <CardContent className="pt-6">
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Enviar Reporte</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (userRole === "Lider de Subred") {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Reportes</h1>
          <p className="text-muted-foreground mt-2">Realiza la evaluación de la Casa de Paz</p>
        </div>

        {/* 1. Seleccionar Líder */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">1. Seleccionar Líder</CardTitle>
            <div className="text-sm text-muted-foreground">Selecciona el líder a evaluar</div>
          </CardHeader>
          <CardContent>
            <Select value={selectedLiderEval} onValueChange={setSelectedLiderEval}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Selecciona un líder" />
              </SelectTrigger>
              <SelectContent>
                {lideres.map((lider) => (
                  <SelectItem key={lider.id} value={lider.nombre}>
                    {lider.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* 2. Evaluación de Casa de Paz */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">2. Evaluación de Casa de Paz</CardTitle>
            <div className="text-sm text-muted-foreground">Marca los aspectos completados</div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="oracion"
                checked={checklistItems.oracion}
                onCheckedChange={(checked) => setChecklistItems({ ...checklistItems, oracion: checked as boolean })}
              />
              <Label htmlFor="oracion" className="cursor-pointer text-base">
                Se ora antes de iniciar la casa de paz
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="alabanza"
                checked={checklistItems.alabanza}
                onCheckedChange={(checked) => setChecklistItems({ ...checklistItems, alabanza: checked as boolean })}
              />
              <Label htmlFor="alabanza" className="cursor-pointer text-base">
                Se realiza alabanza
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="adoracion"
                checked={checklistItems.adoracion}
                onCheckedChange={(checked) => setChecklistItems({ ...checklistItems, adoracion: checked as boolean })}
              />
              <Label htmlFor="adoracion" className="cursor-pointer text-base">
                Se realiza adoración
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="delega"
                checked={checklistItems.delega}
                onCheckedChange={(checked) => setChecklistItems({ ...checklistItems, delega: checked as boolean })}
              />
              <Label htmlFor="delega" className="cursor-pointer text-base">
                El líder delega privilegios
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="comparteTema"
                checked={checklistItems.comparteTema}
                onCheckedChange={(checked) =>
                  setChecklistItems({ ...checklistItems, comparteTema: checked as boolean })
                }
              />
              <Label htmlFor="comparteTema" className="cursor-pointer text-base">
                Comparte el tema asignado
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="preparaTema"
                checked={checklistItems.preparaTema}
                onCheckedChange={(checked) => setChecklistItems({ ...checklistItems, preparaTema: checked as boolean })}
              />
              <Label htmlFor="preparaTema" className="cursor-pointer text-base">
                Se prepara para compartir el tema (No lee)
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="usoTiempo"
                checked={checklistItems.usoTiempo}
                onCheckedChange={(checked) => setChecklistItems({ ...checklistItems, usoTiempo: checked as boolean })}
              />
              <Label htmlFor="usoTiempo" className="cursor-pointer text-base">
                Uso medido del tiempo
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="ministraOfrendas"
                checked={checklistItems.ministraOfrendas}
                onCheckedChange={(checked) =>
                  setChecklistItems({ ...checklistItems, ministraOfrendas: checked as boolean })
                }
              />
              <Label htmlFor="ministraOfrendas" className="cursor-pointer text-base">
                Ministra ofrendas
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="llamado"
                checked={checklistItems.llamado}
                onCheckedChange={(checked) => setChecklistItems({ ...checklistItems, llamado: checked as boolean })}
              />
              <Label htmlFor="llamado" className="cursor-pointer text-base">
                Realiza el llamado
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="anuncios"
                checked={checklistItems.anuncios}
                onCheckedChange={(checked) => setChecklistItems({ ...checklistItems, anuncios: checked as boolean })}
              />
              <Label htmlFor="anuncios" className="cursor-pointer text-base">
                Comparte anuncios
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Comentarios/Observaciones */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Comentarios/Observaciones</CardTitle>
            <div className="text-sm text-muted-foreground">Agrega comentarios adicionales sobre la evaluación</div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={comentariosEval}
              onChange={(e) => setComentariosEval(e.target.value)}
              placeholder="Escribe aquí tus comentarios u observaciones..."
              rows={5}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Botón de Envío */}
        <Card className="border-border">
          <CardContent className="pt-6">
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Enviar Evaluación</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (userRole === "Lider de Subred") {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Reportes</h1>
          <p className="text-muted-foreground mt-2">Revisa los reportes de los líderes</p>
        </div>

        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Evaluaciones</CardTitle>
              <Button variant="outline" size="sm" onClick={clearAllFilters} className="bg-transparent">
                <X className="h-4 w-4 mr-2" />
                Limpiar Filtros
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="flex-1">
                <Label className="text-muted-foreground mb-2 block">Filtrar por Líder</Label>
                <Select value={filterLider} onValueChange={setFilterLider}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Todos los líderes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los líderes</SelectItem>
                    {lideres.map((lider) => (
                      <SelectItem key={lider.id} value={lider.nombre}>
                        {lider.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label className="text-muted-foreground mb-2 block">Filtrar por mes</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Todos los meses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los meses</SelectItem>
                    {meses.map((mes) => (
                      <SelectItem key={mes.value} value={mes.value}>
                        {mes.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label className="text-muted-foreground mb-2 block">Filtrar por año</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Todos los años" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los años</SelectItem>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar evaluaciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="min-h-[400px]">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredReportes.length} {filteredReportes.length === 1 ? "reporte" : "reportes"}
                </p>
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-foreground">
                      Página {currentPage} de {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">Líder</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">Fecha</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">Asistencia</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">Amigos/Fruto</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">Ofrenda</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedReportes.map((reporte) => (
                      <tr key={reporte.id} className="border-b border-border last:border-none">
                        <td className="py-4 px-4 text-sm font-medium text-foreground">{reporte.lider}</td>
                        <td className="py-4 px-4 text-sm text-muted-foreground">
                          {new Date(reporte.fecha).toLocaleDateString("es-GT")}
                        </td>
                        <td className="py-4 px-4 text-sm font-medium text-accent">{reporte.asistenciaTotal}</td>
                        <td className="py-4 px-4 text-sm font-medium text-accent">{reporte.amigosFruto}</td>
                        <td className="py-4 px-4 text-sm font-medium text-accent">
                          Q {reporte.ofrendaTotal.toFixed(2)}
                        </td>
                        <td className="py-4 px-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                Ver Detalles
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Detalles del Reporte</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <p>
                                  <span className="font-semibold">Líder:</span> {reporte.lider}
                                </p>
                                <p>
                                  <span className="font-semibold">Fecha:</span>{" "}
                                  {new Date(reporte.fecha).toLocaleDateString("es-GT")}
                                </p>
                                <p>
                                  <span className="font-semibold">Asistencia Total:</span> {reporte.asistenciaTotal}
                                </p>
                                <p>
                                  <span className="font-semibold">Amigos/Fruto:</span> {reporte.amigosFruto}
                                </p>
                                <p>
                                  <span className="font-semibold">Ofrenda Total:</span> Q{" "}
                                  {reporte.ofrendaTotal.toFixed(2)}
                                </p>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {paginatedReportes.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No se encontraron reportes con los filtros aplicados.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Reportes</h1>
        <p className="text-muted-foreground mt-2">Registra la asistencia y ofrendas de la reunión</p>
      </div>

      {/* Asistencia */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">1. Asistencia de Miembros</CardTitle>
          <div className="text-sm text-muted-foreground">Presiona sobre el nombre para marcar asistencia</div>
        </CardHeader>
        <CardContent className="space-y-3">
          {miembros.map((miembro) => (
            <button
              key={miembro.id}
              onClick={() => handleAsistenciaChange(miembro.id)}
              className={`w-full text-left p-4 rounded-lg border border-border transition-colors ${
                miembro.asiste
                  ? "bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800"
                  : "bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800"
              }`}
            >
              <span className="text-base font-medium text-white">{miembro.nombre}</span>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Amigos/Fruto */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-foreground">2. Amigos/Fruto</CardTitle>
              <div className="text-sm text-muted-foreground">Visitas, Convertidos y Reconciliados</div>
            </div>
            <Dialog open={addVisitaOpen} onOpenChange={setAddVisitaOpen}>
              <DialogTrigger asChild>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 w-full md:w-auto">
                  Agregar Amigo/Fruto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Agregar Amigo/Fruto</DialogTitle>
                  <div className="text-sm text-muted-foreground">Registra los datos de la visita</div>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="visita-nombre">Nombre</Label>
                    <Input
                      id="visita-nombre"
                      value={nuevaVisita.nombre}
                      onChange={(e) => setNuevaVisita({ ...nuevaVisita, nombre: e.target.value })}
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="visita-telefono">Teléfono</Label>
                    <Input
                      id="visita-telefono"
                      value={nuevaVisita.telefono}
                      onChange={(e) => setNuevaVisita({ ...nuevaVisita, telefono: e.target.value })}
                      placeholder="1234-5678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="visita-direccion">Dirección</Label>
                    <Input
                      id="visita-direccion"
                      value={nuevaVisita.direccion}
                      onChange={(e) => setNuevaVisita({ ...nuevaVisita, direccion: e.target.value })}
                      placeholder="Dirección completa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="visita-referencia">Referencia</Label>
                    <Input
                      id="visita-referencia"
                      value={nuevaVisita.referencia}
                      onChange={(e) => setNuevaVisita({ ...nuevaVisita, referencia: e.target.value })}
                      placeholder="Punto de referencia"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="visita-invitado">Invitado Por</Label>
                    <Input
                      id="visita-invitado"
                      value={nuevaVisita.invitadoPor}
                      onChange={(e) => setNuevaVisita({ ...nuevaVisita, invitadoPor: e.target.value })}
                      placeholder="Nombre de quien lo invitó"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="asiste-iglesia"
                      checked={nuevaVisita.asisteIglesia}
                      onCheckedChange={(checked) =>
                        setNuevaVisita({ ...nuevaVisita, asisteIglesia: checked as boolean })
                      }
                    />
                    <Label htmlFor="asiste-iglesia" className="cursor-pointer">
                      Asiste a una iglesia
                    </Label>
                  </div>
                  {nuevaVisita.asisteIglesia && (
                    <div className="space-y-2">
                      <Label htmlFor="nombre-iglesia">Nombre de la Iglesia</Label>
                      <Input
                        id="nombre-iglesia"
                        value={nuevaVisita.nombreIglesia}
                        onChange={(e) => setNuevaVisita({ ...nuevaVisita, nombreIglesia: e.target.value })}
                        placeholder="Nombre de la iglesia"
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipo">Miembro/Amigo</Label>
                      <select
                        id="tipo"
                        value={nuevaVisita.tipo}
                        onChange={(e) =>
                          setNuevaVisita({ ...nuevaVisita, tipo: e.target.value as "Amigo" | "Miembro" })
                        }
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="Amigo">Amigo</option>
                        <option value="Miembro">Miembro</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estado">Decisión</Label>
                      <select
                        id="estado"
                        value={nuevaVisita.estado}
                        onChange={(e) =>
                          setNuevaVisita({
                            ...nuevaVisita,
                            estado: e.target.value as "Ninguna" | "Convertido" | "Reconciliado",
                          })
                        }
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="Ninguna">Ninguna</option>
                        <option value="Convertido">Convertido</option>
                        <option value="Reconciliado">Reconciliado</option>
                      </select>
                    </div>
                  </div>
                  <Button onClick={handleAgregarVisita} className="w-full bg-accent text-accent-foreground">
                    Agregar Visita
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {visitas.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No se han agregado visitas aún</p>
          ) : (
            <div className="space-y-3">
              {visitas.map((visita) => (
                <div key={visita.id} className="p-4 rounded-lg border border-border">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <p className="font-medium text-foreground">{visita.nombre}</p>
                      <p className="text-sm text-muted-foreground">Invitado por: {visita.invitadoPor}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent">{visita.tipo}</span>
                      {visita.estado !== "Ninguna" && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          {visita.estado}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ofrendas */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">3. Ofrendas</CardTitle>
          <div className="text-sm text-muted-foreground">
            Agrega cualquier información relevante que quieras comentar al departamento de la visión
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metodo-entrega">Método de Entrega</Label>
              <Select
                value={metodoEntrega}
                onValueChange={(value) => setMetodoEntrega(value as "Transferencia" | "Servicio")}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Selecciona método de entrega" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Transferencia">Transferencia</SelectItem>
                  <SelectItem value="Servicio">En el Servicio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ofrendas">Ofrendas</Label>
                <Input
                  id="ofrendas"
                  type="number"
                  value={ofrendas}
                  onChange={(e) => setOfrendas(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diezmos">Diezmos</Label>
                <Input
                  id="diezmos"
                  type="number"
                  value={diezmos}
                  onChange={(e) => setDiezmos(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pactos">Pactos</Label>
                <Input
                  id="pactos"
                  type="number"
                  value={pactos}
                  onChange={(e) => setPactos(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primicias">Primicias</Label>
                <Input
                  id="primicias"
                  type="number"
                  value={primicias}
                  onChange={(e) => setPrimicias(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>
            <div className="mt-4 p-4 rounded-lg bg-accent/10 border border-accent/20">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Total:</span>
                <span className="text-xl font-bold text-accent">Q {totalOfrendas.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comentarios */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">4. Comentarios/Observaciones</CardTitle>
          <div className="text-sm text-muted-foreground">
            Agrega cualquier información relevante que quieras comentar al departamento de la visión
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={comentarios}
            onChange={(e) => setComentarios(e.target.value)}
            placeholder="Escribe aquí tus comentarios u observaciones..."
            rows={4}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Ubicación y Envío */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Button
              onClick={handleEnviarUbicacion}
              variant={ubicacionEnviada ? "outline" : "default"}
              className="w-full"
              disabled={ubicacionEnviada}
            >
              {ubicacionEnviada ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Ubicación Enviada
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Enviar Ubicación
                </>
              )}
            </Button>
            <Button
              onClick={handleEnviarReporte}
              disabled={!ubicacionEnviada}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
            >
              Enviar Reporte
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirm Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Envío de Reporte</AlertDialogTitle>
            <div className="text-sm text-muted-foreground">
              <div className="space-y-4 mt-4">
                <div className="p-4 rounded-lg bg-muted">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Fecha</p>
                      <p className="font-semibold">{new Date().toLocaleDateString("es-GT")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Asistencia Total</p>
                      <p className="font-semibold">{asistenciaTotal}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Amigos/Fruto</p>
                      <p className="font-semibold">{visitas.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ofrenda Total</p>
                      <p className="font-semibold">Q {totalOfrendas.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm">¿Deseas enviar este reporte?</p>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarEnvio} className="bg-accent text-accent-foreground">
              Confirmar Envío
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Dialog */}
      <AlertDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Reporte Enviado
            </AlertDialogTitle>
            <div className="text-sm text-muted-foreground text-center">Tu reporte ha sido enviado exitosamente</div>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
