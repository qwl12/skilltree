import Link from "next/link";

interface PopularAuthorCardProps {
  author: {
    id: string;
    name: string;
    avatarUrl: string;
    followersCount: number;
    coursesCount: number;
  };
}

export default function PopularAuthorCard({ author }: PopularAuthorCardProps) {
  return (
     <Link href={`/profile/teacher/${author.id}`}>
    <div className="bg-white rounded-xl shadow-lg p-3 hover:shadow-xl/10 transition max-w-md w-90 flex inset-shadow-sm gap-2">
     
      <img
        src={author.avatarUrl}
        alt={author.name}
        className="w-24 h-24 object-cover rounded-full mx-5"
      />
      <div className="flex flex-col justify-start">
        <h3 className="text-xl text-black font-semibold">{author.name}</h3>
        <div className="flex gap-2 items-center">
          <img src="/countFollowers.svg" alt="followers" width={16} height={16} />
          <p className="text-gray-600 text-sm">Подписчиков: {author.followersCount}</p>
        </div>
        <div className="flex gap-2 items-center">
          <img src="/countCourses.svg" alt="courses" width={16} height={16} />
          <p className="text-gray-600 text-sm">Курсов: {author.coursesCount}</p>
        </div>
      </div>
    </div>
        </Link>
  );
}
