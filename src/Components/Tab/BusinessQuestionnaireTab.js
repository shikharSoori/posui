import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import CreateBusinessAnnexure from "../../Pages/Annexure/Pages/CreateBusinessAnnexure.js";
import Questions from "../../Pages/Annexure/Pages/index.js";
import { clearEditAnnexure, editAnnex } from "../../Pages/Annexure/Redux/annexSlice.js";
import { getAllAnnex, getAnnex } from "../../Pages/Annexure/Redux/thunk.js";
import { setShowModal } from "../../Redux/Layout/layoutSlice.js";
import { PERMISSIONS } from "../../Utils/permission.js";
import Modal from "../Modal/Modal.js";
import "./pageTabs.css";

const ANNEX_TYPE = "business";

const BusinessQuestionnaireTab = () => {
  const dispatch = useDispatch();
  const annexures = useSelector((state) => state.annex.annexures);
  const edit = useSelector((state) => state.annex.edit);

  const [annexureId, setAnnexureId] = useState("");
  const [showAnnexModal, setShowAnnexModal] = useState(false);

  const { permissions, isSuperuser } = useSelector((state) => state.auth);
  const addAnnexPermission = isSuperuser || permissions.includes(PERMISSIONS.annex.createAnnex);

  useEffect(() => {
    dispatch(getAllAnnex(ANNEX_TYPE));
  }, [dispatch]);

  useEffect(() => {
    if (annexures?.length > 0) {
      setAnnexureId(annexures[0]?.id);
    }
  }, [annexures]);

  const createAnnexure = () => setShowAnnexModal(true);

  const updateAnnexure = async (id) => {
    const data = await dispatch(getAnnex(id));
    dispatch(editAnnex());
    setShowAnnexModal(true);
  };

  const TabPanel = ({ children, value, index, tab, ...other }) => (
    <div className={`tab-pane w-100 ${value === index ? "show active flex-grow-1" : ""}`} id={tab} role="tabpanel" aria-labelledby={`${tab}-tab`} {...other}>
      {value === index && children}
    </div>
  );

  const renderTabs = () => (
    <ul className="nav nav-tabs" id="annexureTab" role="tablist">
      {annexures.map(({ id, name }, index) => (
        <li key={index} className="nav-item" role="presentation">
          <button
            className={`nav-link ${annexureId === id ? "active" : ""}`}
            id={`${name}-tab`}
            onClick={() => setAnnexureId(id)}
            data-toggle="tab"
            data-target={`#${name}`}
            type="button"
            role="tab"
            aria-controls={name}
            aria-selected={annexureId === id}
          >
            {name}
            <FiEdit className="edit-icon ml-4" style={{ opacity: 0.5 }} onClick={() => updateAnnexure(id)} />
          </button>
        </li>
      ))}
      <button className="btn" onClick={createAnnexure} disabled={!addAnnexPermission}>
        +
      </button>
    </ul>
  );

  const renderTabContent = () => (
    <div className="tab-content d-flex flex-grow-1" id="annexureTabContent" style={{ overflow: "hidden" }}>
      {annexures?.map(({ id, name }, index) => (
        <TabPanel key={index} value={annexureId} index={id} tab={name}>
          <Questions id={id} type="business" />
        </TabPanel>
      ))}
    </div>
  );

  return (
    <>
      <div className="header-section-tab-wrapper h-100 d-flex flex-column" style={{ overflow: "hidden" }}>
        <div className="row d-flex justify-content-between">
          <div>{renderTabs()}</div>
        </div>
        {renderTabContent()}
      </div>

      {addAnnexPermission && showAnnexModal && (
        <Modal
          size="modal-sm"
          showModal={showAnnexModal}
          setShowModal={setShowAnnexModal}
          header={edit ? "Edit Annexure" : "Create Annexure"}
          clearAction={clearEditAnnexure}
          dispatch={setShowModal}
        >
          <CreateBusinessAnnexure setShowModal={setShowAnnexModal} />
        </Modal>
      )}
    </>
  );
};

export default BusinessQuestionnaireTab;
