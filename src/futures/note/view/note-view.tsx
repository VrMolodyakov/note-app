import { Badge, Button, Col, Row, Stack } from "react-bootstrap";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Link, useNavigate } from "react-router-dom";
import { useNote } from "../../../components/note/layout/note-layout";

type NoteProps = {
    onDelete: (id:string) => void
}

export function NoteView({onDelete}:NoteProps){
    const note = useNote()
    const navigate = useNavigate()
    const onClick = (id:string) =>{
        onDelete(id)
        navigate("/")
    }

    return <>
        <Row className="align-items-center mb-4">
            <Col>
                <h1>{note.title}</h1>
                {note.tags.length > 0 && (
                   <Stack gap={1} direction="horizontal" className="flex-wrap">
                    {note.tags.map(tag => (
                        <Badge className="text-truncate" key={tag.id}> {tag.label}</Badge>
                    ))}
                    </Stack>
                )}
            </Col>
            <Col xs="auto">
                    <Stack gap={2} direction="horizontal">
                        <Link to={`/${note.id}/edit`}>
                            <Button variant="primary" className="mt-2">Edit</Button>
                        </Link>
                        <Button variant="outline-danger" onClick={() => onClick(note.id)} className="mt-2">Delete</Button>
                        <Link to="/">
                             <Button variant="outline-secondary" className="mt-2">Back</Button>
                        </Link>
                    </Stack>
                </Col>
        </Row>
        <ReactMarkdown>{note.markdown}</ReactMarkdown>
    </>
}