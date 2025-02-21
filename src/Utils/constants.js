export const fiscalSessionTypes = [
  { id: 1, name: "AD" },
  { id: 2, name: "BS" },
];

export const genders = [
  { id: 1, name: "Male" },
  { id: 2, name: "Female" },
  { id: 3, name: "Others" },
];

export const statusList = [
  {
    id: 1,
    value: "PENDING",
  },
  {
    id: 3,
    value: "CANCELLED",
  },
];
export const inspectionStatusList = [
  {
    id: 1,
    value: "TO BE APPROVED",
  },
  {
    id: 2,
    value: "INSPECTED",
  },
  {
    id: 3,
    value: "INSPECTION APPROVED",
  },
];
export const loanTypeList = [
  {
    id: 1,
    value: "PERSONAL",
  },
  {
    id: 2,
    value: "BUSINESS",
  },
];

export const questionTypeList = [
  {
    id: 1,
    value: "PARAGRAPH",
  },
  {
    id: 2,
    value: "BOOLEAN",
  },
  {
    id: 3,
    value: "CHECKLIST",
  },
  {
    id: 4,
    value: "TABLE",
  },
];

export const inspectionTypeList = [
  { id: 1, label: "scheduled" },
  { id: 2, label: "ad_hoc" },
];

export const loadBranch = [
  { id: 1, label: "KTM" },
  { id: 2, label: "BKT" },
  { id: 3, label: "PHK" },
];

export const excludeCreateBtn = ["inspection"];
export const hideButton = ["organization", "organizationHierarchy"];
