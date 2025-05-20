import PopularAuthors from "@/components/PopularAuthors/PopularAuthors";
import PopularCourses from "@/components/PopularCourses/PopularCourses";
import { authOptions } from "@/lib/auth";

import PopularTags from "@/components/popular-search";
import RecommendedCourses from "@/components/recomendcourses";
import { getServerSession } from "next-auth";

const Home = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-7xl">

          <PopularCourses />
          <PopularAuthors />
          <PopularTags />
          {session?.user?.id && (
            <RecommendedCourses userId={session.user.id} />
          )}
        </div>
      </main>

    </div>
  );
}
export default Home;
