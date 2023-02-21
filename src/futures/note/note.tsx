
import { NoteData } from "../../components/note/note-data";
import { Tag } from "../../components/note/tag";
import { NoteFrom } from "./form/note-form";
import "./note.css"

type NewNoteProps = {
    onSubmit:(data:NoteData) => void
    onAddTag:(tag:Tag) => void
    availableTags:Tag[]
}

export function NewNote({onSubmit,onAddTag,availableTags}:NewNoteProps) {
    return (
        <>
            <h1 className="mb-4 mt-2">New note</h1>
            <NoteFrom onSubmit={onSubmit} onAddTag={onAddTag} availableTags={availableTags}/>
        </>
    )
}