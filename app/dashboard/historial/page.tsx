"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { getUserSession } from "@/lib/auth"
import { X, Search, ChevronLeft, ChevronRight } from "lucide-react"

interface Reporte {
  id: number
  fecha: string
  asistencia: number
  ofrendas: number
  lider?: string
  liderSubred?: string
  detalles: {
    miembrosPresentes: string[]
    visitantes: Array<{
      nombre: string
      telefono: string
      invitadoPor: string
    }>
    ofrendas: number
    diezmos: number
    pactos: number
    primicias: number
    comentarios: string
    miembrosAusentes?: string[]
  }
}

export default function HistorialPage() {
  const [selectedReporte, setSelectedReporte] = useState<Reporte | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [userRole, setUserRole] = useState<string | null>(null)
  const [filterLider, setFilterLider] = useState<string>("all")
  const [filterLiderSubred, setFilterLiderSubred] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const user = getUserSession()
    if (user) {
      setUserRole(user.role)
    }
  }, [])

  const reportes: Reporte[] = [
    {
      id: 1,
      fecha: "2024-01-21",
      asistencia: 18,
      ofrendas: 1250,
      lider: "Daniela Juarez",
      liderSubred: "Josué Santizo",
      detalles: {
        miembrosPresentes: ["María López", "Carlos Méndez", "Ana García", "Pedro Ramírez"],
        visitantes: [
          { nombre: "Laura Torres", telefono: "5555-5678", invitadoPor: "María López" },
          { nombre: "Juan Pérez", telefono: "5555-1111", invitadoPor: "Carlos Méndez" },
        ],
        ofrendas: 850,
        diezmos: 300,
        pactos: 50,
        primicias: 50,
        comentarios: "Excelente reunión, gran participación",
      },
    },
    {
      id: 2,
      fecha: "2024-01-14",
      asistencia: 15,
      ofrendas: 980,
      lider: "Marco Antonio López",
      liderSubred: "Josué Santizo",
      detalles: {
        miembrosPresentes: ["María López", "Carlos Méndez", "Ana García"],
        visitantes: [{ nombre: "Roberto Gómez", telefono: "5555-2222", invitadoPor: "Ana García" }],
        ofrendas: 700,
        diezmos: 250,
        pactos: 30,
        primicias: 0,
        comentarios: "Buena asistencia",
      },
    },
    {
      id: 3,
      fecha: "2024-01-07",
      asistencia: 20,
      ofrendas: 1450,
      lider: "Sofia García",
      liderSubred: "Josué Santizo",
      detalles: {
        miembrosPresentes: ["María López", "Carlos Méndez", "Ana García", "Pedro Ramírez", "Lucía Fernández"],
        visitantes: [],
        ofrendas: 950,
        diezmos: 400,
        pactos: 100,
        primicias: 0,
        comentarios: "Celebración especial de año nuevo",
      },
    },
    {
      id: 4,
      fecha: "2023-12-17",
      asistencia: 16,
      ofrendas: 1100,
      lider: "Daniela Juarez",
      liderSubred: "Josué Santizo",
      detalles: {
        miembrosPresentes: ["María López", "Carlos Méndez", "Ana García"],
        visitantes: [{ nombre: "Sofia Morales", telefono: "5555-3333", invitadoPor: "Pedro Ramírez" }],
        ofrendas: 750,
        diezmos: 300,
        pactos: 50,
        primicias: 0,
        comentarios: "Última reunión del año",
      },
    },
  ]

  const lideres = [
    { value: "Daniela Juarez", label: "Daniela Juarez" },
    { value: "Marco Antonio López", label: "Marco Antonio López" },
    { value: "Sofia García", label: "Sofia García" },
  ]

  const lideresSubred = [{ value: "Josué Santizo", label: "Josué Santizo" }]

  const todosLosMiembros = [
    "María López",
    "Carlos Méndez",
    "Ana García",
    "Pedro Ramírez",
    "Lucía Fernández",
    "Roberto Gómez",
    "Sofia Morales",
  ]

  const reportesConAusentes: Reporte[] = reportes.map((reporte) => ({
    ...reporte,
    detalles: {
      ...reporte.detalles,
      miembrosAusentes: todosLosMiembros.filter((miembro) => !reporte.detalles.miembrosPresentes.includes(miembro)),
    },
  }))

  const sortedReportes = [...reportesConAusentes].sort((a, b) => {
    const dateA = new Date(a.fecha)
    const dateB = new Date(b.fecha)
    return dateB.getTime() - dateA.getTime()
  })

  const filteredReportes = sortedReportes.filter((reporte) => {
    const fecha = new Date(reporte.fecha)
    const month = (fecha.getMonth() + 1).toString()
    const year = fecha.getFullYear().toString()

    const matchesMonth = selectedMonth === "all" || month === selectedMonth
    const matchesYear = selectedYear === "all" || year === selectedYear
    const matchesLider = filterLider === "all" || reporte.lider === filterLider
    const matchesLiderSubred = filterLiderSubred === "all" || reporte.liderSubred === filterLiderSubred
    const matchesSearch =
      searchQuery === "" ||
      reporte.lider?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reporte.liderSubred?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesMonth && matchesYear && matchesLider && matchesLiderSubred && matchesSearch
  })

  const itemsPerPage = userRole === "Administración" ? 20 : 10
  const totalPages = Math.ceil(filteredReportes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedReportes = filteredReportes.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedMonth, selectedYear, filterLider, filterLiderSubred, searchQuery])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ" }).format(amount)
  }

  const meses = [
    { value: "1", label: "Enero" },
    { value: "2", label: "Febrero" },
    { value: "3", label: "Marzo" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Mayo" },
    { value: "6", label: "Junio" },
    { value: "7", label: "Julio" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ]

  const clearAllFilters = () => {
    setSelectedMonth("all")
    setSelectedYear("all")
    setFilterLider("all")
    setFilterLiderSubred("all")
    setSearchQuery("")
  }

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i)

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
          {userRole === "Administración" ? "Historial Liderazgo" : "Historial"}
        </h1>
        <p className="text-muted-foreground mt-2">Registro de reportes enviados</p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Historial de Reportes</CardTitle>
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
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            {userRole === "Administración" && (
              <div className="flex-1">
                <Label className="text-muted-foreground mb-2 block">Líder de Subred</Label>
                <Select value={filterLiderSubred} onValueChange={setFilterLiderSubred}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Todos los líderes de subred" />
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
            )}
            {(userRole === "Lider de Subred" || userRole === "Administración") && (
              <div className="flex-1">
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
              placeholder="Buscar por líder o líder de subred..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="min-h-[500px]">
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
                    <th className="text-left p-3 text-foreground font-semibold">Fecha</th>
                    <th className="text-left p-3 text-foreground font-semibold">Asistencia</th>
                    <th className="text-left p-3 text-foreground font-semibold">Ofrendas</th>
                    <th className="text-left p-3 text-foreground font-semibold">Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedReportes.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-muted-foreground">
                        No se encontraron reportes con los filtros seleccionados
                      </td>
                    </tr>
                  ) : (
                    paginatedReportes.map((reporte) => (
                      <tr key={reporte.id} className="border-b border-border hover:bg-secondary/50">
                        <td className="p-3 text-foreground">
                          {new Date(reporte.fecha).toLocaleDateString("es-GT", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </td>
                        <td className="p-3 text-foreground">{reporte.asistencia} personas</td>
                        <td className="p-3 text-foreground">{formatCurrency(reporte.ofrendas)}</td>
                        <td className="p-3">
                          <Dialog
                            open={showDetails && selectedReporte?.id === reporte.id}
                            onOpenChange={setShowDetails}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedReporte(reporte)}
                                className="bg-transparent"
                              >
                                Ver Detalles
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-foreground">Detalles del Reporte</DialogTitle>
                              </DialogHeader>
                              {selectedReporte && (
                                <div className="space-y-6">
                                  <div>
                                    <h3 className="font-semibold text-foreground mb-3">Información General</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-muted-foreground">Fecha</Label>
                                        <p className="text-foreground">
                                          {new Date(selectedReporte.fecha).toLocaleDateString("es-GT", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                          })}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">Asistencia Total</Label>
                                        <p className="text-foreground">{selectedReporte.asistencia} personas</p>
                                      </div>
                                      {(userRole === "Lider de Subred" || userRole === "Administración") &&
                                        selectedReporte.lider && (
                                          <div>
                                            <Label className="text-muted-foreground">Líder</Label>
                                            <p className="text-foreground font-semibold">{selectedReporte.lider}</p>
                                          </div>
                                        )}
                                      {userRole === "Administración" && selectedReporte.liderSubred && (
                                        <div>
                                          <Label className="text-muted-foreground">Líder de Subred</Label>
                                          <p className="text-foreground font-semibold">{selectedReporte.liderSubred}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div>
                                    <h3 className="font-semibold text-foreground mb-3">Miembros Presentes</h3>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedReporte.detalles.miembrosPresentes.map((nombre, index) => (
                                        <span
                                          key={index}
                                          className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-foreground rounded-full text-sm"
                                        >
                                          {nombre}
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  {selectedReporte.detalles.miembrosAusentes &&
                                    selectedReporte.detalles.miembrosAusentes.length > 0 && (
                                      <div>
                                        <h3 className="font-semibold text-foreground mb-3">Miembros Ausentes</h3>
                                        <div className="flex flex-wrap gap-2">
                                          {selectedReporte.detalles.miembrosAusentes.map((nombre, index) => (
                                            <span
                                              key={index}
                                              className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-foreground rounded-full text-sm"
                                            >
                                              {nombre}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                  {selectedReporte.detalles.visitantes.length > 0 && (
                                    <div>
                                      <h3 className="font-semibold text-foreground mb-3">Visitantes</h3>
                                      <div className="space-y-2">
                                        {selectedReporte.detalles.visitantes.map((visitante, index) => (
                                          <div key={index} className="p-3 bg-secondary rounded-lg">
                                            <p className="text-foreground font-medium">{visitante.nombre}</p>
                                            <p className="text-sm text-muted-foreground">{visitante.telefono}</p>
                                            <p className="text-sm text-muted-foreground">
                                              Invitado por: {visitante.invitadoPor}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  <div>
                                    <h3 className="font-semibold text-foreground mb-3">Ofrendas</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="p-3 bg-secondary rounded-lg">
                                        <Label className="text-muted-foreground">Ofrendas</Label>
                                        <p className="text-foreground font-medium">
                                          {formatCurrency(selectedReporte.detalles.ofrendas)}
                                        </p>
                                      </div>
                                      <div className="p-3 bg-secondary rounded-lg">
                                        <Label className="text-muted-foreground">Diezmos</Label>
                                        <p className="text-foreground font-medium">
                                          {formatCurrency(selectedReporte.detalles.diezmos)}
                                        </p>
                                      </div>
                                      <div className="p-3 bg-secondary rounded-lg">
                                        <Label className="text-muted-foreground">Pactos</Label>
                                        <p className="text-foreground font-medium">
                                          {formatCurrency(selectedReporte.detalles.pactos)}
                                        </p>
                                      </div>
                                      <div className="p-3 bg-secondary rounded-lg">
                                        <Label className="text-muted-foreground">Primicias</Label>
                                        <p className="text-foreground font-medium">
                                          {formatCurrency(selectedReporte.detalles.primicias)}
                                        </p>
                                      </div>
                                      <div className="col-span-2 p-3 bg-accent/10 rounded-lg border-2 border-accent">
                                        <Label className="text-muted-foreground">Total</Label>
                                        <p className="text-foreground font-bold text-xl">
                                          {formatCurrency(selectedReporte.ofrendas)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {selectedReporte.detalles.comentarios && (
                                    <div>
                                      <h3 className="font-semibold text-foreground mb-3">Comentarios</h3>
                                      <p className="text-foreground p-3 bg-secondary rounded-lg">
                                        {selectedReporte.detalles.comentarios}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
