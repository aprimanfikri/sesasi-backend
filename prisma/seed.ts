import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

const main = async () => {
  const adminHash = hashSync(process.env.ADMIN_PASSWORD as string);
  const userHash = hashSync(process.env.USER_PASSWORD as string);

  const adminOne = await prisma.user.create({
    data: {
      name: 'Admin',
      email: process.env.ADMIN_EMAIL as string,
      password: adminHash,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  const adminTwo = await prisma.user.create({
    data: {
      name: 'Admin',
      email: process.env.ADMIN_EMAIL_TWO as string,
      password: adminHash,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  const userVerifiedOne = await prisma.user.create({
    data: {
      name: 'User',
      email: process.env.USER_VERIFIED_EMAIL as string,
      password: userHash,
      role: 'USER',
      status: 'ACTIVE',
    },
  });

  const userVerifiedTwo = await prisma.user.create({
    data: {
      name: 'User',
      email: process.env.USER_VERIFIED_EMAIL_TWO as string,
      password: userHash,
      role: 'USER',
      status: 'ACTIVE',
    },
  });

  const userUnverified = await prisma.user.create({
    data: {
      name: 'User',
      email: process.env.USER_UNVERIFIED_EMAIL as string,
      password: userHash,
      role: 'USER',
      status: 'INACTIVE',
    },
  });

  const permission = await prisma.permission.create({
    data: {
      title: 'Cuti Tahunan',
      description: 'Mengajukan cuti untuk urusan keluarga',
      startDate: '2025-07-10T00:00:00.000Z',
      endDate: '2025-07-12T00:00:00.000Z',
      userId: userVerifiedOne.id,
    },
  });

  console.log('User successfuly created', adminOne);
  console.log('User successfuly created', adminTwo);
  console.log('User successfuly created', userVerifiedOne);
  console.log('User successfuly created', userVerifiedTwo);
  console.log('User successfuly created', userUnverified);
  console.log('Permission successfuly created', permission);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
