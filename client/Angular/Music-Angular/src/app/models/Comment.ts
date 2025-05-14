import { User } from "./User";


export class Comment {
    constructor(
        public id:number,
        public content: string,
        public create_at: Date,
        public songId:number,
        public userId:number,
        public star:number,
        public user: User,
    ) { }
}