import { useNote } from "../../../components/note/layout/note-layout"
import { NoteData } from "../../../components/note/note-data"
import { Tag } from "../../../components/note/tag"
import { NoteFrom } from "../form/note-form"

type EditNoteProps = {
    onSubmit:(id:string,data:NoteData) => void
    onAddTag:(tag:Tag) => void
    availableTags:Tag[]
}

export function EditNote({onSubmit,onAddTag,availableTags}:EditNoteProps) {
    const note = useNote()
    return (
        <>
            <h1 className="mb-4 mt-2">Edit note</h1>
            <NoteFrom 
            title = {note.title}
            markdown = {note.markdown}
            tags = {note.tags}
            onSubmit={data => onSubmit(note.id,data)} 
            onAddTag={onAddTag} 
            availableTags={availableTags}/>
        </>
    )
}