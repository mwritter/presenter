import { FileEntry } from "@tauri-apps/api/fs";
import { create } from "zustand";
import { PlaylistType } from "../types/LibraryTypes";

interface AppState {
  playlist: PlaylistType | null;
  library: FileEntry | null;
  show: PlaylistType | null;
  playlists: FileEntry[];
  libraries: FileEntry[];
}

interface Action {
  setPlaylists: (files: FileEntry[]) => void;
  setPlaylist: (playlist: PlaylistType) => void;
  setLibraries: (libraries: FileEntry[]) => void;
  setLibrary: (library: FileEntry) => void;
  setShow: (show: PlaylistType) => void;
}

const useStore = create<AppState & Action>((set) => ({
  playlists: [],
  libraries: [],
  playlist: null,
  library: null,
  show: null,
  setPlaylists: (playlists) => {
    set((state) => ({ ...state, playlists }));
  },
  setPlaylist: (playlist) => {
    set((state) => ({ ...state, playlist }));
  },
  setLibraries: (libraries) => set((state) => ({ ...state, libraries })),
  setLibrary: (library) => set((state) => ({ ...state, library })),
  setShow: (show) => set((state) => ({ ...state, show })),
}));

export default useStore;
