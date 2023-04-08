import styled from "@emotion/styled";
import { useState } from "react";
import { Stack } from "@mantine/core";
import useStore from "../../../store";
import PlaylistEditToolBar from "../../library/playlists/PlaylistEditToolBar";
import PlaylistSectionToolBar from "../../library/playlists/PlaylistSectionToolBar";
import Slide from "../slide/Slide";
import { editPlaylistSlideData } from "../../../helpers/playlist.helper";
import { motion, AnimatePresence } from "framer-motion";
import { emit } from "@tauri-apps/api/event";

const ShowViewGrid = styled.div`
  display: grid;
  max-width: 2000px;
  width: 100%;
  grid-template-columns: repeat(auto-fill, 350px);
  gap: 1rem;
  justify-content: center;
  align-self: center;
`;

const PlaylistShowView = () => {
  const [activeSlideId, setActiveSlideId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [projector, show, playlist] = useStore(
    ({ projector, playlist, show }) => [projector, show, playlist]
  );

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
                <ShowViewGrid>
                  {section?.slides?.map((slide, idx) => {
                    return (
                      <motion.div
                        key={slide.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, ease: "easeIn" }}
                      >
                        <Slide
                          theme={section?.theme}
                          active={activeSlideId === section.id + idx}
                          slide={slide}
                          onClick={() => {
                            setActiveSlideId(section.id + idx);
                            emit("set-slide", {
                              ...slide,
                              theme: section.theme,
                              next: section?.slides[idx + 1] || null,
                            });
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
