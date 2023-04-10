import styled from "@emotion/styled";
import { useCallback, useState } from "react";
import { Stack } from "@mantine/core";
import useStore from "../../../store";
import PlaylistEditToolBar from "../../library/playlists/PlaylistEditToolBar";
import PlaylistSectionToolBar from "../../library/playlists/PlaylistSectionToolBar";
import Slide from "../slide/Slide";
import { editPlaylistSlideData } from "../../../helpers/playlist.helper";
import { motion } from "framer-motion";
import { emit } from "@tauri-apps/api/event";
import { useHotkeys } from "@mantine/hooks";
import { PlaylistEntryType, SlideEntryType } from "../../../types/LibraryTypes";

const ShowViewGrid = styled.div<{ slideSize?: number }>`
  display: grid;
  max-width: 2000px;
  width: 100%;
  grid-template-columns: repeat(
    auto-fill,
    ${({ slideSize }) => (slideSize ? slideSize + "px" : "350px")}
  );
  gap: 1rem;
  justify-content: center;
  align-self: center;
  transition: all 1s;
`;

const PlaylistShowView = ({ slideSize }: { slideSize: number }) => {
  const [activeSlide, _setActiveSlide] = useState<{
    slideId: string | null;
    sectionId: string | null;
  }>({ slideId: null, sectionId: null });
  const [show, playlist] = useStore(({ playlist, show }) => [show, playlist]);

  const getSlideSize = useCallback(() => {
    console.log(slideSize);
    return slideSize * 0.01 * 1400;
  }, [slideSize]);

  const setActiveSlide = useCallback(
    (slide: SlideEntryType, section: PlaylistEntryType) => {
      const currentIdx = section.slides.findIndex(({ id }) => id === slide.id);
      _setActiveSlide({
        slideId: slide.id,
        sectionId: section.id,
      });
      emit("set-slide", {
        ...slide,
        theme: section.theme,
        next: section?.slides[currentIdx + 1] || null,
      });
    },
    []
  );

  const moveToNextSlide = useCallback(() => {
    if (!show || !activeSlide.slideId || !activeSlide.sectionId) return;
    const { slideId, sectionId } = activeSlide;
    const currentSection = show.content.find(({ id }) => id === sectionId);
    const currentSlideIdx = currentSection?.slides.findIndex(
      ({ id }) => id === slideId
    );
    if (!currentSection || currentSlideIdx === undefined || currentSlideIdx < 0)
      return;

    const nextSlide = currentSection.slides[currentSlideIdx + 1] || null;
    setActiveSlide(nextSlide, currentSection);
  }, [activeSlide, show]);

  const moveToPreviousSlide = useCallback(() => {
    if (!show || !activeSlide.slideId || !activeSlide.sectionId) return;
    const { slideId, sectionId } = activeSlide;
    const currentSection = show.content.find(({ id }) => id === sectionId);
    const currentSlideIdx = currentSection?.slides.findIndex(
      ({ id }) => id === slideId
    );
    if (
      !currentSection ||
      currentSlideIdx === undefined ||
      currentSlideIdx <= 0
    )
      return;

    const nextSlide = currentSection.slides[currentSlideIdx - 1] || null;
    setActiveSlide(nextSlide, currentSection);
  }, [activeSlide, show]);

  useHotkeys([
    ["ArrowRight", moveToNextSlide],
    ["ArrowLeft", moveToPreviousSlide],
  ]);

  return (
    <>
      <PlaylistEditToolBar />
      <Stack style={{ zIndex: 0 }} p={20} spacing={50}>
        {show?.content.map((section) => (
          <motion.div
            key={section.id}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeIn" }}
          >
            <Stack key={`${section.id}`}>
              <>
                <PlaylistSectionToolBar
                  playlistName={show.name}
                  section={section}
                />
                <ShowViewGrid slideSize={getSlideSize()}>
                  {section?.slides?.map((slide, idx) => {
                    return (
                      <motion.div
                        key={slide.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, ease: "easeIn" }}
                      >
                        <Slide
                          size={getSlideSize()}
                          theme={section?.theme}
                          active={activeSlide.slideId === slide.id}
                          slide={slide}
                          onClick={() => {
                            setActiveSlide(slide, section);
                          }}
                          onGroupChange={(group) => {
                            if (playlist) {
                              editPlaylistSlideData(
                                slide.id,
                                section.id,
                                { group },
                                playlist
                              );
                            }
                          }}
                        />
                      </motion.div>
                    );
                  })}
                </ShowViewGrid>
              </>
            </Stack>
          </motion.div>
        ))}
      </Stack>
    </>
  );
};

export default PlaylistShowView;
