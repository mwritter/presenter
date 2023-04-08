import styled from "@emotion/styled";
import { SlideEntryType } from "../types/LibraryTypes";
import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import { Text, TextProps } from "@mantine/core";

const listenForSlideChanges = async (
  callBack: ({ currentSlide, nextSlide }: PromptStateType) => void
) => {
  await listen<SlideEntryType & { next: SlideEntryType }>(
    "set-slide",
    ({ payload }) => {
      callBack({
        currentSlide: payload,
        nextSlide: payload.next,
      });
    }
  );
};

const PromptContainer = styled.main`
  display: grid;
  color: white;
  background: black;
  height: 100vh;
  width: 100vw;
  font-size: 6vw;
  padding: 1rem;
`;

const CurrentSlide = styled(Text)<TextProps>`
  color: gold;
`;

const NextSlide = styled(Text)<TextProps>`
  border-top: 5px solid white;
`;

const Prompt = () => {
  const [state, setState] = useState<PromptStateType>({
    currentSlide: null,
    nextSlide: null,
  });

  useEffect(() => {
    // TODO: unlisten to these events on
    const unlisten = listenForSlideChanges(setState);
  }, []);
  return (
    <PromptContainer>
      <CurrentSlide>{state.currentSlide?.text}</CurrentSlide>
      {state.nextSlide && <NextSlide>{state.nextSlide?.text}</NextSlide>}
    </PromptContainer>
  );
};

type PromptStateType = {
  currentSlide: SlideEntryType | null;
  nextSlide: SlideEntryType | null;
};

export default Prompt;
