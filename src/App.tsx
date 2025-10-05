import { useEffect, useRef, useState } from "react";
import "./configs/videos";
import { utilityVideos } from "./configs/videos";
import { cn } from "./utility/cn";

function App() {
  const [videoUrl, setVideoUrl] = useState<string | undefined>();
  const [currentVideoFileName, setCurrentVideoFileName] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = 0.5; // 👈 Set to half speed
    }
  }, [videoUrl]);

  const loadVideo = async (fileName: string) => {
    setCurrentVideoFileName(fileName);
    const url = (await import(`./assets/videos/${fileName}.mp4`)).default;
    setVideoUrl(url);
  };

  return (
    <>
      <div className="h-dvh w-full flex items-center justify-center">
        <div className="flex flex-col gap-2 px-2 py-2 overflow-x-auto">
          {utilityVideos.map((utilityVideo) => (
            <button
              className={cn("px-2 py-1 bg-white/10 rounded cursor-pointer", {
                "bg-white/30": utilityVideo.fileName === currentVideoFileName,
              })}
              onClick={() => loadVideo(utilityVideo.fileName)}
            >
              {utilityVideo.callout.text}
            </button>
          ))}
        </div>
        <div className="flex-1 min-h-0">
          <video
            ref={videoRef}
            key={videoUrl}
            className="w-full aspect-video rounded-2xl shadow"
            controls
            autoPlay
            loop
            // prevents metadata preload before click if reused
            preload="none"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </>
  );
}

export default App;
