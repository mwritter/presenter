import styled from "@emotion/styled";
import { Text } from "@mantine/core";
import { listen } from "@tauri-apps/api/event";
import { readTextFile } from "@tauri-apps/api/fs";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { createRef, useEffect, useRef, useState } from "react";
import ProjectorStyle from "../components/projector/ProjectorStyle";
import { SlideEntryType } from "../types/LibraryTypes";
import { appWindow } from "@tauri-apps/api/window";

const listenForSlideChanges = async (
  callBack: (slide: SlideEntryType) => void
) => {
  await listen<SlideEntryType>("set-slide", ({ payload }) => {
    callBack(payload);
  });
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
  /* position: absolute;
  font-size: 4vw;
  text-align: center;
  text-transform: uppercase;
  white-space: nowrap;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); */
`;

const Projector = () => {
  const slideRef = createRef<HTMLDivElement>();
  const containerRef = createRef<HTMLElement>();
  const [slide, setSlide] = useState<SlideEntryType>();
  const [theme, setTheme] = useState<string | null>();

  useEffect(() => {
    // TODO: unlisten to these events on
    const unlisten = [
      listenForSlideChanges(setSlide),
      listenForThemeChanges(setTheme),
    ];
  }, []);

  useEffect(() => {
    console.log(theme);
    if (slide && slide.theme && slide.theme !== theme) {
      appWindow.emit("set-theme", slide.theme);
    } else if (slide && !slide.theme) {
      setTheme(null);
    }
  }, [slide]);

  return (
    <>
      <ProjectorStyle />
      {slide ? (
        <ProjectorContainer ref={containerRef} id="Projector">
          <SlideContainer className={`theme-projector-${theme}`}>
            <div className={`theme-slide-${theme}`} ref={slideRef}>
              {slide.text.split("\n").map((t, idx) => (
                <Text key={idx}>{t}</Text>
              ))}
            </div>
          </SlideContainer>
        </ProjectorContainer>
      ) : (
        <ProjectorContainer></ProjectorContainer>
      )}
    </>
  );
};

export default Projector;
