import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
  };
}

type JwtPayload = {
  id: number;
  username: string;
};

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  // Il frontend invia il token nel formato: Authorization: Bearer JWT_TOKEN
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token mancante o formato non valido.' });
  }

  const token = authHeader.replace('Bearer ', '').trim();
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ message: 'JWT_SECRET non configurato.' });
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    // Salviamo i dati dell'utente nella request per eventuali rotte future.
    req.user = {
      id: decoded.id,
      username: decoded.username
    };
    next();
  } catch {
    return res.status(401).json({ message: 'Token non valido o scaduto.' });
  }
}
