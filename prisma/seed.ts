import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Создаем роли
  const adminRole = await prisma.role.create({
    data: {
      type: 'admin',
    },
  });

  const userRole = await prisma.role.create({
    data: {
      type: 'user',
    },
  });

  // 2. Создаем пользователей
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@admin.com',
      password: 'securepassword',
      roleId: adminRole.id,
      avatarUrl: 'http://example.com/avatar.jpg',
    },
  });

  const studentUser = await prisma.user.create({
    data: {
      name: 'Student User',
      email: 'student@student.com',
      password: 'studentpassword',
      roleId: userRole.id,
      avatarUrl: 'http://example.com/avatar2.jpg',
    },
  });

  // 3. Создаем курсы
  const courses = await prisma.course.createMany({
    data: [
      {
        title: "Введение в 1С",
        image: "ones.svg",
        description: "Научитесь основам 1С и создания привлекательных сайтов.",
        subscribers: "530",
        duration: 12,
        teacherId: adminUser.id,
      },
      {
        title: 'Advanced Node.js',
        description: 'Dive deep into Node.js',
        image: 'like.svg',
        duration: 20,
        subscribers: '100',
        teacherId: adminUser.id,
      },
      {
        title: 'CSS for Beginners',
        description: 'Start learning CSS',
        image: 'Python.svg',
        subscribers: '200',
        teacherId: adminUser.id,
      },
    ],
  });

  console.log('Roles, users, and courses have been created.');

  // 4. Получаем популярные курсы
  await getPopularCourses();
}

async function getPopularCourses() {
  const popularCourses = await prisma.course.findMany({
    orderBy: {
      subscribers: 'desc',  // Сортировка по количеству подписчиков
    },
    take: 6,  // Возьмем только 5 самых популярных
  });

  console.log('Популярные курсы:', popularCourses);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
