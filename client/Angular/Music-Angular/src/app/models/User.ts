export class User {
    constructor(
        public id: number,
        public userName: string,
        public email: string,
        public password: string,
        public create_at: string,
        public songs: [],
        public followers: User[],
        public pathProfile?: string,
    ) { }
}