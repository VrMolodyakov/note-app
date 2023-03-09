import { Modal, Stack, Row, Col, Button,Form } from "react-bootstrap"

import { Tag } from "../../components/note/tag"

type EditTagsModalProps = {
    show: boolean
    availableTags: Tag[]
    handleClose: () => void
    onDeleteTag: (id: string) => void
    onEditTag: (id: string, label: string) => void
    completeEdit: (id: string, label: string) => void
  }

export function EditTagsModal({
    availableTags,
    handleClose,
    show,
    onDeleteTag,
    completeEdit,
    onEditTag,
  }: EditTagsModalProps) {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Tags</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Stack gap={2}>
              {availableTags.map(tag => (
                <Row key={tag.id}>
                  <Col>
                    <Form.Control
                      type="text"
                      value={tag.label}
                      onBlur={e => completeEdit(tag.id, e.target.value)}
                      onChange={(e)=> onEditTag(tag.id, e.target.value)}
                    />
                  </Col>
                  <Col xs="auto">
                    <Button
                      onClick={() => onDeleteTag(tag.id)}
                      variant="outline-danger"
                    >
                      &times;
                    </Button>
                  </Col>
                </Row>
              ))}
            </Stack>
          </Form>
        </Modal.Body>
      </Modal>
    )
  }