export type User ={
    id:number,
    userName:string,
    email:string,
    password: string,
    pathProfile?: string,
    create_at:string,
    songs: [],
    followees:number[],
    followers?:number[],
} 