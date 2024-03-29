import { FormEvent, useRef, useState } from "react";
import {Form,Stack,Row,Col} from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom";
import CreatableReactSelect from "react-select/creatable"
import "./note-form.css"
import {v4 as uuidV4} from "uuid"
import { style } from "../../../components/note/tag-style";
import { NoteData } from "../../../components/note/note-data";
import { Tag } from "../../../components/note/tag";


type NoteFormProps = {
    onSubmit: (data:NoteData) => void
    onAddTag:(tag:Tag) => void
    availableTags:Tag[]
} & Partial<NoteData>

export function NoteFrom({
    onSubmit,
    onAddTag,
    availableTags,
    title = "",
    markdown = "",
    tags = []
    }:NoteFormProps){

    const titleRef = useRef<HTMLInputElement>(null)
    const markdownRef = useRef<HTMLTextAreaElement>(null)
    const [selectedTags,setSelectedTags] = useState<Tag[]>(tags)
    const navigate = useNavigate()
 
    function handleSubmit(e:FormEvent)  {
        e.preventDefault()
        onSubmit({
            title:titleRef.current!.value,
            markdown:markdownRef.current!.value,
            tags:selectedTags
        })

        navigate("/")
    }

    return (
        <Form onSubmit={handleSubmit} className = "note-form">
            <Stack gap = {2}>
               <Row>
                    <Col>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control className="input-ttl" ref={titleRef} required defaultValue={title}/>
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
                            onCreateOption ={label =>{
                                const newTag = {id:uuidV4(),label}
                                onAddTag(newTag)
                                setSelectedTags(prev => [...prev,newTag])
                            }}
                            onChange = {tags =>{
                                setSelectedTags(tags.map(tag => {
                                    return {label:tag.label,id:tag.value}
                                }))
                            }}
                            options={availableTags.map(tag =>{
                                return {label:tag.label,value:tag.id}
                            })}                            
                            />
                        </Form.Group>
                    </Col>
               </Row>
               <Form.Group controlId="markdown">
                    <Form.Label>Body</Form.Label>
                    <Form.Control 
                    required as="textarea" 
                    rows={15} 
                    ref = {markdownRef} 
                    defaultValue={markdown}/>
                </Form.Group>
                <Stack direction="horizontal" gap={2} className = "justify-content-end">
                    <button className="button" id="save">Save</button>
                    <Link to="/">
                        <button className="button" id="cancel">Cancel</button>
                    </Link>
                </Stack>
            </Stack>
        </Form>
    )
}