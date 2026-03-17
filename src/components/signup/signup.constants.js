// ─── US States ────────────────────────────────────────────────────────────────
export const US_STATES = [
  { value: '', label: '' },
  { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' }, { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' }, { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' }, { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' }, { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' }, { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' }, { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' }, { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' }, { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' },
];

// ─── Car Year Options (1990–2025, newest first) ───────────────────────────────
export const CAR_YEARS = [
  { value: '', label: '' },
  ...Array.from({ length: 2025 - 1990 + 1 }, (_, i) => {
    const year = String(2025 - i);
    return { value: year, label: year };
  }),
];

// ─── Home Year Options (1800–2025, newest first) ──────────────────────────────
export const HOME_YEARS = [
  { value: '', label: '' },
  ...Array.from({ length: 2025 - 1800 + 1 }, (_, i) => {
    const year = String(2025 - i);
    return { value: year, label: year };
  }),
];

// ─── Home Types ───────────────────────────────────────────────────────────────
export const HOME_TYPES = [
  { value: '', label: '' },
  { value: 'single_family', label: 'Single Family' },
  { value: 'condo', label: 'Condo' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'multi_family', label: 'Multi-Family' },
  { value: 'mobile_home', label: 'Mobile Home' },
  { value: 'other', label: 'Other' },
];

// ─── Display Label Maps ───────────────────────────────────────────────────────
export const HOME_TYPE_LABELS = {
  single_family: 'Single Family',
  condo: 'Condo',
  townhouse: 'Townhouse',
  multi_family: 'Multi-Family',
  mobile_home: 'Mobile Home',
  other: 'Other',
};

export const INSURANCE_LABELS = {
  car: 'Car Insurance',
  home: 'Home Insurance',
  both: 'Car & Home Insurance (Bundle)',
};

// ─── Progress Step Definitions ────────────────────────────────────────────────
export const PROGRESS_STEPS = [
  { key: 'info',     label: 'Personal Info', description: 'Basic details' },
  { key: 'address',  label: 'Address',       description: 'Where you live' },
  { key: 'coverage', label: 'Coverage',      description: 'Insurance type' },
  { key: 'details',  label: 'Details',       description: 'Policy specifics' },
  { key: 'review',   label: 'Review',        description: 'Confirm & submit' },
];

// ─── Step → Visual Progress Index ─────────────────────────────────────────────
export const STEP_TO_VISUAL = {
  personal:      0,
  address:       1,
  insuranceType: 2,
  carDetails:    3,
  homeDetails:   3,
  summary:       4,
};
