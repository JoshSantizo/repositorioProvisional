"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Eye, EyeOff } from "lucide-react"

export default function GestionUsuariosPage() {
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [newUser, setNewUser] = useState({
    usuario: "",
    password: "",
    confirmPassword: "",
    rol: "",
    liderSubred: "",
  })

  const roles = [
    { value: "Administración", label: "Administración" },
    { value: "Lider de Subred", label: "Líder de Subred" },
    { value: "Lider de Servicio", label: "Líder de Servicio" },
    { value: "Lider", label: "Líder" },
  ]

  const lideresSubred = [
    { value: "Josué Santizo", label: "Josué Santizo" },
    { value: "María González", label: "María González" },
  ]

  const handleCreateUser = () => {
    if (newUser.password !== newUser.confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }
    console.log("Creating user:", newUser)
    setShowUserDialog(false)
    setNewUser({ usuario: "", password: "", confirmPassword: "", rol: "", liderSubred: "" })
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Gestión de Usuarios</h1>
        <p className="text-muted-foreground mt-2">Administra usuarios y casas de paz</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Gestión de Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Crear, modificar y gestionar usuarios del sistema</p>
            <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
              <DialogTrigger asChild>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Crear Usuario
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Crear Nuevo Usuario</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Nombre de Usuario</Label>
                    <Input
                      type="text"
                      value={newUser.usuario}
                      onChange={(e) => setNewUser({ ...newUser, usuario: e.target.value })}
                      className="bg-background border-border mt-1"
                      placeholder="juan.perez"
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Contraseña</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="bg-background border-border mt-1 pr-10"
                        placeholder="••••••••"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-1 h-9 w-9"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Confirmar Contraseña</Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={newUser.confirmPassword}
                        onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                        className="bg-background border-border mt-1 pr-10"
                        placeholder="••••••••"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-1 h-9 w-9"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Rol</Label>
                    <Select value={newUser.rol} onValueChange={(value) => setNewUser({ ...newUser, rol: value })}>
                      <SelectTrigger className="bg-background border-border mt-1">
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((rol) => (
                          <SelectItem key={rol.value} value={rol.value}>
                            {rol.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {newUser.rol === "Lider" && (
                    <div>
                      <Label className="text-muted-foreground">Líder de Subred</Label>
                      <Select
                        value={newUser.liderSubred}
                        onValueChange={(value) => setNewUser({ ...newUser, liderSubred: value })}
                      >
                        <SelectTrigger className="bg-background border-border mt-1">
                          <SelectValue placeholder="Selecciona un líder de subred" />
                        </SelectTrigger>
                        <SelectContent>
                          {lideresSubred.map((lider) => (
                            <SelectItem key={lider.value} value={lider.value}>
                              {lider.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <Button onClick={handleCreateUser} className="w-full bg-accent text-accent-foreground">
                    Crear Usuario
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
