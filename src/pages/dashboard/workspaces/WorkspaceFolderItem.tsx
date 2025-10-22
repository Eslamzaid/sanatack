import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  Boxes,
  EllipsisVertical,
  FileQuestionIcon,
  FileTextIcon,
  Loader2Icon,
  Move,
  PlayIcon,
  Trash2,
} from "lucide-react";
import { Document, Page } from "react-pdf";
import {
  deleteWorkspace,
  getAllSpaces,
  linkWorkspaceToSpace,
  unlinkWorkspaceFromSpace,
} from "@/utils/_apis/courses-apis";
import { formatRelativeDate } from "@/components/utiles";
import { Workspace } from "@/lib/types";
import { getErrorMessage } from "../utils";

type WorkspaceFolderItemProps = {
  workspace: Workspace;
  onClick: () => void;
  refreshParentComponent: () => void;
  isRTL?: boolean;
};

type Space = { id: string; name: string };

export default function WorkspaceFolderItem({
  workspace,
  onClick,
  refreshParentComponent,
  isRTL,
}: WorkspaceFolderItemProps) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const { youtubeVideo, workspaceName, createdAt, workspaceType, documentUrl } =
    workspace;

  function renderBanner() {
    if (workspaceType === "youtube" && youtubeVideo?.transcribe?.data?.url) {
      const url = youtubeVideo.transcribe.data.url;
      const match = url.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|embed)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
      );
      const videoID = match ? match[1] : null;
      const thumbnailUrl = videoID
        ? `https://img.youtube.com/vi/${videoID}/hqdefault.jpg`
        : null;

      return videoID ? (
        <img
          src={String(thumbnailUrl)}
          alt="YouTube thumbnail"
          className="w-full h-28 object-cover rounded-t-2xl"
        />
      ) : (
        <div className="flex items-center justify-center min-h-28 rounded-t-2xl bg-gray-100 border-b border-zinc-200">
          <PlayIcon className="h-12 w-12 text-zinc-400" />
        </div>
      );
    }

    if (workspaceType === "document" && documentUrl) {
      return (
        <div className="w-full h-28 overflow-hidden rounded-t-2xl border-b border-zinc-200 flex items-center justify-center bg-gray-50">
          <Document file={documentUrl} loading={<Loader2Icon />}>
            <Page
              pageNumber={1}
              scale={0.5}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </Document>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center min-h-28 rounded-t-2xl border-b border-zinc-200 bg-gray-50">
        <FileQuestionIcon className="h-12 w-12 text-zinc-400" />
      </div>
    );
  }

  const fetchSpaces = async () => {
    try {
      const spaces = await getAllSpaces();
      setSpaces(spaces);
    } catch (err) {
      const fallbackMessage = t(
        "dashboard.errors.loadSpaces",
        "Failed to load spaces. Please try again later."
      );
      const msg = getErrorMessage(err, fallbackMessage);
      toast.error(msg, {
        closeButton: true,
      });
      console.error("Error fetching available spaces:", err);
    }
  };

  const handleLinkWorkspaceToSpace = async (
    space_id: string,
    workspace_id: string
  ) => {
    try {
      await linkWorkspaceToSpace(space_id, workspace_id);
      refreshParentComponent();
    } catch (err) {
      const fallbackMessage = t(
        "dashboard.errors.linkWorkspace",
        "Unable to move the workspace. Please try again."
      );
      const msg = getErrorMessage(err, fallbackMessage);
      toast.error(msg, { closeButton: true });
      console.error("Error linking workspace to space:", err);
    } finally {
      setMenuOpen(false);
    }
  };

  const handleUnlinkWorkspacefromSpace = async (workspace_id: string) => {
    try {
      await unlinkWorkspaceFromSpace(workspace_id);
      refreshParentComponent();
    } catch (err) {
      const fallbackMessage = t(
        "dashboard.errors.unlinkWorkspace",
        "Unable to remove the workspace from this space. Please try again."
      );
      const msg = getErrorMessage(err, fallbackMessage);
      toast.error(msg, { closeButton: true });
      console.error("Error unlinking workspace from space:", err);
    } finally {
      setMenuOpen(false);
    }
  };

  const handleWorkspaceDeletion = async (workspace_id: string) => {
    try {
      await deleteWorkspace(workspace_id);
      refreshParentComponent();
    } catch (err) {
      const fallbackMessage = t(
        "dashboard.errors.deleteWorkspace",
        "Failed to delete the workspace. Please try again later."
      );
      const msg = getErrorMessage(err, fallbackMessage);
      toast.error(msg, { closeButton: true });
      console.error("Error deleting workspace:", err);
    } finally {
      setMenuOpen(false);
    }
  };

  const fetchData = async () => {
    await Promise.all([fetchSpaces()]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-[var(--ws-card-w,15rem)] cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      aria-label={`Open workspace ${workspaceName}`}
    >
      <Toaster
        richColors
        theme="system"
        dir={isRTL ? "rtl" : "ltr"}
        position={isRTL ? "top-left" : "top-right"}
        closeButton
        duration={5000}
      />

      <Card
        onClick={onClick}
        className="relative flex flex-col group rounded-2xl
       h-[calc(theme(spacing.28)+theme(spacing.20))]"
      >
        {renderBanner()}

        <CardContent className="flex flex-1 items-center justify-start gap-4 p-5 pb-4">
          <div className="flex items-center justify-center w-6 h-6">
            {workspaceType === "youtube" && (
              <PlayIcon className="h-4 w-4 text-zinc-700" />
            )}
            {workspaceType === "document" && (
              <FileTextIcon className="h-4 w-4 text-zinc-700" />
            )}
          </div>

          <div className={`min-w-0 ${isRTL ? "text-right" : "text-left"}`}>
            <h3 className="w-full max-w-[210px] truncate select-none text-sm font-medium text-zinc-900 transition-colors group-hover:text-primary">
              {workspaceName}
            </h3>
            <p className="mt-1 text-xs text-zinc-500">
              {formatRelativeDate(createdAt)}
            </p>
          </div>
        </CardContent>

        <div
          className={[
            "absolute right-1 top-1 z-10 transition-opacity",
            "opacity-0 pointer-events-none",
            "group-hover:opacity-100 group-hover:pointer-events-auto",
            menuOpen ? "opacity-100 pointer-events-auto" : "",
          ].join(" ")}
        >
          <DropdownMenu
            open={menuOpen}
            onOpenChange={setMenuOpen}
            modal={false}
          >
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                aria-label="More actions"
                className="
        flex items-center justify-center
        rounded-xl p-2
        text-white transition
        group-hover:bg-zinc-100 group-hover:text-zinc-700
        focus:outline-none focus:ring-2 focus:ring-primary
      "
              >
                <EllipsisVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              onClick={(e) => e.stopPropagation()}
              className="w-56 rounded-lg border border-zinc-200 bg-white shadow-lg p-1"
            >
              <DropdownMenuSub>
                <DropdownMenuSubTrigger
                  className="
          flex items-center gap-2
          px-3 py-2 rounded-md
          text-sm text-zinc-700
          data-[state=open]:bg-zinc-100
          hover:bg-zinc-100 hover:text-zinc-900
        "
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <Move className="h-4 w-4 text-zinc-700" />
                  <span>Move to</span>
                </DropdownMenuSubTrigger>

                <DropdownMenuSubContent
                  sideOffset={8}
                  alignOffset={-4}
                  className="w-64 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="max-h-64 overflow-y-auto py-1 [&>*]:m-2">
                    {spaces.length === 0 ? (
                      <div className="px-3 py-2 text-xs text-zinc-500">
                        No spaces available. Create a space first.
                      </div>
                    ) : (
                      spaces.map((space) =>
                        space.id !== workspace.spaceId ? (
                          <DropdownMenuItem
                            key={space.id}
                            className="
                  flex items-center gap-2
                  px-3 py-2 rounded-md
                  text-sm text-zinc-700
                  hover:bg-zinc-100 hover:text-zinc-900
                  cursor-pointer
                "
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLinkWorkspaceToSpace(
                                space.id,
                                workspace.id
                              );
                            }}
                          >
                            <Boxes className="h-4 w-4 text-zinc-700" />
                            <span className="truncate">{space.name}</span>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            key={space.id}
                            className="
                  flex items-center gap-2
                  px-3 py-2 rounded-md
                  text-sm text-zinc-700
                  opacity-70 bg-slate-200
                  hover:bg-zinc-100 hover:text-zinc-900
                  cursor-pointer
                "
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnlinkWorkspacefromSpace(workspace.id);
                            }}
                          >
                            <Boxes className="h-4 w-4 text-zinc-700" />
                            <span className="truncate">{space.name}</span>
                          </DropdownMenuItem>
                        )
                      )
                    )}
                  </div>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleWorkspaceDeletion(workspace.id);
                  setMenuOpen(false);
                }}
                className="
        flex items-center gap-2
        px-3 py-2 rounded-md
        text-sm group/trash duration-200 transition-all ease-linear
        hover:!bg-red-100 hover:!text-red-700 cursor-pointer
      "
              >
                <Trash2 className="h-4 w-4 group-hover/trash:text-red-500 duration-200 transition-all ease-linear" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </motion.div>
  );
}
