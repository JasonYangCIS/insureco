// Financial Dashboard Mock Data
// Insurance Financial Analytics Dashboard (IFAD)

export const kpiGross = {
  totalOwedYTD: 1_284_500,
  totalClaimedYTD: 847_200,
  autoOwedYTD: 756_000,
  autoClaimedYTD: 512_000,
  propertyOwedYTD: 528_500,
  propertyClaimedYTD: 335_200,
};

export const kpiNet = {
  totalOwedYTD: 1_156_050,
  totalClaimedYTD: 762_480,
  autoOwedYTD: 680_400,
  autoClaimedYTD: 460_800,
  propertyOwedYTD: 475_650,
  propertyClaimedYTD: 301_680,
};

export const monthlyTrend = [
  { month: 'Jan', propertyPremiums: 44000, propertyClaims: 28000, autoPremiums: 63000, autoClaims: 41000 },
  { month: 'Feb', propertyPremiums: 46000, propertyClaims: 31000, autoPremiums: 61000, autoClaims: 38000 },
  { month: 'Mar', propertyPremiums: 43000, propertyClaims: 25000, autoPremiums: 65000, autoClaims: 44000 },
  { month: 'Apr', propertyPremiums: 48000, propertyClaims: 27000, autoPremiums: 62000, autoClaims: 39000 },
  { month: 'May', propertyPremiums: 45000, propertyClaims: 33000, autoPremiums: 64000, autoClaims: 47000 },
  { month: 'Jun', propertyPremiums: 50000, propertyClaims: 29000, autoPremiums: 67000, autoClaims: 42000 },
  { month: 'Jul', propertyPremiums: 47000, propertyClaims: 35000, autoPremiums: 63000, autoClaims: 51000 },
  { month: 'Aug', propertyPremiums: 52000, propertyClaims: 30000, autoPremiums: 68000, autoClaims: 43000 },
  { month: 'Sep', propertyPremiums: 49000, propertyClaims: 38000, autoPremiums: 66000, autoClaims: 55000 },
  { month: 'Oct', propertyPremiums: 53000, propertyClaims: 32000, autoPremiums: 70000, autoClaims: 48000 },
  { month: 'Nov', propertyPremiums: 51000, propertyClaims: 36000, autoPremiums: 69000, autoClaims: 52000 },
  { month: 'Dec', propertyPremiums: 55000, propertyClaims: 31000, autoPremiums: 73000, autoClaims: 49000 },
];

