import { User } from "./User";

export type Comment ={
    id:number,
    songId:number,
    userId:number,
    user: User,
    content: string,
    star:number,
    create_at: Date,
} 