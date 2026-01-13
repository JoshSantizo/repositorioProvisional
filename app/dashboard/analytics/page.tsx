"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function AnalyticsPage() {
  const data = [
    { mes: "Enero", reportes: 45, color: "#3b82f6", fecha: "Enero 2026" },
    { mes: "Febrero", reportes: 52, color: "#10b981", fecha: "Febrero 2026" },
    { mes: "Marzo", reportes: 48, color: "#3b82f6", fecha: "Marzo 2026" },
    { mes: "Abril", reportes: 61, color: "#10b981", fecha: "Abril 2026" },
    { mes: "Mayo", reportes: 55, color: "#3b82f6", fecha: "Mayo 2026" },
    { mes: "Junio", reportes: 67, color: "#10b981", fecha: "Junio 2026" },
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
          <p className="text-foreground font-semibold">{payload[0].payload.fecha}</p>
          <p className="text-muted-foreground">{`Reportes: ${payload[0].value}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground text-balance">Estadísticas</h1>
        <p className="text-muted-foreground mt-2">Visualiza las métricas y estadísticas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Reportes Mensuales</CardTitle>
            <CardDescription className="text-muted-foreground">Reportes por mes</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mes" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="reportes" radius={[8, 8, 0, 0]}>
                  {data.map((entry, index) => (
                    <Bar key={`bar-${index}`} dataKey="reportes" fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Tasa de Conversión</CardTitle>
            <CardDescription className="text-muted-foreground">Usuarios que completaron acciones</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="text-center">
              <p className="text-6xl font-bold text-accent">68%</p>
              <p className="text-muted-foreground mt-2">+5% desde el mes pasado</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Estadísticas Detalladas</CardTitle>
            <CardDescription className="text-muted-foreground">Métricas clave del rendimiento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Tiempo Promedio</p>
                <p className="text-3xl font-bold text-foreground">4m 32s</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Páginas por Sesión</p>
                <p className="text-3xl font-bold text-foreground">5.2</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Tasa de Rebote</p>
                <p className="text-3xl font-bold text-foreground">32%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
