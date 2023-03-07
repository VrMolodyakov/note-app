import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import { Note } from "../note"

type LayoutProps = {
    notes: Note[]
}

export function NoteLayout({ notes }: LayoutProps) {
    const {id} = useParams()
    const note = notes.find(n => n.id === id)
    if (note == null) return <Navigate to="/" replace/>
    return <Outlet context={note} />
}

export function useNote(){
    return useOutletContext<Note>()
}