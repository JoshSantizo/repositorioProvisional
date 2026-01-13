import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ProjectsPage() {
  const projects = [
    { id: 1, name: "Proyecto Alpha", status: "Activo", progress: 75 },
    { id: 2, name: "Proyecto Beta", status: "En Desarrollo", progress: 45 },
    { id: 3, name: "Proyecto Gamma", status: "Completado", progress: 100 },
    { id: 4, name: "Proyecto Delta", status: "En Espera", progress: 20 },
  ]

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground text-balance">Proyectos</h1>
          <p className="text-muted-foreground mt-2">Gestiona todos tus proyectos en un solo lugar</p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Proyecto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">{project.name}</CardTitle>
              <CardDescription className="text-muted-foreground">{project.status}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Progreso</span>
                  <span className="text-sm font-medium text-foreground">{project.progress}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-accent rounded-full h-2 transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full border-border text-foreground hover:bg-secondary bg-transparent"
              >
                Ver Detalles
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
