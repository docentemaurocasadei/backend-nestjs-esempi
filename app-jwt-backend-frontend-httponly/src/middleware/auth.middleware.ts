import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface JwtPayload {
  userId: number;
  username: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const cookieName = process.env.COOKIE_NAME || 'token';
  const token = req.cookies?.[cookieName];

  if (!token) {
    return res.status(401).json({ message: 'Token mancante' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'super_secret_key';
    req.user = jwt.verify(token, secret) as JwtPayload;
    return next();
  } catch {
    return res.status(401).json({ message: 'Token non valido' });
  }
}
