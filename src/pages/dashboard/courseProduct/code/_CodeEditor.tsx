import { LoaderCircleIcon, PlayIcon, RefreshCcw, FileCode } from "lucide-react";
import EditorFrame from "./_EditorFrame";
import TerminalView from "./_TerminalView";
import { ConsoleEntry } from "./type";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function CodeEditor({
  darkMode,
  isRunning,
  runCode,
  resetCode,
  checkCode,
  consoleOutput,
  initialCode,
}: {
  code: string;
  darkMode: boolean;
  isRunning: boolean;
  currentLang: string;
  runCode: () => void;
  resetCode: () => void;
  checkCode: () => void;
  copyCode: () => void;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  consoleOutput: ConsoleEntry[];
  initialCode: string;
}) {
  // const langMap: Record<string, string> = {
  //   javascript: "js",
  //   typescript: "ts",
  //   python: "py",
  //   html: "html",
  //   css: "css",
  // };

  const bgCanvas = "bg-[#f3f4f6] dark:bg-[#0d1117]";
  const bgSubtle = " bg-[#f3f4f6] dark:bg-[#0d1117]";
  const borderClr = "border-gray-300 dark:border-gray-700";
  const textMuted = "text-gray-900 dark:text-gray-400";

  return (
    <main className={`h-full ${bgCanvas} text-gray-900 dark:text-gray-200`}>
      <div className="flex flex-col overflow-hidden scrollbar-hidden h-full">
        <ResizablePanelGroup
          direction="vertical"
          className="h-full min-h-[400px]"
        >
          <ResizablePanel defaultSize={70} minSize={40} className="h-full">
            <div className="flex-1 overflow-hidden relative p-4 h-full">
              <EditorFrame
                initialCode={initialCode}
                theme={darkMode ? "vs-dark" : "vs"}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={30} minSize={20}>
            <div className="p-4">
              <div className="bottom-6 right-10 flex gap-3">
                <button
                  onClick={resetCode}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium ${textMuted} ${bgSubtle} border ${borderClr} rounded-lg hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg`}
                >
                  <RefreshCcw className="w-4 h-4" />
                  Reset
                </button>
                <button
                  onClick={checkCode}
                  disabled={isRunning}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-black dark:text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500 border border-blue-700 disabled:border-blue-500 rounded-lg transition-colors disabled:cursor-not-allowed shadow-md hover:shadow-lg`}
                >
                  {isRunning ? (
                    <LoaderCircleIcon className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileCode className="w-4 h-4" />
                  )}
                  {isRunning ? "Checking…" : "Check"}
                </button>

                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-black dark:text-white bg-green-600 hover:bg-green-700 disabled:bg-green-500 border border-green-700 disabled:border-green-500 rounded-lg transition-colors disabled:cursor-not-allowed shadow-md hover:shadow-lg`}
                >
                  {isRunning ? (
                    <LoaderCircleIcon className="w-4 h-4 animate-spin" />
                  ) : (
                    <PlayIcon className="w-4 h-4" />
                  )}
                  {isRunning ? "Running…" : "Run"}
                </button>
              </div>
              <TerminalView entries={consoleOutput} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </main>
  );
}
