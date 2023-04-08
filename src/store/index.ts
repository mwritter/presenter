import { FileEntry } from "@tauri-apps/api/fs";
import { WebviewWindow } from "@tauri-apps/api/window";
import { create } from "zustand";
import {
  LibraryEntryType,
  MediaType,
  PlaylistType,
  PresenterMode,
  ThemeEntryType,
} from "../types/LibraryTypes";

interface AppState {
  playlist: PlaylistType | null;
  library: LibraryEntryType | null;
  media: MediaType | null;
  theme: ThemeEntryType | null;
  show: PlaylistType | null;
  projector: {
    webview: WebviewWindow;
    height: number;
    width: number;
  } | null;
  prompt: WebviewWindow | null;
  playlists: FileEntry[];
  libraries: FileEntry[];
  mediaFiles: FileEntry[];
  themes: ThemeEntryType[];
  mode: PresenterMode;
}

interface Action {
  setPlaylists: (files: FileEntry[]) => void;
  setPlaylist: (playlist: PlaylistType) => void;
  setLibraries: (libraries: FileEntry[]) => void;
  setLibrary: (library: LibraryEntryType) => void;
  setMedia: (media: MediaType) => void;
  setTheme: (theme: ThemeEntryType) => void;
  setMediaFiles: (files: FileEntry[]) => void;
  setThemes: (themes: ThemeEntryType[]) => void;
  setShow: (show: PlaylistType) => void;
  setProjector: (projector: {
    webview: WebviewWindow;
    height: number;
    width: number;
  }) => void;
  setPrompt: (prompt: WebviewWindow) => void;
  setMode: (mode: PresenterMode) => void;
}

const useStore = create<AppState & Action>((set) => ({
  playlists: [],
  libraries: [],
  mediaFiles: [],
  themes: [],
  playlist: null,
  library: null,
  media: null,
  theme: null,
  show: null,
  projector: null,
  prompt: null,
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
  setTheme: (theme) => set(() => ({ theme })),
  setMediaFiles: (mediaFiles) => set(() => ({ mediaFiles })),
  setThemes: (themes) => set(() => ({ themes })),
  setShow: (show) => set(() => ({ show })),
  setProjector: (projector) => set(() => ({ projector })),
  setPrompt: (prompt) => set(() => ({ prompt })),
  setMode: (mode) => set(() => ({ mode })),
}));

export default useStore;
