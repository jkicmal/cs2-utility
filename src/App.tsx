import { useEffect, useRef, useState } from "react";
import "./configs/videos";
import { utilityVideos } from "./configs/videos";
import { cn } from "./utility/cn";
import { GiHamburgerMenu } from "react-icons/gi";

function App() {
  const [videoUrl, setVideoUrl] = useState<string | undefined>();
  const [currentVideoFileName, setCurrentVideoFileName] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.playbackRate = 0.5;
  }, [videoUrl]);

  const loadVideo = async (fileName: string) => {
    setCurrentVideoFileName(fileName);
    const url = (await import(`./assets/videos/${fileName}.mp4`)).default;
    setVideoUrl(url);
  };

  return (
    <div className="h-dvh w-full flex items-stretch gap-4 p-4">
      {/* Toggle */}
      <button
        type="button"
        className="mr-1 p-2 rounded hover:bg-white/10 cursor-pointer"
        aria-expanded={menuOpen}
        aria-controls="left-menu"
        onClick={() => setMenuOpen((v) => !v)}
      >
        <GiHamburgerMenu />
        <span className="sr-only">Toggle menu</span>
      </button>

      {/* Sidebar */}
      <aside
        id="left-menu"
        aria-hidden={!menuOpen}
        {...(!menuOpen ? { inert: "" as unknown as boolean } : {})} // <-- fix inert usage too
        className={cn(
          "shrink-0 min-w-0 overflow-hidden h-full bg-black/10 rounded-xl",
          "transition-[width,opacity] duration-300 ease-out",
          menuOpen ? "w-[300px] opacity-100" : "w-0 opacity-0"
        )}
      >
        <div className="h-full min-w-0 overflow-y-auto px-2 py-2">
          {utilityVideos.map((utilityVideo) => (
            <button
              key={utilityVideo.fileName}
              title={utilityVideo.callout.text} // nice-to-have: show full text on hover
              className={cn(
                "w-full px-2 py-1 rounded cursor-pointer text-center",
                "hover:bg-white/20 focus:outline-none focus:ring",
                {
                  "bg-white/30": utilityVideo.fileName === currentVideoFileName,
                }
              )}
              onClick={() => loadVideo(utilityVideo.fileName)}
            >
              <span className="block truncate">
                {utilityVideo.callout.text}
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-h-0 flex justify-center items-center">
        <video
          ref={videoRef}
          key={videoUrl}
          className="h-full aspect-video rounded-2xl shadow"
          controls
          autoPlay
          loop
          preload="none"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </main>
    </div>
  );
}

export default App;
