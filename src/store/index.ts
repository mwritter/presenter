import { FileEntry } from "@tauri-apps/api/fs";
import { WebviewWindow } from "@tauri-apps/api/window";
import { create } from "zustand";
import { PlaylistType } from "../types/LibraryTypes";

interface AppState {
  playlist: PlaylistType | null;
  library: FileEntry | null;
  show: PlaylistType | null;
  projector: WebviewWindow | null;
  playlists: FileEntry[];
  libraries: FileEntry[];
}

interface Action {
  setPlaylists: (files: FileEntry[]) => void;
  setPlaylist: (playlist: PlaylistType) => void;
  setLibraries: (libraries: FileEntry[]) => void;
  setLibrary: (library: FileEntry) => void;
  setShow: (show: PlaylistType) => void;
  setProjector: (projector: WebviewWindow) => void;
}

const useStore = create<AppState & Action>((set) => ({
  playlists: [],
  libraries: [],
  playlist: null,
  library: null,
  show: null,
  projector: null,
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
}));

export default useStore;
