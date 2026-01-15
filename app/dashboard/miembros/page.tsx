"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { getUserSession } from "@/lib/auth"
import { normalizeText } from "@/lib/utils"
import toast from 'react-hot-toast';

// --- INTERFACES ---
interface Miembro {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
  referencia: string;
  sexo: string;
  fechaNacimiento: string;
  edad: number;
  fechaConversion: string;
  fechaBautizo?: string;
  fechaBoda?: string;
  estado: string;
  lider: string;
  liderSubred?: string;
  ministerios: string[];
  procesoVision: Record<string, string>;
}

interface MinisterioDB {
  id: number;
  nombre: string;
}

export default function MiembrosPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [miembros, setMiembros] = useState<Miembro[]>([])
  const [ministeriosLista, setMinisteriosLista] = useState<MinisterioDB[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Sesión y Roles
  const user = getUserSession()
  const userRole = (user?.rol as string) || ""
  const esAdmin = userRole === "Administración"

  // Diálogos y Modales
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Miembro | null>(null)
  const [editMode, setEditMode] = useState(false)

  // --- ESTADOS DE EDICIÓN ---
  const [editNombre, setEditNombre] = useState("")
  const [editTelefono, setEditTelefono] = useState("")
  const [editDireccion, setEditDireccion] = useState("")
  const [editReferencia, setEditReferencia] = useState("")
  const [editFechaNacimiento, setEditFechaNacimiento] = useState("")
  const [editSexo, setEditSexo] = useState<string>("Masculino")
  const [editEstado, setEditEstado] = useState<string>("Activo")
  const [editFechaConversion, setEditFechaConversion] = useState("")
  const [editFechaBautizo, setEditFechaBautizo] = useState("")
  const [editFechaBoda, setEditFechaBoda] = useState("")
  const [editMinisterios, setEditMinisterios] = useState<string[]>([])
  const [editProcesoVision, setEditProcesoVision] = useState<Record<string, string>>({})

  // --- ESTADO NUEVO MIEMBRO ---
  const [newMember, setNewMember] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
    referencia: "",
    fechaNacimiento: "",
    sexo: "Masculino",
    fechaConversion: "",
    fechaBautizo: "",
    fechaBoda: "",
    ministerios: [] as string[]
  })

  const cargarDatos = useCallback(async () => {
    if (!user?.token) return;
    try {
      setLoading(true);
      const resMin = await fetch("https://portal.erg-backend.online/api/ministerios", { 
        headers: { "Authorization": `Bearer ${user.token}` } 
      });
      
      if (resMin.ok) {
        const data = await resMin.json();
        console.log("Ministerios cargados:", data); // Revisa esto en la consola del navegador (F12)
        setMinisteriosLista(Array.isArray(data) ? data : []);
      } else {
        console.error("Error al cargar ministerios:", resMin.status);
      }

      const resM = await fetch("https://portal.erg-backend.online/api/miembros-universal", { 
        headers: { "Authorization": `Bearer ${user.token}` } 
      });
      if (resM.ok) setMiembros(await resM.json());

    } catch (error) {
      console.error("Error de conexión:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => { cargarDatos() }, [cargarDatos])

  // Este useEffect se ejecuta SOLO en el cliente después del primer render
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // --- FUNCIONES DE ACCIÓN ---
  const handleOpenDetails = (m: Miembro) => {
    setSelectedMember(m)
    setEditNombre(m.nombre)
    setEditTelefono(m.telefono)
    setEditDireccion(m.direccion)
    setEditReferencia(m.referencia)
    setEditFechaNacimiento(m.fechaNacimiento?.split('T')[0] || "")
    setEditSexo(m.sexo)
    setEditEstado(m.estado)
    setEditFechaConversion(m.fechaConversion?.split('T')[0] || "")
    setEditFechaBautizo(m.fechaBautizo?.split('T')[0] || "")
    setEditFechaBoda(m.fechaBoda?.split('T')[0] || "")
    setEditMinisterios(m.ministerios)
    setEditProcesoVision(m.procesoVision)
    setDetailsOpen(true)
  }

const toggleMinisterio = (nombre: string, isEdit: boolean = false) => {
    if (isEdit) {
      setEditMinisterios((prev) =>
        prev.includes(nombre) ? prev.filter((min) => min !== nombre) : [...prev, nombre]
      );
    } else {
      setNewMember((prev) => ({
        ...prev,
        ministerios: prev.ministerios.includes(nombre)
          ? prev.ministerios.filter((m) => m !== nombre)
          : [...prev.ministerios, nombre],
      }));
    }
  };

 const handleUpdate = async () => {
    if (!user?.token || !selectedMember) return;
    try {
      const res = await fetch(`https://portal.erg-backend.online/api/miembros-universal/${selectedMember.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          nombre: editNombre,
          telefono: editTelefono,
          direccion: editDireccion,
          referencia: editReferencia,
          fechaNacimiento: editFechaNacimiento,
          sexo: editSexo,
          estado: editEstado,
          fechaConversion: editFechaConversion,
          fechaBautizo: editFechaBautizo,
          fechaBoda: editFechaBoda,
          ministerios: editMinisterios,
          procesoVision: editProcesoVision,
        }),
      });

      if (res.ok) {
        setEditMode(false);
        setDetailsOpen(false);
        cargarDatos();
      } else {
        alert("Error al actualizar los datos");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    }
  };

  const handleCreateMember = async () => {
    if (!user?.token) return;
    
    if (!newMember.nombre || !newMember.fechaNacimiento) {
        toast.error("Nombre y Fecha de Nacimiento son obligatorios");
        return;
    }

    const promise = async () => {
      // 1. Transformamos los Ministerios de Nombres a IDs
      const ministeriosSeleccionados = newMember.ministerios
        .map(nombre => ministeriosLista.find(m => m.nombre === nombre)?.id)
        .filter(id => id !== undefined);

      // 2. Creamos el objeto con el formato exacto que pide el Backend
      const datosParaBackend = {
        nombre: newMember.nombre,
        id_lider: user?.id, // Enviamos el ID del líder loggeado (ej: 39)
        telefono: newMember.telefono,
        direccion: newMember.direccion,
        referencia: newMember.referencia,
        sexo: newMember.sexo.charAt(0).toUpperCase(), 
        fecha_nacimiento: newMember.fechaNacimiento,
        fecha_conversion: newMember.fechaConversion || null,
        fecha_bautizo: newMember.fechaBautizo || null,
        fecha_boda: newMember.fechaBoda || null,
        ministeriosSeleccionados: ministeriosSeleccionados
      };

      const res = await fetch("https://portal.erg-backend.online/api/miembros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify(datosParaBackend),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("Respuesta del servidor:", txt);
        // Intentamos extraer el mensaje de error del JSON si es posible
        let mensajeError = "Error en el servidor al crear";
        try {
            const errorJson = JSON.parse(txt);
            mensajeError = errorJson.error || mensajeError;
        } catch (e) { /* se queda el mensaje por defecto */ }
        
        throw new Error(mensajeError);
      }
      
      setShowAddDialog(false);
      setNewMember({
        nombre: "", telefono: "", direccion: "", referencia: "",
        fechaNacimiento: "", sexo: "Masculino", fechaConversion: "",
        fechaBautizo: "", fechaBoda: "", ministerios: []
      });
      cargarDatos();
      return "Miembro registrado correctamente";
    };

    toast.promise(promise(), {
      loading: 'Enviando datos...',
      success: (data) => data,
      error: (err) => err.message,
    });
};

  const confirmDelete = async () => {
    if (!user?.token || !selectedMember) return;
    try {
      const res = await fetch(`https://portal.erg-backend.online/api/miembros/${selectedMember.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${user.token}` },
      });

      if (res.ok) {
        setDeleteDialogOpen(false);
        setDetailsOpen(false);
        cargarDatos();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold uppercase tracking-tighter">Miembros</h1>

        {/* Reemplaza el bloque {userRole === "Lider" && ...} por este: */}
      {hasMounted && (userRole === "Lider" || userRole === "Líder") && (
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 w-full md:w-auto font-bold uppercase">
              Crear Miembro
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Miembro</DialogTitle>
                <DialogDescription>Ingresa los datos del nuevo miembro</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Nombre Completo</Label>
                  <Input value={newMember.nombre} onChange={e => setNewMember({...newMember, nombre: e.target.value})} placeholder="Nombre completo" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Teléfono</Label>
                        <Input value={newMember.telefono} onChange={e => setNewMember({...newMember, telefono: e.target.value})} placeholder="1234-5678" />
                    </div>
                    <div className="space-y-2">
                        <Label>Sexo</Label>
                        <Select value={newMember.sexo} onValueChange={(v) => setNewMember({...newMember, sexo: v})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Masculino">Masculino</SelectItem>
                                <SelectItem value="Femenino">Femenino</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="space-y-2">
                  <Label>Dirección</Label>
                  <Input value={newMember.direccion} onChange={e => setNewMember({...newMember, direccion: e.target.value})} placeholder="Dirección completa" />
                </div>
                <div className="space-y-2">
                  <Label>Referencia</Label>
                  <Input value={newMember.referencia} onChange={e => setNewMember({...newMember, referencia: e.target.value})} placeholder="Punto de referencia" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fecha de Nacimiento</Label>
                    <Input type="date" value={newMember.fechaNacimiento} onChange={e => setNewMember({...newMember, fechaNacimiento: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Fecha de Conversión</Label>
                    <Input type="date" value={newMember.fechaConversion} onChange={e => setNewMember({...newMember, fechaConversion: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fecha de Bautizo</Label>
                    <Input type="date" value={newMember.fechaBautizo} onChange={e => setNewMember({...newMember, fechaBautizo: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Fecha de Boda (Opcional)</Label>
                    <Input type="date" value={newMember.fechaBoda} onChange={e => setNewMember({...newMember, fechaBoda: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Ministerios</Label>
                  <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto border border-border rounded-lg p-4 bg-muted/10">
                    {ministeriosLista.map((min) => (
                      <div key={min.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`new-min-${min.id}`} 
                          checked={newMember.ministerios.includes(min.nombre)} 
                          onCheckedChange={() => toggleMinisterio(min.nombre, false)} 
                        />
                        <label htmlFor={`new-min-${min.id}`} className="text-sm font-medium cursor-pointer">{min.nombre}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <Button onClick={handleCreateMember} className="w-full bg-accent text-accent-foreground font-bold">CREAR MIEMBRO</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Input 
          placeholder="Buscar miembro..." 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
          className="max-w-sm" 
        />
      </div>

      {/* TABLA PRINCIPAL */}
      <Card className="border-border mt-6">
        <CardHeader>
              <CardTitle className="text-foreground">Lista de Miembros</CardTitle>
            </CardHeader>
        <CardContent>
          <div className="min-h-[600px]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-3 px-4 text-foreground font-semibold">Nombre</th>
                    <th className="text-left py-3 px-4 text-foreground font-semibold">Fecha de Nacimiento</th>
                    <th className="text-left py-3 px-4 text-foreground font-semibold">Detalles</th>
                  </tr>
                </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={3} className="p-10 text-center font-bold">Cargando registros...</td></tr>
              ) : miembros.filter(m => normalizeText(m.nombre).includes(normalizeText(searchQuery))).map(m => (
                <tr key={m.id} className="border-b hover:bg-muted/20 transition-colors uppercase">
                  <td className="p-4 font-bold">{m.nombre}</td>
                  <td className="p-4 font-medium">{new Date(m.fechaNacimiento).toLocaleDateString("es-GT")}</td>
                  <td className="p-4 text-right">
                    <Button variant="outline" size="sm" className="font-bold" onClick={() => handleOpenDetails(m)}>VER DETALLES</Button>
                  </td>
                </tr>
              ))}
            </tbody>

            
          </table>
          </div>
          </div>
        </CardContent>
      </Card>

      {/* DETAILS DIALOG */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="bg-card border-border max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Detalles del Miembro</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle className="text-lg">Datos Generales</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-sm">Nombre Completo</Label>
                      {editMode && esAdmin ? <Input value={editNombre} onChange={e => setEditNombre(e.target.value)} className="mt-1" /> : <p className="font-medium">{selectedMember.nombre}</p>}
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-sm">Teléfono</Label>
                      {editMode ? <Input value={editTelefono} onChange={e => setEditTelefono(e.target.value)} className="mt-1" /> : <p className="font-medium">{selectedMember.telefono}</p>}
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-sm">Dirección</Label>
                      {editMode ? <Input value={editDireccion} onChange={e => setEditDireccion(e.target.value)} className="mt-1" /> : <p className="font-medium">{selectedMember.direccion}</p>}
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-sm">Referencia</Label>
                      {editMode ? <Input value={editReferencia} onChange={e => setEditReferencia(e.target.value)} className="mt-1" /> : <p className="font-medium">{selectedMember.referencia || "Sin referencia"}</p>}
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-sm">Fecha de Nacimiento</Label>
                      {editMode && esAdmin ? <Input type="date" value={editFechaNacimiento} onChange={e => setEditFechaNacimiento(e.target.value)} className="mt-1" /> : <p className="font-medium">{new Date(selectedMember.fechaNacimiento).toLocaleDateString("es-GT")}</p>}
                    </div>
                    <div><Label className="text-muted-foreground text-sm">Edad</Label><p className="font-medium">{selectedMember.edad} años</p></div>
                    <div>
                      <Label className="text-muted-foreground text-sm">Sexo</Label>
                      {editMode && esAdmin ? (
                        <Select value={editSexo} onValueChange={v => setEditSexo(v)}>
                            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="Masculino">Masculino</SelectItem><SelectItem value="Femenino">Femenino</SelectItem></SelectContent>
                        </Select>
                      ) : <p className="font-medium">{selectedMember.sexo}</p>}
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-sm">Estado</Label>
                      {editMode && esAdmin ? (
                        <Select value={editEstado} onValueChange={v => setEditEstado(v)}>
                            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="Activo">Activo</SelectItem><SelectItem value="Inactivo">Inactivo</SelectItem></SelectContent>
                        </Select>
                      ) : <p className={`font-medium ${selectedMember.estado === 'Activo' ? 'text-green-600' : 'text-red-600'}`}>{selectedMember.estado}</p>}
                    </div>
                    <div>
                        <Label className="text-muted-foreground text-sm">Líder</Label>
                        <p className="font-medium">{selectedMember.lider || "No asignado"}</p>
                    </div>
                    <div>
                        <Label className="text-muted-foreground text-sm">Fecha de Conversión</Label>
                        {editMode && esAdmin ? <Input type="date" value={editFechaConversion} onChange={e => setEditFechaConversion(e.target.value)} className="mt-1" /> : <p className="font-medium">{new Date(selectedMember.fechaConversion).toLocaleDateString("es-GT")}</p>}
                    </div>

                    <div>
                      <Label className="text-muted-foreground text-sm">Fecha de Bautizo</Label>
                      {editMode && esAdmin ? (
                        <Input 
                          type="date" 
                          value={editFechaBautizo} 
                          onChange={e => setEditFechaBautizo(e.target.value)} 
                          className="mt-1" 
                        />
                      ) : (
                        <p className="font-medium">
                          {selectedMember.fechaBautizo ? new Date(selectedMember.fechaBautizo).toLocaleDateString("es-GT") : "No registrado"}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-sm">Fecha de Boda</Label>
                      {editMode && esAdmin ? (
                        <Input 
                          type="date" 
                          value={editFechaBoda} 
                          onChange={e => setEditFechaBoda(e.target.value)} 
                          className="mt-1" 
                        />
                      ) : (
                        <p className="font-medium">
                          {selectedMember.fechaBoda ? new Date(selectedMember.fechaBoda).toLocaleDateString("es-GT") : "No registrado"}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                    <div className="md:col-span-2">
                          <Label className="text-muted-foreground text-sm">Ministerios</Label>
                          {editMode && userRole === "Administración" ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                              {ministeriosLista.map((min) => (
                                <div key={min.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`edit-ministerio-${min}`}
                                    checked={editMinisterios.includes(min.nombre)}
                                    onCheckedChange={() => toggleMinisterio(min.nombre, false)}
                                  />
                                  <label
                                    htmlFor={`edit-ministerio-${min}`}
                                    className="text-sm text-foreground cursor-pointer"
                                  >
                                    {min.nombre}
                                  </label>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2 mt-1">
                              {selectedMember.ministerios.map((ministerio, idx) => (
                                <span
                                  key={idx}
                                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                                >
                                  {ministerio}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                  </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-lg">Proceso de la Visión</CardTitle></CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(editMode && esAdmin ? editProcesoVision : selectedMember.procesoVision).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                                <span className="text-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                                {editMode && esAdmin ? (
                                    <Select value={value} onValueChange={(nv) => setEditProcesoVision({...editProcesoVision, [key]: nv})}>
                                        <SelectTrigger className="w-[140px] bg-background"><SelectValue /></SelectTrigger>
                                        <SelectContent><SelectItem value="Completado">Completado</SelectItem><SelectItem value="Pendiente">Pendiente</SelectItem></SelectContent>
                                    </Select>
                                ) : (
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${value === "Completado" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{value}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
              </Card>

              <div className="flex flex-col md:flex-row gap-3">
                {editMode ? (
                  <>
                    <Button onClick={handleUpdate} className="flex-1 bg-accent text-accent-foreground font-bold">GUARDAR CAMBIOS</Button>
                    <Button onClick={() => setEditMode(false)} variant="outline" className="flex-1 font-bold">CANCELAR</Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => setEditMode(true)} className="flex-1 bg-accent text-accent-foreground font-bold">ACTUALIZAR</Button>
                    <Button onClick={() => setDeleteDialogOpen(true)} variant="destructive" className="flex-1 font-bold">ELIMINAR</Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Member Dialog - Only for Lider role */}
      {userRole === "Lider" && (
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Miembro</DialogTitle>
              <DialogDescription>Ingresa los datos del nuevo miembro</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-nombre">Nombre Completo</Label>
                <Input
                  id="new-nombre"
                  value={newMember.nombre}
                  onChange={(e) => setNewMember({ ...newMember, nombre: e.target.value })}
                  placeholder="Nombre completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-telefono">Teléfono</Label>
                <Input
                  id="new-telefono"
                  value={newMember.telefono}
                  onChange={(e) => setNewMember({ ...newMember, telefono: e.target.value })}
                  placeholder="1234-5678"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-direccion">Dirección</Label>
                <Input
                  id="new-direccion"
                  value={newMember.direccion}
                  onChange={(e) => setNewMember({ ...newMember, direccion: e.target.value })}
                  placeholder="Dirección completa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-referencia">Referencia</Label>
                <Input
                  id="new-referencia"
                  value={newMember.referencia}
                  onChange={(e) => setNewMember({ ...newMember, referencia: e.target.value })}
                  placeholder="Punto de referencia"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-fechaNacimiento">Fecha de Nacimiento</Label>
                  <Input
                    id="new-fechaNacimiento"
                    type="date"
                    value={newMember.fechaNacimiento}
                    onChange={(e) => setNewMember({ ...newMember, fechaNacimiento: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-sexo">Sexo</Label>
                  <Select
                    value={newMember.sexo}
                    onValueChange={(value) => setNewMember({ ...newMember, sexo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Femenino">Femenino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-fechaConversion">Fecha de Conversión</Label>
                  <Input
                    id="new-fechaConversion"
                    type="date"
                    value={newMember.fechaConversion}
                    onChange={(e) => setNewMember({ ...newMember, fechaConversion: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-fechaBautizo">Fecha de Bautizo</Label>
                  <Input
                    id="new-fechaBautizo"
                    type="date"
                    value={newMember.fechaBautizo}
                    onChange={(e) => setNewMember({ ...newMember, fechaBautizo: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-fechaBoda">Fecha de Boda (Opcional)</Label>
                <Input
                  id="new-fechaBoda"
                  type="date"
                  value={newMember.fechaBoda}
                  onChange={(e) => setNewMember({ ...newMember, fechaBoda: e.target.value })}
                />
              </div>
              <div className="space-y-2">
              <Label className="font-bold text-accent uppercase text-xs">Asignar Ministerios</Label>
              <div className="grid grid-cols-2 gap-3 min-h-[120px] max-h-60 overflow-y-auto border-2 border-dashed border-muted rounded-lg p-4 bg-muted/5">
                {ministeriosLista.length > 0 ? (
                  ministeriosLista.map((min) => (
                    <div key={min.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted transition-colors">
                      <Checkbox
                        id={`new-min-${min.id}`}
                        checked={newMember.ministerios.includes(min.nombre)}
                        onCheckedChange={() => toggleMinisterio(min.nombre, false)}
                      />
                      <label 
                        htmlFor={`new-min-${min.id}`} 
                        className="text-sm font-semibold cursor-pointer select-none leading-none"
                      >
                        {min.nombre}
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 flex flex-col items-center justify-center py-4 text-muted-foreground">
                    <span className="text-xs italic">No se encontraron ministerios disponibles</span>
                    <Button variant="ghost" size="sm" onClick={cargarDatos} className="mt-2 text-[10px]">REINTENTAR CARGA</Button>
                  </div>
                )}
              </div>
            </div>
              <Button onClick={handleCreateMember} className="w-full bg-accent text-accent-foreground">
                Crear Miembro
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción marcará al miembro como Inactivo. No podrá ser visualizado en listas de asistencia activas.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground font-bold">ELIMINAR</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}