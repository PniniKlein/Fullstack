export type Song ={
    id:number,
    title:string,
    create_at:string,
    gener?: string,
    lyrics:string,
    isPublic: boolean,
    pathSong:string,
    pathPicture:string,
    userId: number,
    play:number,
    comments?:[],
} 