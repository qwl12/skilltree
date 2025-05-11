import { PrismaClient } from "@prisma/client";

// Создаем экземпляр PrismaClient
const prisma = new PrismaClient();
// npx prisma db seed
async function main() {
  // Создаем роли с использованием upsert, чтобы избежать дублирования
  const adminRole = await prisma.role.upsert({
    where: { type: 'admin' },
    update: {},
    create: { type: 'admin' },
  });
  
  const userRole = await prisma.role.upsert({
    where: { type: 'user' },
    update: {},
    create: { type: 'user' },
  });
  
  const teacherRole = await prisma.role.upsert({
    where: { type: 'teacher' },
    update: {},
    create: { type: 'teacher' },
  });

  // Создаем пользователей с использованием upsert, чтобы избежать дублирования
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@admin.com',
      password: 'securepassword',
      roleId: adminRole.id,
      image: 'http://example.com/avatar.jpg',
    },
  });

  const studentUser = await prisma.user.upsert({
    where: { email: 'student@student.com' },
    update: {},
    create: {
      name: 'Student User',
      email: 'student@student.com',
      password: 'studentpassword',
      roleId: userRole.id,
      image: 'http://example.com/avatar2.jpg',
    },
  });

  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher@teacher.com' },
    update: {},
    create: {
      name: 'Teacher User',
      email: 'teacher@teacher.com',
      password: 'teacherpassword',
      roleId: teacherRole.id,
      image: 'http://example.com/avatar3.jpg',
    },
  });

  // Создаем категории с использованием upsert
  const category1 = await prisma.category.upsert({
    where: { name: 'Web Development' },
    update: {},
    create: { name: 'Web Development' },
  });
  
  const category2 = await prisma.category.upsert({
    where: { name: 'Data Science' },
    update: {},
    create: { name: 'Data Science' },
  });
  
  const category3 = await prisma.category.upsert({
    where: { name: 'Design' },
    update: {},
    create: { name: 'Design' },
  });

  // Создаем подкатегории с использованием upsert
 // Check if subcategory already exists
const subcategory1 = await prisma.subcategory.findFirst({
  where: { name: 'Frontend Development' },
});

if (!subcategory1) {
  await prisma.subcategory.create({
    data: {
      name: 'Frontend Development',
      categoryId: category1.id,
    },
  });
}

const subcategory2 = await prisma.subcategory.findFirst({
  where: { name: 'Backend Development' },
});

if (!subcategory2) {
  await prisma.subcategory.create({
    data: {
      name: 'Backend Development',
      categoryId: category1.id,
    },
  });
}
const subcategory3 = await prisma.subcategory.findFirst({
  where: { name: 'Machine Learning' },
});

