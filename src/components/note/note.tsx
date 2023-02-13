export type NoteData = {
    title: string
    markdown: string
    tags: Tag[]
} 

export type Note = {
    id: string  
} & NoteData

export type Tag = {
    id: string 
    label: string
}