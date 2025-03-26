import api from "../interceptor/axiosConfig";

export const artistList = async () => {
    try {
        const res = await api.get('/User/PublicSong');
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
        return res.data;
    } catch (e) {
        console.log(e);
    }
}