import Footer from "@/components/Footer";
import PopularAuthorCard from "@/components/PopularAuthors/AuthorCard";
import PopularAuthors from "@/components/PopularAuthors/PopularAuthors";
import PopularCourses from "@/components/PopularCourses/PopularCourses";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-7xl">
          <PopularCourses />
          <PopularAuthors />
        </div>
      </main>

      <Footer />
    </div>
  );
}
