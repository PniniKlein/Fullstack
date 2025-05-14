import api from "../interceptor/axiosConfig";
import { CommentPostModel } from "../model/PostModel/CommentPostModel";

export const getCommentsBySongId = async (songId: number) => {
    try {
       const res = await api.get('/Comment/Song/'+songId,
       )
       console.log(res.data)
       return res.data;
    } catch (e) {
        console.log(e);
    }
}

export const addComment = async (comment: CommentPostModel) => {
    try {
        const res = await api.post('/Comment', comment);
        return res.data;
    } catch (e) {
        console.log(e);
    }
}

export const updateComment = async (id:number,comment: CommentPostModel) => {
    try {
        const res = await api.put('/Comment/' + id, comment);
        return res.data;
    } catch (e) {
        console.log(e);
    }
}

export const deleteComment = async (id: number) => {
    try {
        const res = await api.delete('/Comment/' + id);
        return res.data;
    } catch (e) {
        console.log(e);
    }
}