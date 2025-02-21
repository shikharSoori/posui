import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import CreateCollateralAnnexure from "../../Pages/Annexure/Pages/CreateCollateralAnnexure.js";
import Questions from "../../Pages/Annexure/Pages/index.js";
import { clearEditAnnexure, editAnnex } from "../../Pages/Annexure/Redux/annexSlice.js";
import { getAllAnnex, getAnnex } from "../../Pages/Annexure/Redux/thunk.js";
import { setShowModal } from "../../Redux/Layout/layoutSlice.js";
import Modal from "../Modal/Modal.js";
import "./pageTabs.css";

const annexType = "collateral";
const CollateralQuestionnaireTab = () => {
  const dispatch = useDispatch();
  const isSuperuser = useSelector((state) => state.auth.isSuperuser);
  const annexures = useSelector((state) => state.annex.annexures);

  const [annexureId, setAnnexureId] = useState("");
  const edit = useSelector((state) => state.annex.edit);
  const [showAnnexModal, setShowAnnexModal] = useState(null);

  useEffect(() => {
    dispatch(getAllAnnex(annexType));
  }, [dispatch]);

  const createAnnexure = () => {
    setShowAnnexModal(true);
  };

  const updateAnnexure = (id) => {
    dispatch(editAnnex());
    dispatch(getAnnex(id));
    setShowAnnexModal(true);
  };

  function TabPanel(props) {
    const { children, value, index, tab, ...other } = props;
    return (
      <div
        className={`tab-pane w-100 ${value === index ? "show active flex-grow-1" : ""}`}
        id={tab}
        role="tabpanel"
        aria-labelledby={`${tab}-tab`}
        {...other}
      >
        {value === index && <>{children}</>}
      </div>
    );
  }

  useEffect(() => {
    if (annexures?.length > 0) {
      setAnnexureId(annexures[0]?.id);
    }
  }, [annexures]);

  return (
    <>
      <div className="header-section-tab-wrapper h-100 d-flex flex-column" style={{ overflow: "hidden" }}>
        <div className="row d-flex justify-content-between">
          <div>
            <ul className="nav nav-tabs" id="annexureTab" role="tablist">
              {annexures.length > 0 &&
                annexures?.map((annex, i) => {
                  const { id, name } = annex;

                  return (
                    <React.Fragment key={i + 1}>
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${annexureId === id ? "active" : ""}`}
                          id={`${name}-tab`}
                          onClick={(e) => {
                            setAnnexureId(id);
                          }}
                          data-toggle="tab"
                          data-target={`#${name}`}
                          type="button"
                          role="tab"
                          aria-controls={`${name}`}
                          aria-selected="true"
                        >
                          {name}
                          <FiEdit
                            className="edit-icon ml-4"
                            style={{ opacity: 0.5 }}
                            onClick={() => updateAnnexure(id)}
                          />
                        </button>
                      </li>
                    </React.Fragment>
                  );
                })}

              <button className="btn" onClick={createAnnexure}>
                +
              </button>
            </ul>
          </div>
        </div>
        <div className="tab-content d-flex flex-grow-1" id="annexureTabContent" style={{ overflow: "hidden" }}>
          {annexures?.map((annex, i) => {
            const { id, name } = annex;

            return (
              <React.Fragment key={i + 1}>
                <TabPanel value={annexureId} index={id} tab={name}>
                  <Questions id={id} type="collateral" />
                </TabPanel>
              </React.Fragment>
            );
          })}
        </div>
        {/* <NoPermissionsFound haveAnyPermission={haveAnyPermission} isSuperuser={isSuperuser} /> */}
      </div>

      {showAnnexModal && (
        <Modal
          size={"modal-sm"}
          showModal={showAnnexModal}
          setShowModal={setShowAnnexModal}
          header={edit ? "Edit Annexure" : "Create Annexure"}
          clearAction={clearEditAnnexure}
          dispatch={setShowModal}
        >
          <CreateCollateralAnnexure setShowModal={setShowAnnexModal} />
        </Modal>
      )}
    </>
  );
};

export default CollateralQuestionnaireTab;
