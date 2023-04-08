import styled from "@emotion/styled";
import { TauriEvent, listen, emit } from "@tauri-apps/api/event";
import {
  ReactNode,
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { SlideEntryType } from "../types/LibraryTypes";
import { appWindow } from "@tauri-apps/api/window";
import { motion, AnimatePresence, usePresence } from "framer-motion";
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

const listenForGetSize = async (callBack: () => void) => {
  console.log("listening to get-size");
  await listen<string>("get-size", async () => {
    callBack();
  });
};

const projectorHandle = (node: HTMLElement) => {
  const { width, height } = node.getBoundingClientRect();
  console.log("emitting projector-size");
  emit("projector-size", { width, height });
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
  const containerRef = useRef<HTMLElement>(null);
  const [slide, setSlide] = useState<
    (SlideEntryType & { theme: string }) | null
  >();
  const [theme, setTheme] = useState<string | null>();
  const [media, setMedia] = useState<Record<string, string | null>>({
    img: null,
    video: null,
  });

  const emitProjectorSize = useCallback(() => {
    console.log("trying");
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      console.log("emitting projector-size");
      emit("projector-size", { width, height });
    }
  }, []);

  useEffect(() => {
    // TODO: unlisten to these events on
    const unlisten = [
      listenForGetSize(emitProjectorSize),
      listenForSlideChanges((p) =>
        setSlide(() => {
          return p;
        })
      ),
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

  useEffect(() => emitProjectorSize(), []);

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
              backgroundColor: "black",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{ flex: 1 }}
              >
                <SlideBodyV2 className={`theme-slide-${theme}`}>
                  <TextSlide slide={slide} />
                  {media.img && <ProjectorImg src={media.img} />}
                  {media.video && <ProjectorVideo autoPlay src={media.video} />}
                </SlideBodyV2>
              </motion.div>
            </AnimatePresence>
          </SlideContainer>
        </ProjectorContainer>
      ) : (
        <ProjectorContainer ref={containerRef}></ProjectorContainer>
      )}
    </>
  );
};

export default Projector;

const SlideBodyV2 = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) => {
  const [isPresent, safeToRemove] = usePresence();
  useEffect(() => {
    if (!isPresent) safeToRemove();
  }, [isPresent]);

  return <SlideBody className={className}>{children}</SlideBody>;
};
