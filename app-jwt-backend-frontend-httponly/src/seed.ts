import bcrypt from 'bcrypt';
import { AppDataSource } from './data-source';
import { Product } from './entities/Product';
import { User } from './entities/User';

async function seed() {
  await AppDataSource.initialize();

  const userRepository = AppDataSource.getRepository(User);
  const productRepository = AppDataSource.getRepository(Product);

  const existingAdmin = await userRepository.findOne({ where: { username: 'admin' } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('password', 10);
    const admin = userRepository.create({
      username: 'admin',
      password: hashedPassword,
    });

    await userRepository.save(admin);
    console.log('Utente admin creato');
  } else {
    console.log('Utente admin gia presente');
  }

  const productCount = await productRepository.count();

  if (productCount === 0) {
    await productRepository.save([
      productRepository.create({
        name: 'Zaino da viaggio',
        description: 'Zaino compatto adatto a lezioni e brevi viaggi.',
        price: '49.90',
      }),
      productRepository.create({
        name: 'Guida turistica Marche',
        description: 'Volume introduttivo per itinerari regionali.',
        price: '19.50',
      }),
      productRepository.create({
        name: 'Taccuino operativo',
        description: 'Taccuino per appunti, sopralluoghi e checklist.',
        price: '7.90',
      }),
    ]);

    console.log('Prodotti di esempio creati');
  } else {
    console.log('Prodotti gia presenti');
  }

  await AppDataSource.destroy();
}

seed().catch(async (error) => {
  console.error('Errore durante il seed:', error);

  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }

  process.exit(1);
});
