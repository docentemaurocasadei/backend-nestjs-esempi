import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';

export const authRouter = Router();

authRouter.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username e password sono obbligatori' });
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }

    const secret: Secret = process.env.JWT_SECRET || 'super_secret_key';
    const options: SignOptions = {
      expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as SignOptions['expiresIn'],
    };
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      secret,
      options,
    );

    res.cookie(process.env.COOKIE_NAME || 'token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: Number(process.env.COOKIE_MAX_AGE || 3600000),
    });

    return res.status(200).json({ message: 'Login effettuato' });
  } catch {
    return res.status(500).json({ message: 'Errore durante il login' });
  }
});

authRouter.post('/logout', (_req, res) => {
  res.clearCookie(process.env.COOKIE_NAME || 'token');
  return res.status(200).json({ message: 'Logout effettuato' });
});
