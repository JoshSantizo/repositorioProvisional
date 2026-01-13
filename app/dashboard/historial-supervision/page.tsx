"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

interface ReporteSupervision {
  id: number
  fecha: string
  liderSubred: string
  detalles: {
    lideresEvaluados: Array<{
      nombre: string
      oraAntes: boolean
      realizaAlabanza: boolean
      realizaAdoracion: boolean
      delegaPrivilegios: boolean
      comparteTema: boolean
      sePreparaParaTema: boolean
      usoMedidoTiempo: boolean
      ministraOfrendas: boolean
      comparteAnuncios: boolean
      realizaLlamado: boolean
    }>
    comentarios: string
  }
}

export default function HistorialSupervisionPage() {
  const [selectedReporte, setSelectedReporte] = useState<ReporteSupervision | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [filterLiderSubred, setFilterLiderSubred] = useState<string>("all")

  const reportes: ReporteSupervision[] = [
    {
      id: 1,
      fecha: "2024-01-21",
      liderSubred: "Josué Santizo",
      detalles: {
        lideresEvaluados: [
          {
            nombre: "Daniela Juarez",
            oraAntes: true,
            realizaAlabanza: true,
            realizaAdoracion: true,
            delegaPrivilegios: true,
            comparteTema: true,
            sePreparaParaTema: true,
            usoMedidoTiempo: true,
            ministraOfrendas: true,
            comparteAnuncios: true,
            realizaLlamado: true,
          },
          {
            nombre: "Marco Antonio López",
            oraAntes: true,
            realizaAlabanza: true,
            realizaAdoracion: false,
            delegaPrivilegios: true,
            comparteTema: true,
            sePreparaParaTema: true,
            usoMedidoTiempo: false,
            ministraOfrendas: true,
            comparteAnuncios: true,
            realizaLlamado: true,
          },
        ],
        comentarios: "Excelente trabajo de los líderes esta semana. Marco necesita mejorar en el uso del tiempo.",
      },
    },
    {
      id: 2,
      fecha: "2024-01-14",
      liderSubred: "Josué Santizo",
      detalles: {
        lideresEvaluados: [
          {
            nombre: "Sofia García",
            oraAntes: true,
            realizaAlabanza: true,
            realizaAdoracion: true,
            delegaPrivilegios: false,
            comparteTema: true,
            sePreparaParaTema: true,
            usoMedidoTiempo: true,
            ministraOfrendas: true,
            comparteAnuncios: false,
            realizaLlamado: true,
          },
        ],
        comentarios: "Sofía debe trabajar en delegar más responsabilidades.",
      },
    },
  ]

  const lideresSubred = [{ value: "Josué Santizo", label: "Josué Santizo" }]

  const filteredReportes = reportes.filter((reporte) => {
    return filterLiderSubred === "all" || reporte.liderSubred === filterLiderSubred
  })

  const clearAllFilters = () => {
    setFilterLiderSubred("all")
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Historial Supervisión</h1>
        <p className="text-muted-foreground mt-2">Registro de reportes de supervisión</p>
      </div>

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
          <div className="mt-4">
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
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredReportes.length} {filteredReportes.length === 1 ? "reporte" : "reportes"}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-foreground font-semibold">Fecha</th>
                  <th className="text-left p-3 text-foreground font-semibold">Líder de Subred</th>
                  <th className="text-left p-3 text-foreground font-semibold">Líder</th>
                  <th className="text-left p-3 text-foreground font-semibold">Detalles</th>
                </tr>
              </thead>
              <tbody>
                {filteredReportes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-muted-foreground">
                      No se encontraron reportes
                    </td>
                  </tr>
                ) : (
                  filteredReportes.map((reporte) => (
                    <tr key={reporte.id} className="border-b border-border hover:bg-secondary/50">
                      <td className="p-3 text-foreground">
                        {new Date(reporte.fecha).toLocaleDateString("es-GT", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-3 text-foreground">{reporte.liderSubred}</td>
                      <td className="p-3 text-foreground">
                        {reporte.detalles.lideresEvaluados.map((l) => l.nombre).join(", ")}
                      </td>
                      <td className="p-3">
                        <Dialog open={showDetails && selectedReporte?.id === reporte.id} onOpenChange={setShowDetails}>
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
                          <DialogContent className="bg-card border-border max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-foreground">Detalles del Reporte de Supervisión</DialogTitle>
                            </DialogHeader>
                            {selectedReporte && (
                              <div className="space-y-6">
                                <div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                      <Label className="text-muted-foreground">Fecha</Label>
                                      <p className="text-foreground font-medium">
                                        {new Date(selectedReporte.fecha).toLocaleDateString("es-GT", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                        })}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Líder de Subred</Label>
                                      <p className="text-foreground font-medium">{selectedReporte.liderSubred}</p>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h3 className="font-semibold text-foreground mb-3">Evaluación de Líderes</h3>
                                  {selectedReporte.detalles.lideresEvaluados.map((evaluacion, index) => (
                                    <div key={index} className="mb-6 p-4 bg-secondary rounded-lg">
                                      <h4 className="font-semibold text-foreground mb-3">{evaluacion.nombre}</h4>
                                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        <div className="flex items-center gap-2">
                                          <div
                                            className={`w-4 h-4 rounded-full ${evaluacion.oraAntes ? "bg-green-500" : "bg-red-500"}`}
                                          ></div>
                                          <span className="text-sm text-foreground">Ora antes de iniciar</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <div
                                            className={`w-4 h-4 rounded-full ${evaluacion.realizaAlabanza ? "bg-green-500" : "bg-red-500"}`}
                                          ></div>
                                          <span className="text-sm text-foreground">Realiza alabanza</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <div
                                            className={`w-4 h-4 rounded-full ${evaluacion.realizaAdoracion ? "bg-green-500" : "bg-red-500"}`}
                                          ></div>
                                          <span className="text-sm text-foreground">Realiza adoración</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <div
                                            className={`w-4 h-4 rounded-full ${evaluacion.delegaPrivilegios ? "bg-green-500" : "bg-red-500"}`}
                                          ></div>
                                          <span className="text-sm text-foreground">Delega privilegios</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <div
                                            className={`w-4 h-4 rounded-full ${evaluacion.comparteTema ? "bg-green-500" : "bg-red-500"}`}
                                          ></div>
                                          <span className="text-sm text-foreground">Comparte tema</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <div
                                            className={`w-4 h-4 rounded-full ${evaluacion.sePreparaParaTema ? "bg-green-500" : "bg-red-500"}`}
                                          ></div>
                                          <span className="text-sm text-foreground">Se prepara para tema</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <div
                                            className={`w-4 h-4 rounded-full ${evaluacion.usoMedidoTiempo ? "bg-green-500" : "bg-red-500"}`}
                                          ></div>
                                          <span className="text-sm text-foreground">Uso medido del tiempo</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <div
                                            className={`w-4 h-4 rounded-full ${evaluacion.ministraOfrendas ? "bg-green-500" : "bg-red-500"}`}
                                          ></div>
                                          <span className="text-sm text-foreground">Ministra ofrendas</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <div
                                            className={`w-4 h-4 rounded-full ${evaluacion.comparteAnuncios ? "bg-green-500" : "bg-red-500"}`}
                                          ></div>
                                          <span className="text-sm text-foreground">Comparte anuncios</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <div
                                            className={`w-4 h-4 rounded-full ${evaluacion.realizaLlamado ? "bg-green-500" : "bg-red-500"}`}
                                          ></div>
                                          <span className="text-sm text-foreground">Realiza llamado</span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
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
        </CardContent>
      </Card>
    </div>
  )
}
