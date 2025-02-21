import { BsPersonVcard } from "react-icons/bs";
import { FaBusinessTime, FaHistory, FaLandmark, FaUserPlus } from "react-icons/fa";
import { RiSettings4Line } from "react-icons/ri";
import { PERMISSIONS } from "../../Utils/permission";

export const sidebarData = [
  {
    menu: "Client Registration",
    icon: <FaUserPlus size={16} />,
    link: "/client-registration",
    permissions: PERMISSIONS?.loanInfo.all,
  },
  {
    menu: "Collateral Inspection",
    icon: <FaLandmark size={16} />,
    link: "/collateral-inspection",
    permissions: PERMISSIONS.inspection.all,
  },
  {
    menu: "Business Inspection",
    icon: <FaBusinessTime size={16} />,
    link: "/buisness-inspection",
    permissions: PERMISSIONS?.businessInspection.all,
  },
  // {
  //   menu: "Collection And Recovery",
  //   icon: <BiCollection size={16} />,
  //   link: "/collection-and-recovery",
  //   permissions: PERMISSIONS?.recoveryCollectionLoan.all,
  // },
  {
    menu: "Customer 360",
    icon: <BsPersonVcard size={16} />,
    link: "/customer-details",
    permissions: PERMISSIONS?.loanInfo.all, // TODO: add permission
  },
  {
    menu: "System Activity",
    icon: <FaHistory size={16} />,
    link: "/system-activity",
    permissions: PERMISSIONS?.systemActivity.all,
  },
];

export const admin = [
  {
    menu: "Setting",
    icon: <RiSettings4Line size={18} />,
    sub_menu: [
      {
        name: "Department",
        link: "/department",
        permissions: PERMISSIONS?.department.all,
      },
      {
        name: "Hierarchy",
        link: "/hierarchy",
        permissions: PERMISSIONS?.organizationHierarchy.all,
      },
      {
        name: "Questions",
        link: "/questions",
        key: "questions",
        permissions: PERMISSIONS?.annex.all,
        child_menu: [
          {
            name: "Collateral Questionnaires",
            link: "/collateral-questionnaires", // TODO: add permission
            permissions: PERMISSIONS?.annex?.all,
          },
          {
            name: "Business Questionnaires",
            link: "/business-questionnaires",
            permissions: PERMISSIONS.businessInspectionAnnexure.all,
          },
        ],
      },
      {
        name: "Core Setup",
        link: "/core-setup",
        key: "coreSetup",
        permissions: PERMISSIONS.organizationSetup.all,
        child_menu: [
          {
            name: "Organization",
            link: "/organization-setup",
            permissions: PERMISSIONS.organizationSetup.all,
          },
          {
            name: "Country",
            link: "/country",
            permissions: PERMISSIONS.country.all,
          },
          {
            name: "Currency",
            link: "/currency",
            permissions: PERMISSIONS.country.all,
          },
          {
            name: "Fiscal Session AD",
            link: "/fiscalSessionAD",
            permissions: PERMISSIONS.fiscalSessionAD.all,
          },
          {
            name: "Fiscal Session BS",
            link: "/fiscalSessionBS",
            permissions: PERMISSIONS.fiscalSessionBS.all,
          },
        ],
      },
      {
        name: "User Setup",
        link: "/user-setup",
        key: "userSetup",
        permissions: PERMISSIONS.user.all,
        child_menu: [
          {
            name: "User",
            link: "/user",
            permissions: PERMISSIONS.user.all,
          },
          {
            name: "User Group",
            link: "/user-group",
            permissions: PERMISSIONS.user.all,
          },
        ],
      },
      {
        name: "Loan Setup",
        link: "/loan-setup",
        key: "loanSetup",

        permissions: PERMISSIONS.loanInfo.all,
        child_menu: [
          {
            name: "Facility Type",
            link: "/facility-type",
            permissions: [...PERMISSIONS.facility.all, ...PERMISSIONS.facilityType.all],
          },
          {
            name: "Business Nature",
            link: "/business-Nature",
            permissions: PERMISSIONS.collateral.all, // TODO: add permission
          },
          {
            name: "Collateral Type",
            link: "/collateral-type",
            permissions: PERMISSIONS.collateral.all,
          },
        ],
      },
    ],
  },
];
