
import SearchPage from "@/components/CourseSearch";
import Footer from "@/components/Footer";

import PopularAuthors from "@/components/PopularAuthors/PopularAuthors";
import PopularCourses from "@/components/PopularCourses/PopularCourses";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const Home = async () => {
  const session = await authOptions;
  if(!session) redirect("/sign-in")
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-7xl">
          <SearchPage />
          <PopularCourses />
          <PopularAuthors />
        </div>
      </main>
      <Footer />
    </div>
  );
}
export default Home;
