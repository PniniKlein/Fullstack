import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Song } from '../model/Song';

const emptySong: Song = {
    id: 0,
    title: '',
    userId: 0,
    pathSong: '',
    gener: '',
    comments: [],
    create_at: '',
    isPublic: false
};

const songSlice = createSlice({
  name: 'songPlayer',
  initialState: { song: emptySong , restartSong :false },
  reducers: {
    loadSong:(state, action: PayloadAction<Song>) =>{
      state.song = action.payload;
    },
    updateSong: (state, action: PayloadAction<Song>) => {
      state.song = action.payload;
      state.restartSong  = true
    },
    deleteSong: (state) => {
      state.song = emptySong;
    },
    resetSong: (state) => {
      state.song = emptySong;
    },
    resetRestartSong: (state) => {
      state.restartSong = false;
    }
  },
});

export const {loadSong, resetRestartSong,updateSong, deleteSong, resetSong } = songSlice.actions;
export default songSlice;