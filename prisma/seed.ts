import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

const main = async () => {
  const hash = hashSync(process.env.ADMIN_PASSWORD as string);

  const user = await prisma.user.create({
    data: {
      name: 'Admin',
      email: process.env.ADMIN_EMAIL as string,
      password: hash,
    },
  });

  console.log('User successfuly created', user);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
