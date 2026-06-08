import bcrypt from 'bcrypt';
import { Router } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';

export const authRouter = Router();

authRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username e password sono obbligatori.' });
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: 'Credenziali non valide.' });
    }

    // bcrypt confronta la password in chiaro con l'hash salvato nel database.
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Credenziali non valide.' });
    }

    const secret = process.env.JWT_SECRET;
    const expiresIn = (process.env.JWT_EXPIRES_IN || '1h') as SignOptions['expiresIn'];

    if (!secret) {
      return res.status(500).json({ message: 'JWT_SECRET non configurato.' });
    }

    const options: SignOptions = { expiresIn };
    // Il token contiene solo dati minimi: mai includere la password.
    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      secret,
      options
    );

    return res.json({ access_token: accessToken });
  } catch {
    return res.status(500).json({ message: 'Errore durante il login.' });
  }
});
