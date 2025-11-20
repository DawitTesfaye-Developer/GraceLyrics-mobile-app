export enum ViewState {
  HOME = 'HOME',
  CATEGORY_LIST = 'CATEGORY_LIST',
  SONG_LIST = 'SONG_LIST',
  LYRICS = 'LYRICS',
  FAVORITES = 'FAVORITES',
  SETTINGS = 'SETTINGS'
}

export enum CategoryType {
  WORSHIP = 'Worship Songs',
  PRAISE = 'Praise Songs',
  YOUTH = 'Youth Songs',
  NEW_SOUL = 'New Soul Songs',
  CHOIR = 'Choir Songs'
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  category: CategoryType;
  lyrics: string;
  preview: string;
  isFavorite?: boolean;
}

export interface AppSettings {
  fontSize: number; // 14 to 32
  darkMode: boolean;
  autoScrollSpeed: number; // 0 to 5
}