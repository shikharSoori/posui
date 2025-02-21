import React from "react";
import { MdOutlineAdd } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { clearEditBusinessNature } from "../../Pages/BusinessNature/Redux/businessNatureSlice";
import { clearEditCollateralType } from "../../Pages/CollateralType/Redux/collateralTypeSlice";
import { clearAllCountry } from "../../Pages/Country/Redux/countrySlice";
import { clearAllCurrency } from "../../Pages/Currency/Redux/currencySlice";
import { clearAllDepartment } from "../../Pages/Department/Redux/departmentSlice";
import { clearEditFacility } from "../../Pages/Facilities/Redux/facilitiesSlice";
import { clearEditLoans, loanClearData } from "../../Pages/Loan/Redux/loanSlice";
import { clearEditUser } from "../../Pages/User/Redux/userSlice";
import { clearEditUserGroup } from "../../Pages/UserGroup/Redux/userGroupSlice";
import { excludeCreateBtn, hideButton } from "../../Utils/constants";

const CommonCreateButton = ({ types, showModal, setShowModal, title, permission }) => {
  const organizations = useSelector((state) => state.organization.organizations);
  const organizationHierarchies = useSelector((state) => state.hierarchy.organizationHierarchies);
  const dispatch = useDispatch();

  return (
    <div>
      {hideButton.includes(types) && (organizations?.length > 0 || organizationHierarchies?.length > 0) ? null : (
        <div className="d-flex justify-content-end" style={{ minWidth: "200px" }} title={title}>
          {!excludeCreateBtn.includes(types) && permission && (
            <button
              className={showModal ? "create-btn d-none" : "create-btn"}
              onClick={() => {
                setShowModal(true);
                if (types === "user") {
                  dispatch(clearEditUser());
                }
                if (types === "userGroup") {
                  dispatch(clearEditUserGroup());
                }
                if (types === "department") {
                  dispatch(clearAllDepartment());
                }
                if (types === "country") {
                  dispatch(clearAllCountry());
                }
                if (types === "currency") {
                  dispatch(clearAllCurrency());
                }
                if (types === "business-nature") {
                  dispatch(clearEditBusinessNature());
                }
                if (types === "loan") {
                  dispatch(clearEditLoans());
                  dispatch(loanClearData());
                }
                if (types === "collateral-type") {
                  dispatch(clearEditCollateralType());
                }
                if (types === "facility-type") {
                  dispatch(clearEditFacility());
                } else {
                }
              }}
              type="button"
            >
              <MdOutlineAdd size={36} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CommonCreateButton;
