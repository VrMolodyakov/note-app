
import { useMemo, useState } from "react";
import { Form, Stack, Row, Col, Button, Card, Badge } from "react-bootstrap"
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import { Note } from "../../../components/note/note";
import { Tag } from "../../../components/note/tag";
import { style } from "../../../components/note/tag-style";
import "./note-list.css"
import styles from "./card.module.css"
import { EditTagsModal } from "../../tag/tag-modal";

type NoteListProps = {
    availableTags: Tag[]
    notes: Note[]
    onDeleteTag: (id: string) => void
    onEditTag: (id: string, label: string) => void
    completeEdit: (id: string, label: string) => void
}

type SimplifiedNote = {
    tags: Tag[]
    title: string
    id: string
}

export function NoteList({ 
    availableTags, 
    notes,
    onEditTag,
    completeEdit,
    onDeleteTag, }: NoteListProps) {

    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    const [title, setTitle] = useState("")
    const [modalIsOpen, setModalIsOpen] = useState(false)

    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            return (
                (title === "" ||
                    note.title.toLowerCase().includes(title.toLowerCase())) &&
                (selectedTags.length === 0 ||
                    selectedTags.every(tag =>
                        note.tags.some(noteTag => noteTag.id === tag.id)
                ))
            )
        })
    }, [title, selectedTags, notes])

    return (
        <>
            <Row className="align-items-center mb-4 list-c">
                <Col><h1 className="note-tag">Notes</h1></Col>
                <Col xs="auto">
                    <Stack gap={2} direction="horizontal">
                        <Link to={"/new"}>
                            <button className="button">Create</button>
                        </Link>
                        <button 
                        className="button"
                        onClick={() => setModalIsOpen(true)}>Edit Tags</button >
                    </Stack>

                </Col>
            </Row>
            <Form className = "list-form">
                <Row className="mb-4 mt-2">
                    <Col>
                        <Form.Group controlId="title">
                            <Form.Label className="list-label">Title</Form.Label>
                            <Form.Control type="text" value={title} onChange={e => setTitle(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="tags">
                            <Form.Label className="list-label">Tags</Form.Label>
                            <ReactSelect
                                isMulti
                                styles={style}
                                value={selectedTags.map(tag => {
                                    return { label: tag.label, value: tag.id }
                                })}
                                onChange={tags => {
                                    setSelectedTags(tags.map(tag => {
                                        return { label: tag.label, id: tag.value }
                                    }))
                                }}
                                options={availableTags.map(tag => {
                                    return { label: tag.label, value: tag.id }
                                })}
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
                {filteredNotes.map(note => (
                    <Col key={note.id}>
                        <NoteCard id={note.id} title={note.title} tags={note.tags} />
                    </Col>
                ))}
            </Row>
            <EditTagsModal 
              onEditTag={onEditTag}
              onDeleteTag={onDeleteTag}
              completeEdit = {completeEdit}
              show={modalIsOpen}
              handleClose={() => setModalIsOpen(false)}
              availableTags={availableTags}
            />
        </>
    )
}

function NoteCard({ id, title, tags }: SimplifiedNote) {
    return <Card>
        <Card.Body as={Link} to={`/${id}`} className={`h-100 text-reset text-decoration-none ${styles.card}`}>
            <Stack gap={2} className="align-items-center justify-content-center h-100">
                <span className="fs-5">{title}</span>
                {tags.length > 0 && (
                    <Stack gap={1} direction="horizontal" className="justify-content-center flex-wrap">
                        {tags.map(tag => (
                            <Badge className="text-truncate" key={tag.id}> {tag.label}</Badge>
                        ))}
                    </Stack>
                )}
            </Stack>
        </Card.Body>
    </Card>
}

