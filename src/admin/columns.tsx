import { Button } from "@/components/ui/button";
import { Course, Lesson, Module, Roadmap } from "@/utils/types";
import { Quiz, Resource, Video } from "@/utils/types/adminTypes";
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

export const RoadmapColumns: ColumnDef<Roadmap>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    header: "Mapped Courses",
    cell: ({ row }) => {
      return (
        <Link to={`/admin/roadmaps/${row.original.id}`}>
          <Button size="sm">Mapped Courses</Button>
        </Link>
      );
    },
  },
];

export const CourseColumns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "level",
    header: "Level",
  },
  {
    header: "Mapped Modules",
    cell: ({ row }) => {
      return (
        <Link to={`/admin/courses/${row.original.id}`}>
          <Button size="sm">Mapped Modules</Button>
        </Link>
      );
    },
  },
];

export const QuizColumns: ColumnDef<Quiz>[] = [
  {
    accessorKey: "question",
    header: "Question",
  },
  {
    accessorKey: "correctAnswer",
    header: "Answer",
  },
];

export const VideoColumns: ColumnDef<Video>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "youtubeId",
    header: "Youtube Url",
  },
  {
    accessorKey: "duration",
    header: "Duration",
  },
];

export const ResourceColumns: ColumnDef<Resource>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
];

export const LessonColumns: ColumnDef<Lesson>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    header: "Mapped Materials",
    cell: ({ row }) => {
      return (
        <Link to={`/admin/lessons/${row.original.id}`}>
          <Button size="sm">Mapped Materials</Button>
        </Link>
      );
    },
  },
];

export const ModuleLessons: ColumnDef<Module>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    header: "Mapped Lessons",
    cell: ({ row }) => {
      return (
        <Link to={`/admin/modules/${row.original.id}`}>
          <Button size="sm">Mapped Lessons</Button>
        </Link>
      );
    },
  },
];
