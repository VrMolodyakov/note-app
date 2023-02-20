import { NoteData } from "../../components/note/note";
import { NoteFrom } from "./form/note-form";


type NewNoteProps = {
    onSubmit:(data:NoteData) => void
}

export function NewNote({onSubmit}:NewNoteProps) {
    return (
        <>
            <h1 className="mb-4">New note</h1>
            <NoteFrom onSubmit={onSubmit}/>
        </>
    )
}