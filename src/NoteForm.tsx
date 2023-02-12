import {Form,Stack,Row,Col} from "react-bootstrap"
import { Link } from "react-router-dom";
import CreatableReactSelect from "react-select/creatable"
import "./NoteForm.css"

// background-color: rgba(87, 90, 224, 0.781); 
//   border-color: rgb(163, 168, 241);   

export function NoteFrom(){
    const style = {
        control: (base: any) => ({
            ...base,
            boxShadow: "none", 
            borderColor: "#cccccc",
            "&:hover": {
                borderColor: "#cccccc"
            }
        })
      };
    
    return (
        <Form>
            <Stack gap = {2}>
               <Row>
                    <Col>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control required/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="tags">
                            <Form.Label>Tags</Form.Label>
                            <CreatableReactSelect isMulti styles={style}/>
                        </Form.Group>
                    </Col>
               </Row>
               <Form.Group controlId="markdown">
                            <Form.Label>Body</Form.Label>
                            <Form.Control required as="textarea" rows={15}/>
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