import axios from "axios";
import api from "../interceptor/axiosConfig";
import { SongPostModel } from "../model/PostModel/SongPostModel";
import { Song } from "../model/Song";

export const getSongsByUserId = async (userId: number) => {
    try {
        const res = await api.get('/Song/User/'+userId)
        return res.data;
     } catch (e) {
         console.log(e);
     }
}

export const getSongById = async (id: number) => {
    try {
        console.log(id)
        const res = await api.get('/Song/'+id+"/Full")
        return res.data;
     } catch (e) {
         console.log(e);
     }
}

export const getSongByCategory = async (category: string) => {
    try {
        const res = await api.get('/Song/Category/'+category)
        return res.data;
     } catch (e) {
         console.log(e);
     }
}

export const getAllPublic = async () => {
    try {
        const res = await api.get('/Song/Public')
        return res.data;
    } catch (e) {
         console.log(e);
    }
}

export const getCategory = async () => {
    try {
        const res = await api.get('/Song/Category')
        return res.data;
     } catch (e) {
         console.log(e);
     }
}

export const uploadToS3 = async (file: File): Promise<string | null> => {
    try {
      const res = await api.get("Song/upload-url", {
        params: { fileName: file.name, contentType: file.type },
      });

      const presignedUrl = res.data.url;
      await axios.put(presignedUrl, file, { headers: { "Content-Type": file.type } });

      return presignedUrl.split("?")[0];
    } catch (error) {
      console.error("שגיאה בהעלאת הקובץ:", error);
      return null;
    }
  };

export const addSong = async(song:SongPostModel) =>{
    try {
        const res = await api.post('/Song', song);
        return res.data;
    } catch (e) {
        console.log(e);
    }
}

export const updateSong = async(id:number,song:SongPostModel) =>{
    try {
        console.log(song);
        const res = await api.put('/Song/' + id, song);
        console.log(res.data);
        return res.data;
    } catch (e) {
        console.log(e);
    }
}

export const updateSongToPublic = async(id:number) =>{
    try {
        const res = await api.put('/Song/'+id+'/Public');
        return res.data;
    } catch (e) {
        console.log(e);
    }
}

export const addPlay = async(id:number) =>{
       try {
        const res = await api.put('/Song/'+id+'/Play');
        return res.data;
    } catch (e) {
        console.log(e);
    }
}

export const addLyrics = async(id:number,lyrics:string) =>{
       try {
        const res = await api.put('/Song/'+id+'/Lyrics', { lyrics });
        return res.data;
    } catch (e) {
        console.log(e);
    }
}

export const deleteSong = async(id:number) =>{
    try {
        const res = await api.delete('/Song/' + id);
        return res.data;
    } catch (e) {
        console.log(e);
    }
}

export const handleDownload = async (song:Song) => {
    if (song?.pathSong) {
      try {
        const response = await fetch(song.pathSong);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = song.title + ".mp3"; // או פורמט אחר
        document.body.appendChild(a);
        a.click();
        a.remove();
      } catch (error) {
        console.error("שגיאה בהורדת השיר:", error);
      }
    }
  };