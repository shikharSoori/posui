import React, { useState, lazy, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { coreSetupPermission, loanSetupPersmission } from "../../Utils/tabPermissions";
import { setCoreSetupTabValue } from "../../Redux/TabsValue/tabsValueSlice";
import "./pageTabs.css";
import Facilities from "../../Pages/Facilities/Pages";
import CollateralType from "../../Pages/CollateralType/Pages";
import InspectionDuration from "../../Pages/InspectionDuration";

const BusinessNature = lazy(() => import("../../Pages/BusinessNature/Pages"));

const LoanSetupTabs = () => {
  let haveAnyPermission = [];
  const dispatch = useDispatch();
  const permissions = useSelector((state) => state.auth.permissions);
  const isSuperuser = useSelector((state) => state.auth.isSuperuser);
  const coreSetupTabValue = useSelector((state) => state.tabsValue.coreSetupTabValue);
  function TabPanel(props) {
    const { children, value, index, tab, ...other } = props;
    return (
      <div className="tab-pane show active" id={tab} role="tabpanel" aria-labelledby={`${tab}-tab`} {...other}>
        {value === index && <>{children}</>}
      </div>
    );
  }

  const returnChildren = (ordering) => {
    if (ordering === 0) {
      return <Facilities />;
    } else if (ordering === 1) {
      return <BusinessNature />;
    } else if (ordering === 2) {
      return <CollateralType />;
    } else if (ordering === 3) {
      return <InspectionDuration />;
    }
  };

  return (
    <div className="header-section-tab-wrapper">
      <div className="row d-flex justify-content-between">
        <div>
          <ul className="nav nav-tabs" id="saleTab" role="tablist">
            {loanSetupPersmission?.map((side, i) => {
              const { permissionList, tabName, keyWord, ordering } = side;
              haveAnyPermission.push(permissions?.some((element) => permissionList?.indexOf(element) !== -1));
              const showMenu = permissions?.some((element) => permissionList?.indexOf(element) !== -1);
              if (isSuperuser || showMenu) {
                return (
                  <React.Fragment key={i + 1}>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${coreSetupTabValue === ordering ? "active" : ""}`}
                        id={`${keyWord}-tab`}
                        onClick={(e) => {
                          dispatch(setCoreSetupTabValue(ordering));
                        }}
                        data-toggle="tab"
                        data-target={`#${keyWord}`}
                        type="button"
                        role="tab"
                        aria-controls={`${keyWord}`}
                        aria-selected="true"
                      >
                        {tabName}
                      </button>
                    </li>
                  </React.Fragment>
                );
              }
            })}
          </ul>
        </div>
      </div>
      <div className="tab-content" id="saleTabContent">
        {loanSetupPersmission?.map((side, i) => {
          const { permissionList, keyWord, ordering } = side;

          const showMenu = permissions?.some((element) => permissionList?.indexOf(element) !== -1);
          if (isSuperuser || showMenu) {
            return (
              <React.Fragment key={i + 1}>
                <TabPanel value={coreSetupTabValue} index={ordering} tab={keyWord}>
                  {returnChildren(ordering)}
                </TabPanel>
              </React.Fragment>
            );
          }
        })}
      </div>
    </div>
  );
};

export default LoanSetupTabs;
