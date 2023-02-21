import { Tag } from "./tag"

export type NoteData = {
    id:string
    title: string
    markdown: string
    tags: Tag[]
} 
