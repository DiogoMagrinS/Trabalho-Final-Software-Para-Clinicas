// src/utils/getUserFromToken.ts
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: number;
  tipoUsuario: 'PACIENTE' | 'PROFISSIONAL' | 'RECEPCIONISTA';
  email: string;
  exp: number;
  iat: number;
}

export function getUserFromToken(): DecodedToken | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    console.log('TOKEN DECODIFICADO:', decoded); // ✅ ADICIONE ISSO
    return decoded;
  } catch (err) {
    console.error('Erro ao decodificar token:', err);
    return null;
  }
}
