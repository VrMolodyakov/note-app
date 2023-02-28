
import { useState } from "react";
import {Form,Stack,Row,Col, Button} from "react-bootstrap"
import {Link } from "react-router-dom";
import ReactSelect from "react-select";
import { Tag } from "../../../components/note/tag";
import { style } from "../../../components/note/tag-style";
import "./note-list.css"

type NoteListProps = {
    availableTags:Tag[]
}

export function NoteList({availableTags} : NoteListProps){
    const [selectedTags,setSelectedTags] = useState<Tag[]>([])
    return (
        <>
            <Row>
                <Col><h1 className="note-tag">Notes</h1></Col>
                <Col xs = "auto">
                    <Stack gap={2} direction="horizontal">
                        <Link to={"/new"}>
                            <Button variant="primary" className="mt-2">Create</Button>
                        </Link>
                        <Button variant="outline-secondary" className="mt-2">Edit Tags</Button>
                    </Stack>

                </Col>
            </Row>
            <Form>
                <Row className="mb-4 mt-2">
                    <Col>
                        <Form.Group controlId="title">
                            <Form.Label className="list-label">Title</Form.Label>
                            <Form.Control type="text"/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="tags">
                            <Form.Label className="list-label">Tags</Form.Label>
                            <ReactSelect 
                            isMulti 
                            styles={style}
                            value = {selectedTags.map(tag => {
                                return {label:tag.label, value: tag.id}
                            })}
                            onChange = {tags =>{
                                setSelectedTags(tags.map(tag => {
                                    return {label:tag.label,id:tag.value}
                                }))
                            }}
                            options={availableTags.map(tag =>{
                                return {label:tag.label,value:tag.id}
                            })}
                            theme={theme => ({
                                ...theme,
                                borderRadius: 0,
                                backgroundColor:"blue",
                                color: "#c6a3390",
                                colors: {
                                  ...theme.colors,
                                  primary: "#b90000",
                                  primary25: "#c9cad0",
                                  primary50: "#c9cad0"
                                }
                              })}
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
        </>
    )
}