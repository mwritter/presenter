import styled from "@emotion/styled";
import { listen, emit } from "@tauri-apps/api/event";
import {
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { SlideEntryType, ThemeEntryType } from "../types/LibraryTypes";
import { appWindow } from "@tauri-apps/api/window";
import { motion, AnimatePresence, usePresence } from "framer-motion";
import TextSlide from "../components/show/slide/TextSlide";
import { Text } from "@mantine/core";
import useStore from "../store";

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

const listenForThemesChange = async (
  callBack: (theme: ThemeEntryType[]) => void
) => {
  await listen<ThemeEntryType[]>("set-themes", async ({ payload }) => {
    callBack(payload);
  });
};

const listenForThemeChanges = async (callBack: (theme: string) => void) => {
  await listen<string>("set-theme", async ({ payload }) => {
    callBack(payload);
  });
};

const listenForMessageToggle = async (
  callBack: ({ show, text, style }: MessageType) => void
) => {
  await listen<MessageType>("toggle-message", async ({ payload }) => {
    callBack(payload);
  });
};

const listenForGetSize = async (callBack: () => void) => {
  await listen<string>("get-size", async () => {
    callBack();
  });
};

const ProjectorContainer = styled.main`
  position: relative;
  background: black;
  height: 100vh;
  width: 100vw;
`;

const SlideContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: black;
  width: 100%;
  height: 100%;
`;

const ProjectorVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`;

const ProjectorImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`;

const MessageContainer = styled.div`
  color: white;
`;

const Projector = () => {
  const containerRef = useRef<HTMLElement>(null);
  const setThemes = useStore(({ setThemes }) => setThemes);
  const [slide, setSlide] = useState<
    (SlideEntryType & { theme: string }) | null
  >();
  const [theme, setTheme] = useState<string | null>();
  const [media, setMedia] = useState<Record<string, string | null>>({
    img: null,
    video: null,
  });
  const [message, setMessage] = useState<MessageType>({
    show: false,
    text: "",
    style: null,
  });

  const emitProjectorSize = useCallback(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      emit("projector-size", { width, height });
    }
  }, []);

  useEffect(() => {
    // TODO: unlisten to these events on
    const unlisten = [
      listenForThemesChange(setThemes),
      listenForMessageToggle(setMessage),
      listenForGetSize(emitProjectorSize),
      listenForSlideChanges((p) =>
        setSlide(() => {
          return p;
        })
      ),
      listenForThemeChanges(setTheme),
    ];
  }, []);
  // TODO: update theme when container style changes as well
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
      <ProjectorContainer ref={containerRef} id="Projector">
        <SlideContainer>
          <AnimatePresence mode="wait">
            <motion.div
              key={slide?.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ flex: 1 }}
            >
              <SlideBody className={`theme-slide-${theme}`}>
                {slide && <TextSlide themeName={slide.theme} slide={slide} />}
                {media.img && <ProjectorImg src={media.img} />}
                {media.video && <ProjectorVideo autoPlay src={media.video} />}
              </SlideBody>
            </motion.div>
          </AnimatePresence>
          {message.show && (
            <Message text={message.text} style={message.style} />
          )}
        </SlideContainer>
      </ProjectorContainer>
    </>
  );
};

export default Projector;

const SlideBody = ({
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

  return (
    <div style={{ height: "100%" }} className={className}>
      {children}
    </div>
  );
};

const Message = ({
  text,
  style,
}: {
  text: string;
  style: CSSProperties | null;
}) => {
  return (
    <MessageContainer className="theme-slide-message" style={style || {}}>
      {text.split("\n").map((t, idx) => (
        <Text key={idx}>{t}</Text>
      ))}
    </MessageContainer>
  );
};

type MessageType = {
  show: boolean;
  text: string;
  style: CSSProperties | null;
};
