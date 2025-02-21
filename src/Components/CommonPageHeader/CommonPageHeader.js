import React, { lazy, useCallback, useEffect, useRef, useState } from "react";
import "./CommonPageHeader.css";
import "../CommonDatePicker/DatePicker.css";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { IoFilter } from "react-icons/io5";
import autoAnimate from "@formkit/auto-animate";
import {
  inspectionStatusList,
  inspectionTypeList,
  loanTypeList,
  questionTypeList,
  statusList,
} from "../../Utils/constants";
// const Select = lazy(() => import("react-select"));
import Select from "react-select";
import { MdNotificationsNone } from "react-icons/md";
import Notification from "./Notification";
import { getAllNotifications } from "./redux/thunk";
import getCookie from "../../Utils/Cookies/getCookie";
import AsyncSelect from "../CommonAsyncSelectField/AsyncSelect";
import { loadCollateralType, loadFacilityType } from "../../Pages/Leads/Pages/asyncFunction";
const AsyncPaginate = lazy(() =>
  import("react-select-async-paginate").then((module) => ({
    default: module.AsyncPaginate,
  }))
);

// cust
const DatePicker = lazy(() => import("react-datepicker"));

const CommonPageHeader = ({
  title,
  types,
  search,
  setSearch,
  status,
  setStatus,
  setLoanType,
  questionType,
  setQuestionType,
  loanType,
  collateralType,
  setCollateralType,
  loading,
  data,
  inspectionType,
  setInspectionType,
  setStartDate,
  setEndDate,
  startDate,
  endDate,
  count,
  facilityType,
  setFacilityType,
  cif,
  setCif,
}) => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state?.notification?.notifications);
  const unreadNotifications = notifications.filter((notification) => notification?.isRead === false);
  const unreadNotificationsCount = unreadNotifications.length;
  const [showParentAnimation] = useState(false);

  const [showFilter, setShowFilter] = useState(false);
  const [postsPerPage, setPostsPerPage] = useState(20);
  const parent = useRef(null);
  const notificationAnimate = useRef(null);
  const statusFilter = [];
  const inspectionStatusFilter = [""];
  const inspectionTypeFilter = ["loan"];
  const dateFilter = ["lead", "inspection", "dashboard"];
  const loanTypeFilter = ["lead", "loan"];
  const questionFilter = ["question"];
  const facilityFilter = ["lead"];
  const cifFilter = [];
  const collateralTypeFilter = ["inspection"];

  const userFilter = ["inspection"];
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#fff",
      minHeight: "40px",
      maxWidth: "160px",
      width: "160px",
      height: "40px",
      borderRadius: "8px",
      boxShadow: state.isFocused ? null : null,
      borderColor: state.isSelected ? "#008eb0" : "#dee2e6",
    }),

    valueContainer: (provided) => ({
      ...provided,
      height: "40px",
      width: "160px",
      padding: "0 6px",
    }),

    input: (provided) => ({
      ...provided,
      margin: "0px",
      width: "100%",
      color: "#008eb0", // Change color of the selected option text to blue
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "100%",
      paddingRight: "2px !important",
      paddingLeft: "2px !important",
      "& > *:nth-child()": {
        display: "none",
      },
    }),
    MenuList: (provided) => ({
      ...provided,
      width: "160px",
    }),
    option: (base, state) => ({
      ...base,
      padding: "5px 10px",
      cursor: "pointer",
      color: state.isFocused ? "#fff" : "#333",
      backgroundColor: state.isFocused ? "#008eb0" : "transparent", // Set background color on hover
      "&:hover": {
        cursor: "pointer",
        color: state.isFocused ? "#fff" : "#333",
        backgroundColor: state.isFocused ? "#008eb0" : "transparent", // Set background color on hover
        // Set background color on hover
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: "#008eb0", // Change color of the selected option text to blue
    }),
    listbox: () => ({
      width: "160px",
      padding: "10px !important",
    }),
    menuPortal: (base) => ({
      ...base,
      width: "160px",

      zIndex: 9999,
    }),
    menu: (base) => ({
      ...base,
      width: "160px",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      display: "none", // Hide the dropdown indicator
    }),

    menuList: (base) => ({
      ...base,
      width: "160px",
    }),
    container: (base) => ({
      ...base,
      width: "160px !important",
    }),
    clearIndicator: (base) => ({
      ...base,
      padding: "2px", // Adjust the padding of the cross icon
    }),
  };
  useEffect(() => {
    if (showFilter) {
      parent.current && autoAnimate(parent.current);
    }
  }, [showFilter]);
  useEffect(() => {
    notificationAnimate.current && autoAnimate(notificationAnimate.current);
  }, [notificationAnimate]);

  const toggleFilter = useCallback(() => {
    setShowFilter((prev) => !prev);
  }, []);

  useEffect(() => {
    const socket = new WebSocket(`${process.env.REACT_APP_SOCKET_URL}?access_token=${getCookie("accessToken")}`);
    socket.onmessage = (event) => {
      dispatch(getAllNotifications(postsPerPage));
    };
  }, []);
  useEffect(() => {
    dispatch(getAllNotifications(postsPerPage));
  }, [dispatch, postsPerPage]);

  return (
    <>
      <div className="common-page-header  d-flex align-items-center justify-content-between">
        <div className="d-flex justify-content-between align-items-end w-100">
          <div className="d-flex align-items-end" style={{ height: "min-content", gap: "10px", width: "max-content" }}>
            <div className="title">{title}</div>
            <div className="showing-entries-filter">
              <>
                {count && (
                  <>
                    {loading ? (
                      <p className="d-flex justify-content-start fetching-data">
                        Fetching data<i className="period">.</i>
                        <i className="period">.</i>
                        <i className="period">.</i>
                      </p>
                    ) : !loading && !count > 0 ? (
                      <p className="d-flex justify-content-start">No entries found.</p>
                    ) : count > 0 ? (
                      <p>
                        {data?.length} of {count} Entries
                      </p>
                    ) : (
                      ""
                    )}
                  </>
                )}
              </>
            </div>
          </div>
          <div
            className="d-flex align-items-center"
            style={{
              gap: "20px",
              ...(types === "question" ? { zIndex: 1, top: 0, right: 0, position: "absolute" } : {}),
            }}
          >
            <div className={`d-flex justify-content-center flex-column ${showParentAnimation ? "show-animation" : ""}`}>
              <div className="d-flex" style={{ gap: "10px" }}>
                <input
                  style={{
                    width: "100%",
                    minWidth: "200px",
                    boxShadow: "0px 0px 19px 0px #e7e7e74d",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 10px",
                    outline: "none",
                  }}
                  className="border"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value.trimStart())}
                  placeholder="Search"
                  aria-label="Search"
                  aria-describedby="basic-addon1"
                />
                <div ref={parent}>
                  {showFilter && (
                    <div
                      className={"h-100 "}
                      style={{
                        width: "max-content",
                        // zIndex: "10000",
                        // right: "-30px",
                        // bottom: "-115px",
                      }}
                    >
                      <div
                        className={`w-100  h-100 ${
                          statusFilter.includes(types) ||
                          inspectionStatusFilter.includes(types) ||
                          loanTypeFilter.includes(types) ||
                          dateFilter.includes(types) ||
                          questionFilter.includes(types)
                            ? "d-flex"
                            : "d-none"
                        }`}
                        style={{ gap: "10px" }}
                      >
                        {statusFilter.includes(types) && (
                          <Select
                            styles={customStyles}
                            value={status}
                            isClearable={true}
                            isSearchable={true}
                            className="btn-filter"
                            name="status"
                            placeholder="Status"
                            options={statusList}
                            getOptionLabel={(option) => `${option.value}`}
                            getOptionValue={(option) => `${option.id}`}
                            onChange={(selected) => {
                              setStatus(selected);
                            }}
                          />
                        )}

                        {inspectionStatusFilter.includes(types) && (
                          <>
                            <Select
                              styles={customStyles}
                              value={status}
                              isClearable={true}
                              isSearchable={true}
                              className="btn-filter"
                              name="status"
                              placeholder="Status"
                              options={inspectionStatusList}
                              getOptionLabel={(option) => `${option.value}`}
                              getOptionValue={(option) => `${option.id}`}
                              onChange={(selected) => {
                                setStatus(selected);
                              }}
                            />
                          </>
                        )}
                        {dateFilter.includes(types) && (
                          <>
                            <div className="common-datepicker-wrapper">
                              <DatePicker
                                selected={startDate}
                                onChange={onChange}
                                startDate={startDate}
                                endDate={endDate}
                                selectsRange
                                isClearable={true}
                                placeholderText="Select date "
                              />
                            </div>
                          </>
                        )}
                        {loanTypeFilter.includes(types) && (
                          <Select
                            styles={customStyles}
                            value={loanType}
                            isClearable={true}
                            isSearchable={true}
                            className="btn-filter"
                            name="loanType"
                            placeholder="Loan Type"
                            options={loanTypeList}
                            getOptionLabel={(option) => `${option.value}`}
                            getOptionValue={(option) => `${option.id}`}
                            onChange={(selected) => {
                              setLoanType(selected);
                            }}
                          />
                        )}
                        {questionFilter.includes(types) && (
                          <Select
                            styles={customStyles}
                            value={questionType}
                            isClearable={true}
                            isSearchable={true}
                            className="btn-filter"
                            name="questionType"
                            placeholder="Question Type"
                            options={questionTypeList}
                            getOptionLabel={(option) => `${option.value}`}
                            getOptionValue={(option) => `${option.id}`}
                            onChange={(selected) => {
                              setQuestionType(selected);
                            }}
                          />
                        )}
                        {facilityFilter.includes(types) && (
                          <AsyncSelect
                            styles={customStyles}
                            isNotFormik
                            // isMulti={true}
                            // label="Facility"
                            value={facilityType}
                            name="facilityType"
                            getOptionLabel={(option) => `${option?.name} `}
                            getOptionValue={(option) => `${option?.id}`}
                            onChange={(select) => {
                              setFacilityType(select);
                            }}
                            loadOptions={loadFacilityType}
                            additional={{
                              offset: 0,
                              limit: 10,
                            }}
                          />
                        )}
                        {collateralTypeFilter.includes(types) && (
                          <AsyncSelect
                            styles={customStyles}
                            isNotFormik
                            // isMulti={true}
                            // label="Facility"
                            value={collateralType}
                            name="collateralType"
                            getOptionLabel={(option) => `${option?.name} `}
                            getOptionValue={(option) => `${option?.id}`}
                            onChange={(select) => {
                              setCollateralType(select);
                            }}
                            loadOptions={loadCollateralType}
                            additional={{
                              offset: 0,
                              limit: 10,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div
                  className={`btn filter  ${
                    statusFilter.includes(types) ||
                    inspectionStatusFilter.includes(types) ||
                    loanTypeFilter.includes(types) ||
                    dateFilter.includes(types) ||
                    questionFilter.includes(types)
                      ? "d-flex"
                      : "d-none"
                  }`}
                  onClick={toggleFilter}
                  style={{
                    border: "none",
                    outline: "none",
                    padding: "10px 15px",
                  }}
                >
                  <IoFilter />
                </div>
              </div>
            </div>
            <div className="border" style={{ height: "30px", width: "1px" }} />
            <div className="position-relative">
              <div className="dropdown">
                <button
                  type="button"
                  id="page-header-notifications-dropdown"
                  data-bs-toggle="dropdown"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  className="bg-transparent border-0"
                  style={{ outline: "none" }}
                >
                  <MdNotificationsNone size={26} />
                </button>
                <div
                  ref={notificationAnimate}
                  style={{ borderRadius: "8px" }}
                  className="dropdown-menu border-0  mt-4 dropdown-menu-lg p-0 notification-dropdown-menu"
                  aria-labelledby="page-header-notifications-dropdown"
                >
                  {<Notification setPostsPerPage={setPostsPerPage} />}
                </div>
              </div>
              <div
                className="position-absolute  badge badge-danger"
                data-bs-toggle="dropdown"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                style={{
                  top: "-5px",
                  padding: "4px",
                  right: "-5px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  minWidth: "min-content",
                }}
              >
                {unreadNotificationsCount}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommonPageHeader;
