import { FormEvent, useRef, useState } from "react";
import {Form,Stack,Row,Col} from "react-bootstrap"
import { Link } from "react-router-dom";
import CreatableReactSelect from "react-select/creatable"
import { NoteData, Tag } from "../../components/note/note";
import "./NoteForm.css"
import { style } from "./tag-style";


type NoteFormProps = {
    onSubmit: (data:NoteData) => void
}

export function NoteFrom({onSubmit}:NoteFormProps){
    const titleRef = useRef<HTMLInputElement>(null)
    const markdownRef = useRef<HTMLTextAreaElement>(null)
    const [selectedTags,setSelectedTags] = useState<Tag[]>([])
 
    function handleSubmit(e:FormEvent)  {
        e.preventDefault()
        onSubmit({
            title:titleRef.current!.value,
            markdown:markdownRef.current!.value,
            tags:[]
        })
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Stack gap = {2}>
               <Row>
                    <Col>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control ref={titleRef} required/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="tags">
                            <Form.Label>Tags</Form.Label>
                            <CreatableReactSelect 
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
                            />
                        </Form.Group>
                    </Col>
               </Row>
               <Form.Group controlId="markdown">
                            <Form.Label>Body</Form.Label>
                            <Form.Control required as="textarea" rows={15} ref = {markdownRef}/>
                </Form.Group>
                <Stack direction="horizontal" gap={2} className = "justify-content-end">
                    <button className="btn-save">Save</button>
                    <Link to="/">
                        <button className="btn-save">Cancel</button>
                    </Link>
                </Stack>
            </Stack>
        </Form>
    )
}