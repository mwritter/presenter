import { FileEntry } from "@tauri-apps/api/fs";
import { WebviewWindow } from "@tauri-apps/api/window";
import { create } from "zustand";
import {
  LibraryEntryType,
  PlaylistType,
  PresenterMode,
} from "../types/LibraryTypes";

interface AppState {
  playlist: PlaylistType | null;
  library: LibraryEntryType | null;
  show: PlaylistType | null;
  projector: WebviewWindow | null;
  playlists: FileEntry[];
  libraries: FileEntry[];
  mode: PresenterMode;
}

interface Action {
  setPlaylists: (files: FileEntry[]) => void;
  setPlaylist: (playlist: PlaylistType) => void;
  setLibraries: (libraries: FileEntry[]) => void;
  setLibrary: (library: LibraryEntryType) => void;
  setShow: (show: PlaylistType) => void;
  setProjector: (projector: WebviewWindow) => void;
  setMode: (mode: PresenterMode) => void;
}

const useStore = create<AppState & Action>((set) => ({
  playlists: [],
  libraries: [],
  playlist: null,
  library: null,
  show: null,
  projector: null,
  mode: PresenterMode.PLAYLIST,
  setPlaylists: (playlists) => {
    set(() => ({ playlists }));
  },
  setPlaylist: (playlist) => {
    set(() => ({ playlist }));
  },
  setLibraries: (libraries) => set(() => ({ libraries })),
  setLibrary: (library) => set(() => ({ library })),
  setShow: (show) => set(() => ({ show })),
  setProjector: (projector) => set(() => ({ projector })),
  setMode: (mode) =>
    set((state) => {
      if (mode === PresenterMode.PLAYLIST && state.library) {
        return { mode, library: null };
      }
      return { mode };
    }),
}));

export default useStore;
