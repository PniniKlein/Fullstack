import { Comment } from "./Comment";
export class Song {
    constructor(
        public id:number,
        public title:string,
        public create_at:string,
        public isPublic: boolean,
        public pathSong:string,
        public pathPicture:string,
        public plays:number,
        public stars:number,
        public userId: number,
        public comments?:Comment[],
        public gener?: string,
    ) { }
}