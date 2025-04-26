import { PrismaClient } from "@prisma/client";
// npx prisma db seed
const prisma = new PrismaClient();

async function main() {
  // Создаем роли
  const adminRole = await prisma.role.create({
    data: {
      type: "admin",
    },
  });

  const userRole = await prisma.role.create({
    data: {
      type: "user",
    },
  });

  const teacherRole = await prisma.role.create({
    data: {
      type: "teacher",
    },
  });

  // Создаем пользователей
  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@admin.com",
      password: "securepassword",
      roleId: adminRole.id,
      avatarUrl: "http://example.com/avatar.jpg",
    },
  });

  const studentUser = await prisma.user.create({
    data: {
      name: "Student User",
      email: "student@student.com",
      password: "studentpassword",
      roleId: userRole.id,
      avatarUrl: "http://example.com/avatar2.jpg",
    },
  });

  const teacherUser = await prisma.user.create({
    data: {
      name: "Teacher User",
      email: "teacher@teacher.com",
      password: "teacherpassword",
      roleId: teacherRole.id,
      avatarUrl: "http://example.com/avatar3.jpg",
    },
  });

  // Создаем категории
  const category1 = await prisma.category.create({
    data: {
      name: "Web Development",

    },
  });

  const category2 = await prisma.category.create({
    data: {
      name: "Data Science",
    
    },
  });

  const category3 = await prisma.category.create({
    data: {
      name: "Design",

    },
  });

  // Создаем подкатегории
  const subcategory1 = await prisma.subcategory.create({
    data: {
      name: "Frontend Development",
    
      categoryId: category1.id,
    },
  });

  const subcategory2 = await prisma.subcategory.create({
    data: {
      name: "Backend Development",

      categoryId: category1.id,
    },
  });

  const subcategory3 = await prisma.subcategory.create({
    data: {
      name: "Machine Learning",

      categoryId: category2.id,
    },
  });

  // Создаем курсы
  const courses = await prisma.course.createMany({
    data: [
      {
        title: "Улучшение soft-skills",
        image: "like.svg",
        description: "Learn the basics of React.js",
        subscribers: 530,
        duration: 10,
        teacherId: teacherUser.id,
        categoryId: category1.id,
        subcategoryId: subcategory1.id,
      },
      {
        title: "Основы 1с",
        image: "ones.svg",
        description: "Dive deep into Node.js and Express",
        subscribers: 200,
        duration: 20,
        teacherId: teacherUser.id,
        categoryId: category1.id,
        subcategoryId: subcategory2.id,
      },
      {
        title: "Python для начинающих",
        image: "Python.svg",
        description: "Learn Python and Data Science tools",
        subscribers: 150,
        duration: 25,
        teacherId: teacherUser.id,
        categoryId: category2.id,
        subcategoryId: subcategory3.id,
      },
      {
        title: "Дизайн: обо всем по порядку",
        image: "like.svg",
        description: "Learn the basics of UI/UX design",
        subscribers: 300,
        duration: 15,
        teacherId: teacherUser.id,
        categoryId: category3.id,
        subcategoryId: subcategory3.id,
      },
    ],
  });
  const teacher1 = await prisma.user.create({
    data: {
      name: "Анна Иванова",
      email: "anna@example.com",
      password: "password123", // В реальном проекте пароль хэшируй!
      roleId: teacherRole.id,
      avatarUrl: "https://randomuser.me/api/portraits/women/45.jpg",
    },
  });
  
  const teacher2 = await prisma.user.create({
    data: {
      name: "Дмитрий Смирнов",
      email: "dmitry@example.com",
      password: "password123",
      roleId: teacherRole.id,
      avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  });
  
  const teacher3 = await prisma.user.create({
    data: {
      name: "Екатерина Сидорова",
      email: "ekaterina@example.com",
      password: "password123",
      roleId: teacherRole.id,
      avatarUrl: "https://randomuser.me/api/portraits/women/51.jpg",
    },
  });
  
  const teacher4 = await prisma.user.create({
    data: {
      name: "Алексей Кузнецов",
      email: "alexey@example.com",
      password: "password123",
      roleId: teacherRole.id,
      avatarUrl: "https://randomuser.me/api/portraits/men/67.jpg",
    },
  });
  
  const teacher5 = await prisma.user.create({
    data: {
      name: "Мария Петрова",
      email: "maria@example.com",
      password: "password123",
      roleId: teacherRole.id,
      avatarUrl: "https://randomuser.me/api/portraits/women/19.jpg",
    },
  });
  console.log("Roles, users, categories, subcategories, and courses have been created.");

  // Получаем популярные курсы
  await getPopularCourses();
}

async function getPopularCourses() {
  const popularCourses = await prisma.course.findMany({
    orderBy: {
      subscribers: "desc", // Сортировка по количеству подписчиков
    },
    take: 6,
    include: {
      teacher: {
        select: { name: true },
      },
      category: {
        select: { name: true },
      },
      subcategory: {
        select: { name: true },
      },
    },
  });

  console.log("Популярные курсы:", popularCourses);
}

main()
  .catch((e) => {
    console.error("Ошибка при запуске сидинга:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
