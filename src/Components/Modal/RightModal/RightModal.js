import React from "react";
import "./RightModal.css";

const RightModal = ({ showModal, setShowModal, children }) => {
  return (
    <div
      className={`modal left fade ${showModal ? "show" : ""}`}
      id="exampleModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden={!showModal}
      style={{ display: showModal ? "block" : "none" }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightModal;
