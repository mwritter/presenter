import { FileEntry } from "@tauri-apps/api/fs";
import { WebviewWindow } from "@tauri-apps/api/window";
import { create } from "zustand";
import {
  LibraryEntryType,
  MediaType,
  PlaylistType,
  PresenterMode,
} from "../types/LibraryTypes";

interface AppState {
  playlist: PlaylistType | null;
  library: LibraryEntryType | null;
  media: MediaType | null;
  show: PlaylistType | null;
  projector: WebviewWindow | null;
  playlists: FileEntry[];
  libraries: FileEntry[];
  mediaFiles: FileEntry[];
  mode: PresenterMode;
}

interface Action {
  setPlaylists: (files: FileEntry[]) => void;
  setPlaylist: (playlist: PlaylistType) => void;
  setLibraries: (libraries: FileEntry[]) => void;
  setLibrary: (library: LibraryEntryType) => void;
  setMedia: (media: MediaType) => void;
  setMediaFiles: (files: FileEntry[]) => void;
  setShow: (show: PlaylistType) => void;
  setProjector: (projector: WebviewWindow) => void;
  setMode: (mode: PresenterMode) => void;
}

const useStore = create<AppState & Action>((set) => ({
  playlists: [],
  libraries: [],
  mediaFiles: [],
  playlist: null,
  library: null,
  media: null,
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
  setMedia: (media) => set(() => ({ media })),
  setMediaFiles: (mediaFiles) => set(() => ({ mediaFiles })),
  setShow: (show) => set(() => ({ show })),
  setProjector: (projector) => set(() => ({ projector })),
  setMode: (mode) => set(() => ({ mode })),
}));

export default useStore;
