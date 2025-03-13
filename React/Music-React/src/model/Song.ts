export type Song ={
    id:number,
    title:string,
    create_at:string,
    gener?: string,
    isPublic: boolean,
    pathSong:string,
    userId: number,
    comments?:Comment[],
} 