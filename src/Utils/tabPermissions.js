export const coreSetupPermission = [
  {
    tabName: "Organization Setup",
    ordering: 0,
    keyWord: "organization",
    permissionList: ["add_department"],
  },
  {
    tabName: "Country",
    ordering: 1,
    keyWord: "country",
    permissionList: ["add_department"],
  },
  {
    tabName: "Currency",
    ordering: 2,
    keyWord: "currency",
    permissionList: ["add_department"],
  },
  {
    tabName: "Fiscal Session AD",
    ordering: 3,
    keyWord: "fiscal-session-ad",
    permissionList: ["add_department"],
  },
  {
    tabName: "Fiscal Session BS",
    ordering: 4,
    keyWord: "fiscal-session-bs",
    permissionList: ["add_department"],
  },
];

export const userPermission = [
  {
    tabName: "User",
    ordering: 0,
    keyWord: "user",
    permissionList: ["add_department", "view_user", "update_user"],
  },
  {
    tabName: "User Group",
    ordering: 1,
    keyWord: "user-group",
    permissionList: ["add_department", "view_role", "update_role"],
  },
];

export const loanSetupPersmission = [
  {
    tabName: "Facility Type",
    ordering: 0,
    keyWord: "facility-type",
    permissionList: ["add_department", "view_user", "update_user"],
  },
  {
    tabName: "Business Nature",
    ordering: 1,
    keyWord: "business-nature",
    permissionList: ["add_department", "view_role", "update_role"],
  },
  {
    tabName: "Collateral Type",
    ordering: 2,
    keyWord: "collateral-type",
    permissionList: ["add_department", "view_role", "update_role"],
  },
  {
    tabName: "Inspection Duration",
    ordering: 3,
    keyWord: "inspection-duration",
    permissionList: ["add_department", "view_role", "update_role"],
  },
];

export const leadDetailPermission = [
  {
    tabName: "Loan Info",
    ordering: 0,
    keyWord: "loanInfo",
    permissionList: ["add_loan_info", "update_loan_info", "view_loan_info"],
  },
  {
    tabName: "Gurantor",
    ordering: 1,
    keyWord: "gurantor",
    permissionList: ["add_gurantor", "view_gurantor", "update_gurantor"],
  },
  {
    tabName: "BSIR",
    ordering: 2,
    keyWord: "bsir",
    permissionList: ["add_bsir", "view_bsir", "update_bsir"],
  },
  {
    tabName: "Sister Concerns",
    ordering: 3,
    keyWord: "sisterConcerns",
    permissionList: ["add_sister_concerns", "view_sister_concerns", "update_sister_concerns"],
  },
  {
    tabName: "Facilities",
    ordering: 4,
    keyWord: "Facilities",
    permissionList: ["add_facilities", "view_facilities", "update_facilities"],
  },
  {
    tabName: "Banking Relations",
    ordering: 5,
    keyWord: "bankingRelations",
    permissionList: ["add_bank_relations", "view_bank_relations", "update_bank_relations"],
  },

  {
    tabName: "Share Holder",
    ordering: 6,
    keyWord: "shareHolder",
    permissionList: ["view_share_holder_details", "add_share_holder_details", "update_share_holder_details"],
  },
  {
    tabName: "Collateral Info",
    ordering: 7,
    keyWord: "collateralInfo",
    permissionList: ["can_view_collateral", "can_update_collateral", "can_add_collateral"],
  },
  {
    tabName: "Inspection",
    ordering: 8,
    keyWord: "inspection",
    permissionList: ["view_inspection", "add_inspection", "update_inspection", "delete_inspection", "approve_inspection"],
  },
];

// export const questionPermission = [
//   {
//     tabName: "Questions",
//     ordering: 0,
//     keyWord: "user",
//     permissionList: ["add_user", "view_user", "update_user"],
//   },
//   {
//     tabName: "Checklist Fields",
//     ordering: 1,
//     keyWord: "checklist-fields",
//     permissionList: ["add_role", "view_role", "update_role"],
//   },
//   {
//     tabName: "Table Fields",
//     ordering: 3,
//     keyWord: "table-fields",
//     permissionList: ["add_role", "view_role", "update_role"],
//   },
// ];
