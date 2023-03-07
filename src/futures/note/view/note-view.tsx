import { Badge, Button, Col, Row, Stack } from "react-bootstrap";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Link } from "react-router-dom";
import { useNote } from "../../../components/note/layout/note-layout";

export function NoteView(){
    const note = useNote()

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
                        <Button variant="outline-danger" className="mt-2">Delete</Button>
                        <Link to="/">
                             <Button variant="outline-secondary" className="mt-2">Back</Button>
                        </Link>
                    </Stack>
                </Col>
        </Row>
        <ReactMarkdown>{note.markdown}</ReactMarkdown>
    </>
}