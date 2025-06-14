import { DataTable } from "@/components/ui/data-table";
import LessonCreate from "../components/lesson.create";
import { LessonColumns } from "../columns";
import { useEffect, useState } from "react";
import { Lesson } from "@/utils/types";
import { fetchAllLesson } from "@/utils/_apis/admin-api";
import { CustomError } from "@/utils/_apis/api";

export default function LessonPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getAllLesson = async () => {
    try {
      const lessons = await fetchAllLesson<Lesson[]>();
      if (lessons && lessons.length) setLessons(lessons);
    } catch (err: unknown) {
      console.log(err);
      if ((err as CustomError).error.type == "network")
        setError("Error when trying to fetch data.");
    }
  };
  useEffect(() => {
    getAllLesson();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className=" mb-2">
        <LessonCreate updateTable={() => getAllLesson()} />
      </div>
      <DataTable columns={LessonColumns} data={lessons} />
    </div>
  );
}
