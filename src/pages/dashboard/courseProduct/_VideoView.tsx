import { Video, Clock, PlayCircle } from "lucide-react";

export function VideoView({ material }: any) {
  const isYouTube = !!material.url?.match(/youtu\.?(be|be\.com)/);
  let embedUrl = material.url;

  if (isYouTube && material.url) {
    embedUrl = material.url
      .replace("watch?v=", "embed/")
      .replace("youtu.be/", "www.youtube.com/embed/");
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 top-0 z-10">
        <div className="w-full px-6 py-6">
          <div className="flex items-center justify-between" dir="rtl">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Video className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
                    <PlayCircle className="w-3 h-3" />
                    درس فيديو
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                    <Clock className="w-3 h-3" />
                    {material.duration}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                  {material.title}
                </h1>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg max-w-4xl">
                  {material.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        {isYouTube && embedUrl ? (
          <div className="relative w-full aspect-video bg-black shadow-2xl">
            <iframe
              className="w-full h-full"
              src={embedUrl}
              title={material.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="relative w-full aspect-video bg-black shadow-2xl">
            <video
              className="w-full h-full object-cover"
              src={material.url}
              controls
              poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect width='1920' height='1080' fill='%23000'/%3E%3Ctext x='960' y='540' text-anchor='middle' fill='%23fff' font-size='48' font-family='Arial'%3EVideo Loading...%3C/text%3E%3C/svg%3E"
            />
          </div>
        )}
      </div>

      <div className="w-full px-6 py-8">
        <div className="max-w-4xl mx-auto"></div>
      </div>
    </div>
  );
}
