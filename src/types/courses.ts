import { CoursesContext } from "@/utils/types";
import { ArticleDto } from "@/utils/types/adminTypes";

import { MaterialType } from "@/utils/types/adminTypes";

export type TabType = "all" | "started" | "done";
export interface CareerPathInterface {
  id: string;
  title: string;
  description: string;
  roadmaps?: RoadMapInterface[];
  isEnrolled?: boolean;
}
export interface RoadMapInterface {
  id: string;
  title: string;
  description?: string;
  order?: number;
  isEnrolled?: boolean;
  courses: CourseDetails[];
}
export interface CourseDetails extends CoursesContext {
  modules: ModuleDetails[];
}

export interface CourseDetailsContext extends CoursesContext {
  completedMaterials: number;
  totalMaterials: number;
  modules: ModuleDetailsContext[];
}

export interface ModuleDetails {
  id: string;
  title: string;
  lessons: LessonDetails[];
}

export interface ModuleDetailsContext {
  id: string;
  title: string;
  lessons: LessonDetailsContext[];
  progress: number;
  completedMaterials: number;
  totalMaterials: number;
}

export declare type Material = Article | Video | QuizGroup;

export declare type MaterialContext =
  | ArticleContext
  | VideoContext
  | QuizGroupContext;

export interface LessonDetails {
  id: string;
  name: string;
  description?: string;
  order: number;
  materials: Material[];
}

export interface LessonDetailsContext {
  id: string;
  name: string;
  description?: string;
  order: number;
  materials: MaterialContext[];
}

export interface InfoCardProps {
  type: "info" | "tip" | "warning" | "success" | "error";
  title: string;
  content: string;
}

export interface MaterialData {
  id: number;
  type: string;
  title: string;
  description: string;
  body: string;
  code?: { code: string; language: string };
  quote?: { text: string; author?: string };
  info?: InfoCardProps;
  image?: string;
}
export interface Article {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  data: {
    [key: string]: MaterialData;
  };
  description: string;
  order: number;
  duration: number;
  type: MaterialType.ARTICLE;
}

export declare type ArticleContext = Article & {
  isFinished: boolean;
};

export interface Video {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  order: number;
  youtubeId: string;
  duration: number;
  type: MaterialType.VIDEO;
}
export declare type VideoContext = Video & {
  isFinished: boolean;
};

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  duration: number;
  order: number;
  type: MaterialType._QUIZ;
}

export interface QuizGroup {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  order: number;
  quizzes: Quiz[];
  duration: number;
  type: MaterialType.QUIZ_GROUP;
}

export declare type QuizGroupContext = QuizGroup & {
  isFinished: boolean;
  old_result?: number;
};

export enum LevelEnum {
  BEGINNER = "مبتدئ",
  INTERMEDIATE = "متوسط",
  ADVANCED = "متقدم",
}

export const LevelArray = ["مبتدئ", "متوسط", "متقدم"];

export interface CoursesReport {
  completedCourses: number;
  totalHours: number;
  streakDays: number;
  certifications: number;
}

export interface UpdateCourseDto {
  title?: string;
  description?: string;
  level?: LevelEnum;
  course_info?: {
    durationHours: number;
    tags: string[];
    new_skills_result: string[];
    learning_outcome: { [key: string]: number };
    prerequisites: string[];
  };
  isPublished?: boolean;
}

export interface UpdateModuleDto {
  title?: string;
  description?: string;
}

export interface UpdateLessonDto {
  name?: string;
  description?: string;
}

export interface UpdateArticleDto {
  data?: ArticleDto[];
  duration?: number;
}

export interface UpdateQuizDto {
  question?: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  duration?: number;
}

export interface UpdateResourceDto {
  title?: string;
  description?: string;
  url?: string;
  content?: string;
  duration?: number;
}

export interface UpdateVideoDto {
  title?: string;
  youtubeId?: string;
  description?: string;
  duration?: number;
}

export interface PatchCourseProgressParams {
  userId: string;
  courseId: string;
  materialId: string;
  material: {
    type: MaterialType;
    quizGroup_id?: string;
    result?: number;
  };
}
