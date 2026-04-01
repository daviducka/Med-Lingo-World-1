import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const MUSIC_URL = "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (audioRef.current && !isMuted) {
      audioRef.current.play().catch(() => {
        console.log("Autoplay prevented by browser");
      });
    }
  }, [isMuted]);

  const toggleAudio = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="https://assets.mixkit.co/active_storage/sfx/2460/2460-preview.mp3"
        loop
        muted={isMuted}
        style={{ display: "none" }}
      />
      <button
        onClick={toggleAudio}
        className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-primary/20 hover:bg-primary/30 text-primary transition-all shadow-lg border-2 border-primary/30"
        title={isMuted ? "Ndez muziken" : "Fik muziken"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>
    </>
  );
}
