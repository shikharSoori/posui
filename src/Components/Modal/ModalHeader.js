import React, { useEffect } from "react";
import "./Modal.css";

import { FaTimes } from "react-icons/fa";
import { clearEditAnnexure } from "../../Pages/Annexure/Redux/annexSlice";

const ModalHeader = ({ header, dispatch, showModal, setShowModal, types, edit, clearAction, draftAction, handlePrint, details, ...props }) => {
  const clearActionTypes = ["userGroup", "question", "lead"];
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    // Attach the event listener when the component mounts
    window.addEventListener("keydown", handleKeyDown);

    // Detach the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleClose = () => {
    if (types === "question") {
      dispatch(clearEditAnnexure());
      setShowModal(false);
      return;
    }
    if (clearAction) {
      dispatch(clearAction());
      dispatch(setShowModal(false));
      setShowModal(false);
    } else if (types === "cif") {
      setShowModal(false);
    } else {
      dispatch(setShowModal(false));
      setShowModal(false);
    }
  };
  return (
    <>
      <div className="modal-header">
        <h5 className="modal-title" id="myExtraLargeModalLabel">
          {header}
        </h5>
        {/* <button onClick={handleClose} type="button" className="btn-close d-flex justify-content-center align-items-center" style={{ color: "#D93F21" }}>
          <FaTimes />
        </button> */}
      </div>
    </>
  );
};

export default ModalHeader;
