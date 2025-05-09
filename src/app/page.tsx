
import Footer from "@/components/ui/footer";

import PopularAuthors from "@/components/PopularAuthors/PopularAuthors";
import PopularCourses from "@/components/PopularCourses/PopularCourses";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const Home = async () => {
  const session = await authOptions;
  if(!session) redirect("/")
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-7xl">

          <PopularCourses />
          <PopularAuthors />
        </div>
      </main>

    </div>
  );
}
export default Home;
