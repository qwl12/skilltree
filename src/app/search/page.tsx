
import SearchBar from '@/components/Searchbar';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

interface SearchPageProps {
  searchParams: {
    q?: string;
    tags?: string;
    page?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const tagString = searchParams.tags || '';
  const page = parseInt(searchParams.page || '1');
  const PAGE_SIZE = 10;
  const offset = (page - 1) * PAGE_SIZE;

  const tags = tagString ? tagString.split(',') : [];

  const filters: any[] = [];

  if (query) {
    filters.push({
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        {
          teacher: {
            name: { contains: query, mode: 'insensitive' },
          },
        },
      ],
    });
  }

  if (tags.length > 0) {
    filters.push(
      ...tags.map((tag) => ({
        tags: {
          some: {
            tag: {
              name: { contains: tag, mode: 'insensitive' },
            },
          },
        },
      }))
    );
  }

  const [courses, totalCourses, popularTags] = await Promise.all([
    prisma.course.findMany({
      where: filters.length > 0 ? { AND: filters } : undefined,
      include: {
        teacher: true,
        tags: { include: { tag: true } },
      },
      skip: offset,
      take: PAGE_SIZE,
    }),
    prisma.course.count({
      where: filters.length > 0 ? { AND: filters } : undefined,
    }),
    prisma.tag.findMany({
      take: 5,
      orderBy: {
        courses: {
          _count: 'desc',
        },
      },
      include: {
        _count: {
          select: { courses: true },
        },
      },
    }),
  ]);

  const hasMore = totalCourses > page * PAGE_SIZE;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      
      <h1 className="text-3xl font-bold">Поиск курсов</h1>
      <SearchBar />
      
      <div className="flex gap-2 flex-wrap text-sm">
        <p className="text-gray-600">Популярные теги:</p>
        {popularTags.map((tag) => (
          <Link
            key={tag.id}
            href={`/search?tags=${tag.name}`}
            className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full hover:bg-blue-200"
          >
            #{tag.name}
          </Link>
        ))}
      </div>


      {courses.length === 0 ? (
        <p>Ничего не найдено.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {courses.map((course) => (
              <li key={course.id} className="p-4 rounded-lg shadow bg-gray-50">
                <div className="flex gap-6">
                  <img
                    src={course.image || '/placeholderCourse.png'}
                    alt={course.title}
                    className="w-30 h-30 object-cover rounded-xl"
                  />
                  <div className="flex flex-col gap-2 justify-center">
                    <Link
                      href={`/courses/${course.id}`}
                      className="text-xl font-semibold hover:underline"
                    >
                      {course.title}
                    </Link>
                    {course.teacher?.name && (
                      <p className="text-gray-600">{course.teacher.name}</p>
                    )}
                    <p className="text-sm text-gray-700">{course.description}</p>
                    <div className="flex gap-2 flex-wrap mt-2">
                      {course.tags.map((t) => (
                        <span
                          key={t.tag.name}
                          className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs"
                        >
                          #{t.tag.name}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3 items-center text-sm text-gray-600 mt-2">
                      <div className="flex items-center gap-1">
                        <img src="/countFollowers.svg" alt="subs" width={16} height={16} />
                        {course.subscribers}
                      </div>
                      <div className="flex items-center gap-1">
                        <img src="/countCourses.svg" alt="duration" width={16} height={16} />
                        {course.duration} ч.
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Кнопка "Показать ещё" */}
          {hasMore && (
            <div className="flex justify-center mt-4">
              <Link
                href={{
                  pathname: '/search',
                  query: {
                    q: query,
                    tags: tagString,
                    page: page + 1,
                  },
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Показать ещё
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
