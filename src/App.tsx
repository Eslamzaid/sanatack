import { useTranslation } from "react-i18next";
import { UserContextProvider } from "./context/UserContext";
import ErrorBoundary from "./utils/ErrorBoundary";
import Router from "./utils/router";
import { DASHBOARDTYPE } from "./utils/types/platfrom";
import { Toaster } from "sonner";
import * as pdfjsLib from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

function App({ switch_dashboard }: { switch_dashboard: DASHBOARDTYPE }) {
  const { i18n } = useTranslation();

  return (
    <div
      className="font-rubik min-h-screen bg-white dark:bg-black"
      dir={i18n.dir()}
    >
      <div className="relative min-h-screen">
        <UserContextProvider>
          <ErrorBoundary>
            <Router switch_dashboard={switch_dashboard} />
          </ErrorBoundary>
        </UserContextProvider>

        <Toaster
          position={i18n.dir() === "rtl" ? "top-left" : "top-right"}
          richColors
          closeButton
        />
      </div>
    </div>
  );
}

export default App;
