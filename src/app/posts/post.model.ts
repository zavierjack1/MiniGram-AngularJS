export interface Post{
    id: string;
    title: string;
    content: string;
    imagePath: string;
    createdBy: string; //created by mongo ID
    createdByEmail: string;
}