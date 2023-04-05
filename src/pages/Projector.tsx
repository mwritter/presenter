import styled from "@emotion/styled";
import { Text } from "@mantine/core";
import { listen } from "@tauri-apps/api/event";
import { createRef, useEffect, useState } from "react";
import ProjectorStyle from "../components/projector/ProjectorStyle";
import { MediaEntryType, SlideEntryType } from "../types/LibraryTypes";
import { appWindow } from "@tauri-apps/api/window";
import { motion, AnimatePresence } from "framer-motion";
import TextSlide from "../components/show/slide/TextSlide";

const listenForSlideChanges = async (
  callBack: (slide: SlideEntryType & { theme: string }) => void
) => {
  await listen<SlideEntryType & { theme: string }>(
    "set-slide",
    ({ payload }) => {
      callBack(payload);
    }
  );
};

const listenForThemeChanges = async (callBack: (theme: string) => void) => {
  await listen<string>("set-theme", async ({ payload }) => {
    callBack(payload);
  });
};

const ProjectorContainer = styled.main`
  background: black;
  height: 100vh;
  width: 100vw;
`;

const SlideContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const SlideBody = styled.div`
  height: 100%;
`;

const ProjectorVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
`;

const ProjectorImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
`;

const Projector = () => {
  const slideRef = createRef<HTMLDivElement>();
  const containerRef = createRef<HTMLElement>();
  const [slide, setSlide] = useState<
    (SlideEntryType & { theme: string }) | null
  >();
  const [theme, setTheme] = useState<string | null>();
  const [media, setMedia] = useState<Record<string, string | null>>({
    img: null,
    video: null,
  });

  // TODO: going to need to trigger a re render when themes updates
  useEffect(() => {
    // TODO: unlisten to these events on
    const unlisten = [
      listenForSlideChanges(setSlide),
      listenForThemeChanges(setTheme),
    ];
  }, []);

  useEffect(() => {
    if (slide && slide.theme && slide.theme !== theme) {
      appWindow.emit("set-theme", slide.theme);
    } else if (slide && !slide.theme) {
      setTheme(null);
    }
    if (slide?.media) {
      const ext =
        slide?.media.source.split("%2F").pop()?.split(".").pop() || "";
      if (["mp4", "mov"].includes(ext)) {
        setMedia({
          video: slide.media.source,
          img: null,
        });
      } else if (["png", "jpg", "jpeg"].includes(ext)) {
        setMedia({
          video: null,
          img: slide.media.source,
        });
      }
    } else {
      setMedia({
        video: null,
        img: null,
      });
    }
  }, [slide]);

  return (
    <>
      {slide ? (
        <ProjectorContainer
          style={{
            position: "relative",
          }}
          ref={containerRef}
          id="Projector"
        >
          <SlideContainer
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              backgroundColor: "black",
            }}
          >
            <SlideBody className={`theme-slide-${theme}`} ref={slideRef}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <TextSlide slide={slide} />
                  {media.img && <ProjectorImg src={media.img} />}
                  {media.video && <ProjectorVideo autoPlay src={media.video} />}
                </motion.div>
              </AnimatePresence>
            </SlideBody>
          </SlideContainer>
        </ProjectorContainer>
      ) : (
        <ProjectorContainer></ProjectorContainer>
      )}
    </>
  );
};

export default Projector;
