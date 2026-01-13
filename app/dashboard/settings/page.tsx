import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground text-balance">Configuración</h1>
        <p className="text-muted-foreground mt-2">Gestiona las preferencias de tu cuenta</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Información Personal</CardTitle>
            <CardDescription className="text-muted-foreground">Actualiza tu información de perfil</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Nombre
              </Label>
              <Input id="name" defaultValue="Usuario Demo" className="bg-secondary border-border text-foreground" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                defaultValue="usuario@demo.com"
                className="bg-secondary border-border text-foreground"
              />
            </div>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Guardar Cambios</Button>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Seguridad</CardTitle>
            <CardDescription className="text-muted-foreground">
              Administra tu contraseña y seguridad de la cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-foreground">
                Contraseña Actual
              </Label>
              <Input id="current-password" type="password" className="bg-secondary border-border text-foreground" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-foreground">
                Nueva Contraseña
              </Label>
              <Input id="new-password" type="password" className="bg-secondary border-border text-foreground" />
            </div>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Actualizar Contraseña</Button>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Notificaciones</CardTitle>
            <CardDescription className="text-muted-foreground">
              Configura cómo quieres recibir notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Notificaciones por Email</p>
                <p className="text-sm text-muted-foreground">Recibe actualizaciones por correo</p>
              </div>
              <Button variant="outline" size="sm" className="border-border text-foreground bg-transparent">
                Activar
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Notificaciones Push</p>
                <p className="text-sm text-muted-foreground">Recibe notificaciones en tiempo real</p>
              </div>
              <Button variant="outline" size="sm" className="border-border text-foreground bg-transparent">
                Desactivar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Contáctanos</CardTitle>
            <CardDescription className="text-muted-foreground">
              Si deseas contactarte con el departamento de la visión o reportar algún problema con la plataforma puedes
              llamar a los siguientes números:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
              <Phone className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">Departamento de la visión</p>
                <p className="text-lg font-semibold text-accent">7760-5126</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
              <Phone className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">Pastora Briana de León</p>
                <p className="text-lg font-semibold text-accent">4133-8946</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
              <Phone className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">Diácono Josué Santizo</p>
                <p className="text-lg font-semibold text-accent">4262-2810</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
