import { User } from "./User";

export type Comment ={
    id:number,
    content: string,
    star:number,
    create_at: Date,
    songId:number,
    userId:number,
    user?: User,
} 