import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

const main = async () => {
  const adminHash = hashSync(process.env.ADMIN_PASSWORD as string);
  const userHash = hashSync(process.env.USER_PASSWORD as string);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: process.env.ADMIN_EMAIL as string,
      password: adminHash,
      role: 'ADMIN',
      isVerified: true,
    },
  });

  const user = await prisma.user.create({
    data: {
      name: 'User',
      email: process.env.USER_EMAIL as string,
      password: userHash,
      role: 'USER',
      isVerified: false,
    },
  });

  console.log('User successfuly created', admin);
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
