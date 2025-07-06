import React, { useEffect, useState, useContext } from "react";
import { SideNavbar } from "./_Sidebar";
import UserContext from "@/context/UserContext";
import MaterialViewer from "./_MaterialViewer";
import NavigationPlayground from "./_TopNav";
import { useSettings } from "@/context/SettingsContexts";
import {
  getSingleCoursesApi,
  patchCourseProgressApi,
} from "@/utils/_apis/courses-apis";
import { useParams } from "react-router-dom";
import { CourseDetailsContext, MaterialContext } from "@/types/courses";
import { MaterialType } from "@/utils/types/adminTypes";

export const CoursePlayground: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] =
    useState<MaterialContext | null>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>(["basics"]);
  const {
    darkMode,
    currentCheck,
    updateCurrentCheck: updateCurrentMaterial,
  } = useSettings();
  const [courseData, setCourseData] = useState<CourseDetailsContext | null>(
    null
  );
  const { id } = useParams();
  const userContext = useContext(UserContext);
  if (!userContext || !userContext.auth?.user) return null;
  const user = userContext.auth.user;

  const fetchCourseData = async () => {
    const data = await getSingleCoursesApi({ course_id: id as string });

    const flatMaterialList: string[] = [];
    data.modules.forEach((module) =>
      module.lessons.forEach((lesson) =>
        lesson.materials.forEach((material) =>
          flatMaterialList.push(material.id)
        )
      )
    );

    const currentMaterialIndex = flatMaterialList.indexOf(
      data.current_material ?? ""
    );

    const courseDetails: CourseDetailsContext = {
      ...data,
      modules: data.modules.map((module) => {
        let moduleCompleted = 0;
        let moduleTotal = 0;

        const mod = {
          ...module,
          lessons: module.lessons.map((lesson) => {
            return {
              ...lesson,
              materials: lesson.materials.map((material) => {
                const indexInFlat = flatMaterialList.indexOf(material.id);
                const isFinished = indexInFlat < currentMaterialIndex;

                moduleTotal++;
                if (isFinished) moduleCompleted++;

                return {
                  ...material,
                  isFinished,
                  ...(material.type === MaterialType.QUIZ_GROUP
                    ? {
                        old_result:
                          data?.enrollment_info.quizzes_result[material.id] ??
                          10,
                      }
                    : {}),
                };
              }),
            };
          }),
          totalMaterials: moduleTotal,
          completedMaterials: moduleCompleted,
          progress: moduleTotal
            ? Math.floor((moduleCompleted / moduleTotal) * 100)
            : 0,
        };

        return mod;
      }),
      completedMaterials: flatMaterialList.slice(0, currentMaterialIndex)
        .length,
      totalMaterials: flatMaterialList.length,
    };

    setCourseData(courseDetails);
  };

  useEffect(() => {
    fetchCourseData();
  }, []);

  const flatMaterials =
    courseData?.modules?.flatMap((m) =>
      m.lessons.flatMap((l) => l.materials)
    ) ?? [];

  useEffect(() => {
    if (!currentMaterial && flatMaterials.length > 0) {
      const curMaterial =
        flatMaterials.find((m) => m.id === courseData?.current_material) ??
        flatMaterials[0];
      setCurrentMaterial(curMaterial);
      updateCurrentMaterial(
        curMaterial.type === MaterialType.ARTICLE
          ? { ...curMaterial, total_read: 0 }
          : curMaterial.type === MaterialType.QUIZ_GROUP
          ? { ...curMaterial, result: 0 }
          : curMaterial
      );
    }
  }, [flatMaterials, currentMaterial]);

  const currentIndex = currentMaterial
    ? flatMaterials.findIndex((m) => m.id === currentMaterial.id)
    : -1;

  const nextMaterial =
    currentIndex >= 0 && currentIndex < flatMaterials.length - 1
      ? flatMaterials[currentIndex + 1]
      : null;

  const prevMaterial =
    currentIndex > 0 ? flatMaterials[currentIndex - 1] : null;

  const handleComplete = async () => {
    if (!user?.id || !currentCheck || !courseData) return;

    try {
      await patchCourseProgressApi({
        userId: user.id,
        courseId: courseData.id,
        materialId: nextMaterial ? nextMaterial.id : currentMaterial!.id,
        material: {
          type: currentMaterial!.type,
          ...(currentMaterial!.type === MaterialType.QUIZ_GROUP &&
          currentCheck.type === MaterialType.QUIZ_GROUP
            ? {
                quizGroup_id: currentMaterial!.id,
                result: currentCheck.result,
              }
            : {}),
        },
      });

      await fetchCourseData(); // refresh state from backend
    } catch (err) {
      console.error("PATCH complete error:", err);
    }
  };

  const handleNext = async () => {
    if (!nextMaterial || !currentMaterial || !courseData) return;

    if (!currentMaterial.isFinished) {
      await handleComplete();
    }

    setCurrentMaterial(nextMaterial);
    updateCurrentMaterial(
      nextMaterial.type === MaterialType.ARTICLE
        ? { ...nextMaterial, total_read: 0 }
        : nextMaterial.type === MaterialType.QUIZ_GROUP
        ? { ...nextMaterial, result: 0 }
        : nextMaterial
    );
  };

  const handlePrev = () => {
    if (prevMaterial) {
      setCurrentMaterial(prevMaterial);
      updateCurrentMaterial(
        prevMaterial.type === MaterialType.ARTICLE
          ? { ...prevMaterial, total_read: 0 }
          : prevMaterial.type === MaterialType.QUIZ_GROUP
          ? { ...prevMaterial, result: 0 }
          : prevMaterial
      );
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  if (!currentMaterial) return <p>There is no current Material</p>;
  if (!courseData) return null;

  return (
    <div className={`h-screen flex flex-col ${darkMode ? "dark" : ""}`}>
      <NavigationPlayground
        courseData={courseData}
        sidebarOpen={sidebarOpen}
        prevMaterial={prevMaterial}
        nextMaterial={nextMaterial}
        currentIndex={currentIndex}
        currentMaterial={currentMaterial}
        handlePrev={handlePrev}
        handleNext={handleNext}
        setSidebarOpen={setSidebarOpen}
        handleComplete={handleComplete}
      />

      <div className="flex flex-1 overflow-hidden">
        <SideNavbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          courseData={courseData}
          expandedModules={expandedModules}
          toggleModule={toggleModule}
          currentMaterial={currentMaterial}
          setCurrentMaterial={setCurrentMaterial}
          darkMode={darkMode}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          <MaterialViewer material={currentMaterial} />
        </main>
      </div>
    </div>
  );
};

export default CoursePlayground;
