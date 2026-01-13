import { ENDPOINTS } from "./api-config";

export type UserRole = "Super Admin" | "Administración" | "Líder de Subred" | "Líder de Servicio" | "Líder";

export interface UserSession {
  id: number;
  nombre: string;
  rol: UserRole;
  token: string;
}

interface LoginResponse {
  mensaje: string;
  token: string;
  usuario: {
    id: number;
    nombre: string;
    rol: string;
  };
}

export async function loginWithBackend(nombre: string, contrasena: string): Promise<UserSession | null> {
  try {
    const response = await fetch(ENDPOINTS.login, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        nombre: nombre, 
        contraseña: contrasena 
      }),
    });

    if (!response.ok) return null;

    const data: LoginResponse = await response.json();
    
    return {
      id: data.usuario.id,
      nombre: data.usuario.nombre,
      rol: data.usuario.rol as UserRole, // Cast para evitar error de TS
      token: data.token
    };
  } catch (error) {
    console.error("Error de conexión:", error);
    return null;
  }
}

export function saveUserSession(user: UserSession) {
  if (typeof window !== "undefined") {
    localStorage.setItem("currentUser", JSON.stringify(user));
  }
}

export function getUserSession(): UserSession | null {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("currentUser");
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
}

export function clearUserSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentUser");
  }
}