import React from "react";
import { Modal, Button } from "react-bootstrap";

function CustomModal({
  modalTitle,
  modalMessage,
  closeButtonLabel,
  saveChangesButtonLabel,
  onCloseButtonClick,
  onSaveChangesButtonClick,
  show,
}) {
  return (
    <>
      <Modal show={show} onHide={onCloseButtonClick}>
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#850a6d", borderColor: "#850a6d" }}
        >
          <Modal.Title style={{ color: "white" }}>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: "#0c1243",
            color: "white",
            borderColor: "#0c1243",
          }}
        >
          {modalMessage}
        </Modal.Body>
        <Modal.Footer
          style={{ justifyContent: "center", backgroundColor: "#fff5e5" }}
        >
          <Button
            style={{ backgroundColor: "#0c1243" }}
            onClick={onCloseButtonClick}
          >
            {closeButtonLabel}
          </Button>{" "}
          <Button
            style={{ backgroundColor: "#850a6d" }}
            onClick={onSaveChangesButtonClick}
          >
            {saveChangesButtonLabel}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CustomModal;
