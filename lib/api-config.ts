// Cambia a true para usar el servidor real, false para local
const IS_PRODUCTION = false; 

export const API_BASE_URL = IS_PRODUCTION 
  ? "https://portal.erg-backend.online/api" 
  : "https://portal.erg-backend.online/api";

export const ENDPOINTS = {
  login: `${API_BASE_URL}/auth/login`,
  updatePassword: `${API_BASE_URL}/auth/update-password`,
  miembros: `${API_BASE_URL}/miembros-universal`,
  catalogos: `${API_BASE_URL}/catalogos/filtros`,
};