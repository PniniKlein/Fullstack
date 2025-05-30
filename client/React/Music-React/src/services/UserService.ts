import api from "../interceptor/axiosConfig";

export const artistList = async () => {
    try {
        const res = await api.get('/User/PublicSong');
        console.log(res.data);
        return res.data;
    } catch (e) {
        console.log(e);
    }
}

export const getArtistById = async (id:number) => {
    try {
        const res = await api.get(`/User/${id}`);
        return res.data;
    } catch (e) {
        console.log(e);
    }
}

export const getArtistByIdFull = async (id:number) => {
    try {
        const res = await api.get(`/User/${id}/FullPublic`);
        console.log(res.data);
        return res.data;
    } catch (e) {
        console.log(e);
    }
}

export const addFollowee = async (followerId:number,followeeId:number) => {
    try {
        const payload = {followerId,followeeId};
        console.log(payload)
        const res = await api.post(`/UserFollower`, payload);
        return res.data;
    } catch (e) {
        console.log(e);
    }
}

export const removeFollowee = async (id:number) => {
    try {
        const res = await api.delete(`/UserFollower/${id}`);
        return res.data;
    } catch (e) {
        console.log(e);
    }
}