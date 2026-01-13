"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip, Bar, BarChart } from "recharts"
import { getUserSession } from "@/lib/auth"
import { useEffect, useState } from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function EstadisticasPage() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [selectedLiderSubred, setSelectedLiderSubred] = useState<string>("")
  const [selectedLider, setSelectedLider] = useState<string>("")

  const lideresSubred = [{ value: "josue", label: "Josué Santizo" }]

  const lideresBySubred: Record<string, Array<{ value: string; label: string }>> = {
    josue: [
      { value: "lider1", label: "Daniela Juarez" },
      { value: "lider2", label: "Marco Antonio López" },
      { value: "lider3", label: "Sofia García" },
    ],
  }

  const availableLideres =
    selectedLiderSubred && lideresBySubred[selectedLiderSubred] ? lideresBySubred[selectedLiderSubred] : []

  useEffect(() => {
    const user = getUserSession()
    if (user) {
      setUserRole(user.role)
    }
  }, [])

  const lideres = [
    { value: "lider1", label: "Daniela Juarez" },
    { value: "lider2", label: "Marco Antonio López" },
    { value: "lider3", label: "Sofia García" },
  ]

  const weeklyData = [
    { semana: "Semana 1", adultos: 18, ninos: 1, total: 19 },
    { semana: "Semana 2", adultos: 20, ninos: 1, total: 21 },
    { semana: "Semana 3", adultos: 18, ninos: 2, total: 20 },
    { semana: "Semana 4", adultos: 23, ninos: 0, total: 23 },
    { semana: "Semana 5", adultos: 15, ninos: 0, total: 15 },
    { semana: "Semana 6", adultos: 22, ninos: 2, total: 24 },
    { semana: "Semana 7", adultos: 19, ninos: 1, total: 20 },
    { semana: "Semana 8", adultos: 21, ninos: 3, total: 24 },
  ]

  const averageAttendance = Math.round(weeklyData.reduce((sum, week) => sum + week.total, 0) / weeklyData.length)

  const visitasEsteMes = 8
  const visitasMesAnterior = 5
  const crecimientoVisitas = visitasEsteMes - visitasMesAnterior

  if (userRole === "Administración" && !selectedLider) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Estadísticas</h1>
          <p className="text-muted-foreground mt-2">Visualiza métricas y análisis detallados</p>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Seleccionar Líder</CardTitle>
            <div className="text-sm text-muted-foreground">Elige el líder para ver sus estadísticas</div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-muted-foreground mb-2 block">Líder de Subred</Label>
              <Select
                value={selectedLiderSubred}
                onValueChange={(value) => {
                  setSelectedLiderSubred(value)
                  setSelectedLider("") // Reset líder when subred changes
                }}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Selecciona un líder de subred" />
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

            {selectedLiderSubred && (
              <div>
                <Label className="text-muted-foreground mb-2 block">Líder</Label>
                <Select value={selectedLider} onValueChange={setSelectedLider}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Selecciona un líder" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLideres.map((lider) => (
                      <SelectItem key={lider.value} value={lider.value}>
                        {lider.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Estadísticas</h1>
        <p className="text-muted-foreground mt-2">Visualiza métricas y análisis detallados</p>
      </div>

      {userRole === "Administración" && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Filtros</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground mb-2 block">Líder de Subred</Label>
              <Select
                value={selectedLiderSubred}
                onValueChange={(value) => {
                  setSelectedLiderSubred(value)
                  setSelectedLider("")
                }}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
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
              <Label className="text-muted-foreground mb-2 block">Líder</Label>
              <Select value={selectedLider} onValueChange={setSelectedLider}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableLideres.map((lider) => (
                    <SelectItem key={lider.value} value={lider.value}>
                      {lider.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {userRole === "Lider de Subred" && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Líder Seleccionado</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedLider} onValueChange={setSelectedLider}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Selecciona un líder" />
              </SelectTrigger>
              <SelectContent>
                {lideres.map((lider) => (
                  <SelectItem key={lider.value} value={lider.value}>
                    {lider.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="border-border">
          <CardHeader>
            <div className="text-sm text-muted-foreground">Asistencia Promedio</div>
            <CardTitle className="text-3xl font-bold text-foreground">{averageAttendance}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-accent">Últimas 8 semanas</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <div className="text-sm text-muted-foreground">Visitas Este Mes</div>
            <CardTitle className="text-3xl font-bold text-foreground">{visitasEsteMes}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-sm ${crecimientoVisitas >= 0 ? "text-green-500" : "text-red-500"}`}>
              {crecimientoVisitas >= 0 ? "+" : ""}
              {crecimientoVisitas} vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <div className="text-sm text-muted-foreground">Tasa de Retención</div>
            <CardTitle className="text-3xl font-bold text-foreground">92%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-accent">Muy buena</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Asistencia Semanal por Grupos de Edad</CardTitle>
          <div className="text-sm text-muted-foreground">Últimas 8 semanas</div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={weeklyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="semana" style={{ fontSize: "12px", fill: "hsl(var(--foreground))" }} />
              <YAxis style={{ fontSize: "12px", fill: "hsl(var(--foreground))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px", color: "hsl(var(--foreground))" }} iconType="rect" />
              <Bar dataKey="adultos" fill="#3b82f6" name="Miembros" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ninos" fill="#eab308" name="Niños" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
