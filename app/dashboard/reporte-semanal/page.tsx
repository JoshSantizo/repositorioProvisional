"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Trash2 } from "lucide-react"

interface ReportePendiente {
  id: number
  lider: string
  fecha: string
  asistencia: number
  ninos: number
  amigos: number
  convertidos: number
  reconciliados: number
  ofrenda: number
  red: "adultos" | "jovenes" | "adolescentes"
}

interface ReporteRevisado {
  lider: string
  miembros: number
  ninos: number
  amigos: number
  reconciliados: number
  convertidos: number
  ofrendas: number
}

export default function ReporteSemanalPage() {
  const todosLosLideres = [
    { nombre: "Daniela Juarez", red: "adultos" },
    { nombre: "Marco Antonio López", red: "jovenes" },
    { nombre: "Sofia García", red: "adolescentes" },
    { nombre: "Alejandro Miranda", red: "adultos" },
    { nombre: "Samuel López", red: "jovenes" },
    { nombre: "Patricia Morales", red: "adolescentes" },
    { nombre: "Roberto Castillo", red: "adultos" },
    { nombre: "Ana Martínez", red: "jovenes" },
    { nombre: "Carlos Ruiz", red: "adolescentes" },
    { nombre: "Laura Pérez", red: "adultos" },
  ]

  const [reportesPendientes, setReportesPendientes] = useState<ReportePendiente[]>([
    {
      id: 1,
      lider: "Daniela Juarez",
      fecha: "2024-01-21",
      asistencia: 18,
      ninos: 5,
      amigos: 3,
      convertidos: 2,
      reconciliados: 0,
      ofrenda: 1250,
      red: "adultos",
    },
    {
      id: 2,
      lider: "Marco Antonio López",
      fecha: "2024-01-21",
      asistencia: 25,
      ninos: 8,
      amigos: 5,
      convertidos: 1,
      reconciliados: 1,
      ofrenda: 1800,
      red: "jovenes",
    },
    {
      id: 3,
      lider: "Sofia García",
      fecha: "2024-01-21",
      asistencia: 15,
      ninos: 2,
      amigos: 2,
      convertidos: 0,
      reconciliados: 0,
      ofrenda: 980,
      red: "adolescentes",
    },
    {
      id: 4,
      lider: "Alejandro Miranda",
      fecha: "2024-01-21",
      asistencia: 20,
      ninos: 6,
      amigos: 4,
      convertidos: 3,
      reconciliados: 1,
      ofrenda: 1500,
      red: "adultos",
    },
    {
      id: 5,
      lider: "Samuel López",
      fecha: "2024-01-21",
      asistencia: 22,
      ninos: 7,
      amigos: 3,
      convertidos: 2,
      reconciliados: 0,
      ofrenda: 1650,
      red: "jovenes",
    },
    {
      id: 6,
      lider: "Patricia Morales",
      fecha: "2024-01-21",
      asistencia: 17,
      ninos: 4,
      amigos: 2,
      convertidos: 1,
      reconciliados: 1,
      ofrenda: 1100,
      red: "adolescentes",
    },
    {
      id: 7,
      lider: "Roberto Castillo",
      fecha: "2024-01-21",
      asistencia: 19,
      ninos: 5,
      amigos: 4,
      convertidos: 2,
      reconciliados: 0,
      ofrenda: 1350,
      red: "adultos",
    },
  ])

  const [reportesAdultos, setReportesAdultos] = useState<ReporteRevisado[]>([])
  const [reportesJovenes, setReportesJovenes] = useState<ReporteRevisado[]>([])
  const [reportesAdolescentes, setReportesAdolescentes] = useState<ReporteRevisado[]>([])

  useEffect(() => {
    inicializarTablas()
  }, [])

  const inicializarTablas = () => {
    const adultos: ReporteRevisado[] = []
    const jovenes: ReporteRevisado[] = []
    const adolescentes: ReporteRevisado[] = []

    todosLosLideres.forEach((lider) => {
      const reporteDefault: ReporteRevisado = {
        lider: lider.nombre,
        miembros: 0,
        ninos: 0,
        amigos: 0,
        reconciliados: 0,
        convertidos: 0,
        ofrendas: 0,
      }

      if (lider.red === "adultos") {
        adultos.push(reporteDefault)
      } else if (lider.red === "jovenes") {
        jovenes.push(reporteDefault)
      } else if (lider.red === "adolescentes") {
        adolescentes.push(reporteDefault)
      }
    })

    setReportesAdultos(adultos)
    setReportesJovenes(jovenes)
    setReportesAdolescentes(adolescentes)
  }

  const handleMarcarRevisado = (reporte: ReportePendiente) => {
    const nuevoReporte: ReporteRevisado = {
      lider: reporte.lider,
      miembros: reporte.asistencia - reporte.ninos,
      ninos: reporte.ninos,
      amigos: reporte.amigos,
      reconciliados: reporte.reconciliados,
      convertidos: reporte.convertidos,
      ofrendas: reporte.ofrenda,
    }

    if (reporte.red === "adultos") {
      setReportesAdultos(reportesAdultos.map((r) => (r.lider === reporte.lider ? nuevoReporte : r)))
    } else if (reporte.red === "jovenes") {
      setReportesJovenes(reportesJovenes.map((r) => (r.lider === reporte.lider ? nuevoReporte : r)))
    } else if (reporte.red === "adolescentes") {
      setReportesAdolescentes(reportesAdolescentes.map((r) => (r.lider === reporte.lider ? nuevoReporte : r)))
    }

    setReportesPendientes(reportesPendientes.filter((r) => r.id !== reporte.id))
  }

  const limpiarTablas = () => {
    inicializarTablas()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ" }).format(amount)
  }

  const calcularTotales = (reportes: ReporteRevisado[]) => {
    return {
      miembros: reportes.reduce((sum, r) => sum + r.miembros, 0),
      ninos: reportes.reduce((sum, r) => sum + r.ninos, 0),
      amigos: reportes.reduce((sum, r) => sum + r.amigos, 0),
      reconciliados: reportes.reduce((sum, r) => sum + r.reconciliados, 0),
      convertidos: reportes.reduce((sum, r) => sum + r.convertidos, 0),
      ofrendas: reportes.reduce((sum, r) => sum + r.ofrendas, 0),
    }
  }

  const renderTabla = (reportes: ReporteRevisado[], titulo: string, colorClass: string, borderColor: string) => {
    const totales = calcularTotales(reportes)

    return (
      <Card className={`border-2 ${borderColor}`}>
        <CardHeader className={`${colorClass} border-b-4 ${borderColor}`}>
          <CardTitle className="text-foreground font-bold">{titulo}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className={`${colorClass} border-b-2 ${borderColor}`}>
                  <th className="text-left p-4 text-foreground font-bold border-r border-border">Nombre del Líder</th>
                  <th className="text-left p-4 text-foreground font-bold border-r border-border">Miembros</th>
                  <th className="text-left p-4 text-foreground font-bold border-r border-border">Niños</th>
                  <th className="text-left p-4 text-foreground font-bold border-r border-border">Amigos</th>
                  <th className="text-left p-4 text-foreground font-bold border-r border-border">Reconciliados</th>
                  <th className="text-left p-4 text-foreground font-bold border-r border-border">Convertidos</th>
                  <th className="text-left p-4 text-foreground font-bold">Ofrendas</th>
                </tr>
              </thead>
              <tbody>
                {reportes.map((reporte, index) => {
                  const hasData =
                    reporte.miembros > 0 ||
                    reporte.ninos > 0 ||
                    reporte.amigos > 0 ||
                    reporte.reconciliados > 0 ||
                    reporte.convertidos > 0 ||
                    reporte.ofrendas > 0
                  const textColorClass = hasData ? "text-foreground" : "text-red-600 dark:text-red-400"

                  return (
                    <tr key={index} className="border-b border-border hover:bg-secondary/30">
                      <td className="p-4 text-foreground border-r border-border">{reporte.lider}</td>
                      <td className={`p-4 ${textColorClass} border-r border-border text-center font-semibold`}>
                        {reporte.miembros}
                      </td>
                      <td className={`p-4 ${textColorClass} border-r border-border text-center font-semibold`}>
                        {reporte.ninos}
                      </td>
                      <td className={`p-4 ${textColorClass} border-r border-border text-center font-semibold`}>
                        {reporte.amigos}
                      </td>
                      <td className={`p-4 ${textColorClass} border-r border-border text-center font-semibold`}>
                        {reporte.reconciliados}
                      </td>
                      <td className={`p-4 ${textColorClass} border-r border-border text-center font-semibold`}>
                        {reporte.convertidos}
                      </td>
                      <td className={`p-4 ${textColorClass} text-center font-semibold`}>
                        {formatCurrency(reporte.ofrendas)}
                      </td>
                    </tr>
                  )
                })}
                <tr className={`${colorClass} border-t-4 ${borderColor} font-bold`}>
                  <td className="p-4 text-foreground border-r border-border">TOTAL</td>
                  <td className="p-4 text-foreground border-r border-border text-center">{totales.miembros}</td>
                  <td className="p-4 text-foreground border-r border-border text-center">{totales.ninos}</td>
                  <td className="p-4 text-foreground border-r border-border text-center">{totales.amigos}</td>
                  <td className="p-4 text-foreground border-r border-border text-center">{totales.reconciliados}</td>
                  <td className="p-4 text-foreground border-r border-border text-center">{totales.convertidos}</td>
                  <td className="p-4 text-foreground text-center">{formatCurrency(totales.ofrendas)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Reporte Semanal</h1>
          <p className="text-muted-foreground mt-2">Reportes semanales detallados</p>
        </div>
        <Button
          onClick={limpiarTablas}
          variant="outline"
          className="w-full md:w-auto flex items-center gap-2 bg-transparent"
        >
          <Trash2 className="h-4 w-4" />
          Limpiar Tablas
        </Button>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Reportes Pendientes de Revisión</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportesPendientes.map((reporte) => (
            <Card key={reporte.id} className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-lg">{reporte.lider}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Fecha</span>
                  <span className="text-sm font-semibold text-foreground">{reporte.fecha}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Asistencia</span>
                  <span className="text-sm font-semibold text-foreground">{reporte.asistencia}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Niños</span>
                  <span className="text-sm font-semibold text-foreground">{reporte.ninos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Amigos</span>
                  <span className="text-sm font-semibold text-foreground">{reporte.amigos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Convertidos</span>
                  <span className="text-sm font-semibold text-foreground">{reporte.convertidos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Reconciliados</span>
                  <span className="text-sm font-semibold text-foreground">{reporte.reconciliados}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Ofrenda</span>
                  <span className="text-sm font-semibold text-accent">{formatCurrency(reporte.ofrenda)}</span>
                </div>
                <Button
                  onClick={() => handleMarcarRevisado(reporte)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Marcar como Revisado
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Reportes Revisados por Red</h2>
        {renderTabla(
          reportesAdultos,
          "Red de Adultos",
          "bg-blue-100 dark:bg-blue-900/40",
          "border-blue-500 dark:border-blue-400",
        )}
        {renderTabla(
          reportesJovenes,
          "Red de Jóvenes",
          "bg-red-100 dark:bg-red-900/40",
          "border-red-500 dark:border-red-400",
        )}
        {renderTabla(
          reportesAdolescentes,
          "Red de Adolescentes",
          "bg-yellow-100 dark:bg-yellow-900/40",
          "border-yellow-500 dark:border-yellow-400",
        )}
      </div>
    </div>
  )
}
