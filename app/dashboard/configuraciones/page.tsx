"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { getTheme, setTheme, type Theme } from "@/lib/theme"
import { getUserSession } from "@/lib/auth"
import { ENDPOINTS } from "@/lib/api-config"
import { cn } from "@/lib/utils"

export default function ConfiguracionesPage() {
  const [selectedTheme, setSelectedTheme] = useState<Theme>("dark")
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Nombres de estado ajustados para coincidir con lo que el Backend espera recibir
  const [passwordActual, setPasswordActual] = useState("")
  const [nuevaPassword, setNuevaPassword] = useState("")
  const [confirmarPassword, setConfirmarPassword] = useState("")
  
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)
  const [userName, setUserName] = useState("")
  const [userRole, setUserRole] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const theme = getTheme()
    setSelectedTheme(theme)
    const user = getUserSession()
    if (user) {
      setUserName(user.nombre)
      setUserRole(user.rol)
    }
  }, [])

  const handleThemeChange = (theme: Theme) => {
    setSelectedTheme(theme)
    setTheme(theme)
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setIsError(false)

    // Validación básica en el cliente antes de enviar
    if (nuevaPassword !== confirmarPassword) {
      setMessage("La nueva contraseña y la confirmación no coinciden.")
      setIsError(true)
      return
    }

    setIsLoading(true)
    const user = getUserSession()

    try {
      const response = await fetch(ENDPOINTS.updatePassword, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          passwordActual,   // Coincide con tu Backend
          nuevaPassword,    // Coincide con tu Backend
          confirmarPassword // Coincide con tu Backend
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("¡Contraseña actualizada con éxito!")
        setIsError(false)
        // Limpiar campos tras éxito
        setPasswordActual("")
        setNuevaPassword("")
        setConfirmarPassword("")
      } else {
        setMessage(data.mensaje || "Error al actualizar")
        setIsError(true)
      }
    } catch (error) {
      setMessage("Error de conexión con el servidor")
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Configuraciones</h1>
        <p className="text-muted-foreground mt-2">Personaliza tu experiencia</p>
      </div>

      {userName && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Información del Usuario</CardTitle>
            <CardDescription>Tu perfil en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-accent-foreground">{userName.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="text-lg font-semibold">{userName}</p>
                <p className="text-sm text-muted-foreground">{userRole}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selector de Temas */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Tema de la Aplicación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(["dark", "light", "blue"] as Theme[]).map((t) => (
              <button
                key={t}
                onClick={() => handleThemeChange(t)}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all hover:scale-105",
                  selectedTheme === t ? "border-accent bg-accent/5" : "border-border"
                )}
              >
                <div className={cn(
                  "w-full h-24 rounded mb-3 flex items-center justify-center",
                  t === "dark" ? "bg-gray-900" : t === "light" ? "bg-white border" : "bg-blue-900"
                )}>
                  <span className={cn("text-sm font-medium", t === "light" ? "text-gray-900" : "text-white")}>
                    {t === "dark" ? "Oscuro" : t === "light" ? "Claro" : "Azul"}
                  </span>
                </div>
                <p className="text-sm font-medium text-center">Tema {t.charAt(0).toUpperCase() + t.slice(1)}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cambio de Contraseña */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Cambiar Contraseña</CardTitle>
          <CardDescription>Actualiza tu clave de acceso</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {message && (
              <div className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium border",
                isError ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-green-500/10 text-green-500 border-green-500/20"
              )}>
                {message}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="passwordActual">Contraseña Actual</Label>
              <div className="relative">
                <Input
                  id="passwordActual"
                  type={showPassword ? "text" : "password"}
                  value={passwordActual}
                  onChange={(e) => setPasswordActual(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-secondary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  <PasswordIcon show={showPassword} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nuevaPassword">Nueva Contraseña</Label>
              <div className="relative">
                <Input
                  id="nuevaPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={nuevaPassword}
                  onChange={(e) => setNuevaPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-secondary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  <PasswordIcon show={showNewPassword} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmarPassword">Confirmar Nueva Contraseña</Label>
              <div className="relative">
                <Input
                  id="confirmarPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-secondary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  <PasswordIcon show={showConfirmPassword} />
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={isLoading}
            >
              {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function PasswordIcon({ show }: { show: boolean }) {
  return show ? (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  )
}