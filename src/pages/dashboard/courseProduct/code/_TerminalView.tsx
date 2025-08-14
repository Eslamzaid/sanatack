import { TerminalIcon } from "lucide-react";
import { COLOR_MAP, ConsoleEntry, ICON_MAP } from "./type";

export default function TerminalView({ entries }: { entries: ConsoleEntry[] }) {
  const bgCanvas = "bg-white dark:bg-[#0b0e14]";
  const bgHeader = "bg-[#f3f4f6] dark:bg-[#1a1f2b]";
  const bgBody = "bg-[#f3f4f6] dark:bg-[#0d1117]";
  const borderClr = "border-gray-400 dark:border-gray-700";

  return (
    <div className={`h-full border-t ${borderClr} ${bgCanvas}`}>
      <div
        className={`flex items-center justify-end px-4 ${bgHeader} border-b ${borderClr}`}
      >
        <TerminalIcon className="w-4 h-4 text-gray-600 dark:text-gray-200" />
      </div>

      <div className={` overflow-y-auto p-4 ${bgBody} font-mono text-sm`}>
        {entries.length > 0 ? (
          entries.map((entry, i) => (
            <div key={i} className="mb-2 flex items-start gap-3">
              <span className="flex-shrink-0 text-gray-900 dark:text-gray-300">
                {ICON_MAP[entry.type]}
              </span>
              <pre
                className={`${
                  COLOR_MAP[entry.type]
                } whitespace-pre-wrap break-all`}
              >
                {entry.content}
              </pre>
            </div>
          ))
        ) : (
          <div className="flex h-full items-center justify-center ${textMuted}">
            <div className="text-center space-y-2">
              <TerminalIcon className="w-6 h-6 mx-auto" />
              <p>Run your code to see the output...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
