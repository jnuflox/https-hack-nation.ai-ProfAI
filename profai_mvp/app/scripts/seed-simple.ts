import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando seed simple de ProfAI MVP...');

  // Limpiar datos existentes
  await prisma.user.deleteMany();
  console.log('✅ Datos limpiados');

  // 1. Crear usuario de prueba
  const hashedPassword = await bcrypt.hash('johndoe123', 12);
  const testUser = await prisma.user.create({
    data: {
      email: 'john@doe.com',
      password: hashedPassword,
      name: 'John Doe',
      firstName: 'John',
      lastName: 'Doe'
    }
  });

  console.log('✅ Usuario de prueba creado:', testUser.email);
  console.log('🎉 Seed simple completado exitosamente!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error en seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