if (!subcategory3) {
  await prisma.subcategory.create({
    data: {
      name: 'Machine Learning',
      categoryId: category2.id,
    },
  });
}
await prisma.question.deleteMany();
await prisma.course.deleteMany();
  // Создаем курсы 
  const coursesData = [
    {
      title: "Улучшение soft-skills",
      image: "like.svg",
      description: "Learn the basics of React.js",
      aboutCourse: "Этот курс поможет вам развить навыки общения и управления временем, что важно для профессионального роста в любой сфере.",
      difficulty: "Средний",
      subscribers: 530,
      duration: 10,
      teacherId: teacherUser.id,
      categoryId: category1.id,
      subcategoryId: subcategory1?.id,
    },
    {
      title: "Основы 1с",
      image: "ones.svg",
      description: "Dive deep into Node.js and Express",
      aboutCourse: "Курс по основам 1С для начинающих, охватывающий все основные аспекты работы с системой.",
      difficulty: "Легкий",
      subscribers: 200,
      duration: 20,
      teacherId: teacherUser.id,
      categoryId: category1.id,
      subcategoryId: subcategory2?.id,
    },
    {
      title: "Python для начинающих",
      image: "Python.svg",
      description: "Learn Python and Data Science tools",
      aboutCourse: "Курс по Python для начинающих с уклоном в области анализа данных и машинного обучения.",
      difficulty: "Средний",
      subscribers: 150,
      duration: 25,
      teacherId: teacherUser.id,
      categoryId: category2.id,
      subcategoryId: subcategory3?.id,
    },
    {
      title: "Дизайн: обо всем по порядку",
      image: "like.svg",
      description: "Learn the basics of UI/UX design",
      aboutCourse: "Этот курс научит вас основам дизайна интерфейсов и пользовательского опыта.",
      difficulty: "Средний",
      subscribers: 300,
      duration: 15,
      teacherId: teacherUser.id,
      categoryId: category3.id,
      subcategoryId: subcategory3?.id,
    },
  ];
  
  const modulesData = [
    {
      courseTitle: "Улучшение soft-skills",
      description: "Развитие личных и профессиональных навыков",
      order: 1,
      lectures: [
        { title: "Введение в soft-skills", content: "Обзор и цели курса", order: 1 },
        { title: "Управление временем", content: "Как эффективно планировать и распределять время", order: 2 },
      ],
    },
    {
      courseTitle: "Основы 1с",
      description: "Основы работы с 1С для новичков",
      order: 1,
      lectures: [
        { title: "Введение в 1С", content: "Основы и ключевые компоненты системы 1С", order: 1 },
        { title: "Основы программирования в 1С", content: "Основы написания программ в 1С", order: 2 },
      ],
    },
    {
      courseTitle: "Python для начинающих",
      description: "Знакомство с основами Python и инструментами для анализа данных",
      order: 1,
      lectures: [
        { title: "Основы Python", content: "Введение в язык программирования Python", order: 1 },
        { title: "Обработка данных с использованием Python", content: "Основы работы с библиотеками для анализа данных", order: 2 },
      ],
    },
    {
      courseTitle: "Дизайн: обо всем по порядку",
      description: "Изучение основ UX/UI дизайна и проектирования интерфейсов",
      order: 1,
      lectures: [
        { title: "Основы UX/UI", content: "Что такое UX/UI и как они влияют на дизайн", order: 1 },
        { title: "Процесс разработки интерфейсов", content: "Как создавать прототипы и макеты", order: 2 },
      ],
    },
  ];
  
  // Seed data to insert courses with modules and lectures
  async function createCoursesWithModules() {
    for (const courseData of coursesData) {
      const course = await prisma.course.create({
        data: {
          title: courseData.title,
          image: courseData.image,
          description: courseData.description,
          aboutCourse: courseData.aboutCourse,
          difficulty: courseData.difficulty,
          subscribers: courseData.subscribers,
          duration: courseData.duration,
          teacherId: courseData.teacherId,
          categoryId: courseData.categoryId,
          subcategoryId: courseData.subcategoryId,
        },
      });
  
      // Create modules and lectures for each course
      const courseModules = modulesData.filter((module) => module.courseTitle === courseData.title);
      for (const moduleData of courseModules) {
        const module = await prisma.module.create({
          data: {
            courseId: course.id,
            description: moduleData.description,
            order: moduleData.order,
            lectures: {
              create: moduleData.lectures,
            },
          },
        });
      }
    }
  }
  
  createCoursesWithModules()
    .then(() => console.log("Courses with modules and lectures added successfully."))
    .catch((error) => console.error("Error adding courses with modules:", error));
  
  console.log('Roles, users, categories, subcategories, and courses have been created.');

  // Получаем популярные курсы
  await getPopularCourses();
}

// Функция для получения популярных курсов
async function getPopularCourses() {
  const popularCourses = await prisma.course.findMany({
    orderBy: {
      subscribers: 'desc', // Сортировка по количеству подписчиков
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

  console.log('Популярные курсы:', popularCourses);
}

// Запуск основного кода
main()
  .catch((e) => {
    console.error('Ошибка при запуске сидинга:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
