// src/features/auth/types/jwt-payload.type.ts

export type JwtPayload = {
  role: 'user' | 'admin';
  sub: number; 
  iat: number; 
  exp: number;   
};