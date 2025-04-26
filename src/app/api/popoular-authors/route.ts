// import { prisma } from "@/lib/db";

// const popularAuthors = await prisma.user.findMany({
//     where: {
//       roleId: "TEACHER",
//     },
//     include: {
//       courses: {
//         include: {
//           subsc: true,
//         },
//       },
//     },
//   });
  
//   const sortedAuthors = popularAuthors
//     .map((author) => ({
//       ...author,
//       totalStudents: author.courses.reduce(
//         (acc, course) => acc + course.students.length,
//         0
//       ),
//     }))
//     .sort((a, b) => b.totalStudents - a.totalStudents)
//     .slice(0, 5);
  