export const assets = [
  {
    id: 'AUT-001',
    name: '2022 Freightliner Cascadia',
    category: 'Auto',
    premiumDue: 3400,
    dueDate: '2025-08-01',
    totalClaims: 18500,
    claimHistory: [
      { claimId: 'CLM-2024-0341', dateFiled: '2024-03-15', type: 'Collision', amount: 8200, status: 'Settled' },
      { claimId: 'CLM-2023-1102', dateFiled: '2023-11-08', type: 'Liability', amount: 6800, status: 'Settled' },
      { claimId: 'CLM-2023-0455', dateFiled: '2023-05-22', type: 'Comprehensive', amount: 3500, status: 'Settled' },
    ],
    coverageLimits: { liability: 1000000, collision: 250000, deductible: 5000 },
    policyInfo: { policyNumber: 'POL-AUT-88221', underwriter: 'Great Lakes Reinsurance', inceptionDate: '2022-01-15', renewalDate: '2026-01-15', coverageType: 'Commercial Auto' },
  },
  {
    id: 'AUT-002',
    name: '2021 Toyota Camry Fleet (x5)',
    category: 'Auto',
    premiumDue: 1200,
    dueDate: '2025-07-15',
    totalClaims: 4200,
    claimHistory: [
      { claimId: 'CLM-2024-0780', dateFiled: '2024-07-02', type: 'Collision', amount: 2400, status: 'Settled' },
      { claimId: 'CLM-2024-0210', dateFiled: '2024-02-18', type: 'Windshield', amount: 1800, status: 'Settled' },
    ],
    coverageLimits: { liability: 500000, collision: 50000, deductible: 1000 },
    policyInfo: { policyNumber: 'POL-AUT-77843', underwriter: 'Midwest Assurance Group', inceptionDate: '2021-06-01', renewalDate: '2025-06-01', coverageType: 'Fleet Auto' },
  },
  {
    id: 'AUT-003',
    name: '2020 Ford F-250 Work Truck',
    category: 'Auto',
    premiumDue: 980,
    dueDate: '2025-08-10',
    totalClaims: 7800,
    claimHistory: [
      { claimId: 'CLM-2024-0512', dateFiled: '2024-05-10', type: 'Collision', amount: 5200, status: 'Settled' },
      { claimId: 'CLM-2022-0891', dateFiled: '2022-09-14', type: 'Theft', amount: 2600, status: 'Settled' },
    ],
    coverageLimits: { liability: 500000, collision: 75000, deductible: 2500 },
    policyInfo: { policyNumber: 'POL-AUT-65510', underwriter: 'Midwest Assurance Group', inceptionDate: '2020-03-20', renewalDate: '2026-03-20', coverageType: 'Commercial Auto' },
  },
  {
    id: 'AUT-004',
    name: '2023 Peterbilt 389 Semi',
    category: 'Auto',
    premiumDue: 4100,
    dueDate: '2025-09-15',
    totalClaims: 22100,
    claimHistory: [
      { claimId: 'CLM-2025-0088', dateFiled: '2025-01-20', type: 'Collision', amount: 14000, status: 'Pending' },
      { claimId: 'CLM-2024-0921', dateFiled: '2024-10-05', type: 'Liability', amount: 8100, status: 'Settled' },
    ],
    coverageLimits: { liability: 2000000, collision: 500000, deductible: 10000 },
    policyInfo: { policyNumber: 'POL-AUT-91034', underwriter: 'Great Lakes Reinsurance', inceptionDate: '2023-02-01', renewalDate: '2027-02-01', coverageType: 'Commercial Auto' },
  },
  {
    id: 'PRO-001',
    name: '123 Maple St Warehouse',
    category: 'Property',
    premiumDue: 8200,
    dueDate: '2025-07-30',
    totalClaims: 52000,
    claimHistory: [
      { claimId: 'CLM-2024-0301', dateFiled: '2024-02-28', type: 'Fire Damage', amount: 32000, status: 'Settled' },
      { claimId: 'CLM-2023-0755', dateFiled: '2023-08-14', type: 'Water Damage', amount: 14000, status: 'Settled' },
      { claimId: 'CLM-2022-1201', dateFiled: '2022-12-01', type: 'Structural', amount: 6000, status: 'Settled' },
    ],
    coverageLimits: { liability: 2000000, collision: 1500000, deductible: 25000 },
    policyInfo: { policyNumber: 'POL-PRO-33421', underwriter: 'National Property Re', inceptionDate: '2019-06-01', renewalDate: '2026-06-01', coverageType: 'Commercial Property' },
  },
  {
    id: 'PRO-002',
    name: '456 Oak Ave Office Complex',
    category: 'Property',
    premiumDue: 5600,
    dueDate: '2025-08-05',
    totalClaims: 12400,
    claimHistory: [
      { claimId: 'CLM-2024-0644', dateFiled: '2024-06-15', type: 'Vandalism', amount: 7200, status: 'Settled' },
      { claimId: 'CLM-2023-0320', dateFiled: '2023-03-22', type: 'Water Damage', amount: 5200, status: 'Settled' },
    ],
    coverageLimits: { liability: 1500000, collision: 800000, deductible: 10000 },
    policyInfo: { policyNumber: 'POL-PRO-44780', underwriter: 'National Property Re', inceptionDate: '2020-09-01', renewalDate: '2026-09-01', coverageType: 'Commercial Property' },
  },
  {
    id: 'PRO-003',
    name: '789 Industrial Blvd Facility',
    category: 'Property',
    premiumDue: 11200,
    dueDate: '2025-09-01',
    totalClaims: 31000,
    claimHistory: [
      { claimId: 'CLM-2024-0180', dateFiled: '2024-01-10', type: 'Equipment Breakdown', amount: 18500, status: 'Settled' },
      { claimId: 'CLM-2023-0910', dateFiled: '2023-09-30', type: 'Flood', amount: 12500, status: 'Settled' },
    ],
    coverageLimits: { liability: 3000000, collision: 2000000, deductible: 50000 },
    policyInfo: { policyNumber: 'POL-PRO-55200', underwriter: 'Industrial Risk Insurers', inceptionDate: '2018-01-15', renewalDate: '2027-01-15', coverageType: 'Industrial Property' },
  },
  {
    id: 'PRO-004',
    name: '22 Harbor View Marina',
    category: 'Property',
    premiumDue: 6900,
    dueDate: '2025-07-20',
    totalClaims: 9800,
    claimHistory: [
      { claimId: 'CLM-2024-0805', dateFiled: '2024-08-01', type: 'Storm Damage', amount: 9800, status: 'Under Review' },
    ],
    coverageLimits: { liability: 1000000, collision: 750000, deductible: 15000 },
    policyInfo: { policyNumber: 'POL-PRO-61890', underwriter: 'Coastal Specialty Re', inceptionDate: '2021-04-01', renewalDate: '2026-04-01', coverageType: 'Marine / Property' },
  },
  {
    id: 'AUT-005',
    name: '2019 Chevrolet Express Van',
    category: 'Auto',
    premiumDue: 760,
    dueDate: '2025-08-25',
    totalClaims: 3100,
    claimHistory: [
      { claimId: 'CLM-2023-0600', dateFiled: '2023-06-10', type: 'Collision', amount: 3100, status: 'Settled' },
    ],
    coverageLimits: { liability: 300000, collision: 30000, deductible: 1000 },
    policyInfo: { policyNumber: 'POL-AUT-70045', underwriter: 'Midwest Assurance Group', inceptionDate: '2019-11-01', renewalDate: '2025-11-01', coverageType: 'Commercial Auto' },
  },
  {
    id: 'PRO-005',
    name: '550 Commerce Dr Retail Strip',
    category: 'Property',
    premiumDue: 4400,
    dueDate: '2025-10-01',
    totalClaims: 6700,
    claimHistory: [
      { claimId: 'CLM-2023-1050', dateFiled: '2023-10-15', type: 'Slip & Fall', amount: 4200, status: 'Settled' },
      { claimId: 'CLM-2022-0770', dateFiled: '2022-08-22', type: 'Glass Breakage', amount: 2500, status: 'Settled' },
    ],
    coverageLimits: { liability: 1000000, collision: 500000, deductible: 5000 },
    policyInfo: { policyNumber: 'POL-PRO-72340', underwriter: 'National Property Re', inceptionDate: '2020-10-01', renewalDate: '2026-10-01', coverageType: 'Commercial Property' },
  },
];

export const lossRatio = Math.round((kpiGross.totalClaimedYTD / kpiGross.totalOwedYTD) * 100);

export const highestSingleClaim = assets.reduce((max, asset) => {
  const maxClaim = Math.max(...asset.claimHistory.map(c => c.amount));
  return maxClaim > max ? maxClaim : max;
}, 0);

export const next30DaysCollections = assets
  .filter(a => {
    const due = new Date(a.dueDate);
    const now = new Date('2025-07-13');
    const diff = (due - now) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 30;
  })
  .reduce((sum, a) => sum + a.premiumDue, 0);

export const upcomingDues = assets
  .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
  .slice(0, 3);
