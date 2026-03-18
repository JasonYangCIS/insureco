// Mock data generator for Financial Dashboard
// Generates realistic insurance financial data for the last 12 months

// Helper to generate dates for last 12 months
const generateMonthlyDates = () => {
  const dates = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    dates.push({
      month: date.toLocaleString('default', { month: 'short' }),
      year: date.getFullYear(),
      fullDate: date,
    });
  }
  return dates;
};

// Generate monthly financial data
export const generateMonthlyData = () => {
  const months = generateMonthlyDates();
  
  return months.map((dateInfo, index) => {
    // Add some realistic variance and trends
    const propertyPremiumBase = 85000 + (index * 2000); // Growing trend
    const autoPremiumBase = 65000 + (index * 1500);
    const variance = () => Math.random() * 0.15 - 0.075; // ±7.5% variance
    
    return {
      month: dateInfo.month,
      year: dateInfo.year,
      monthYear: `${dateInfo.month} ${dateInfo.year}`,
      propertyPremiums: Math.round(propertyPremiumBase * (1 + variance())),
      propertyClaims: Math.round((propertyPremiumBase * 0.68) * (1 + variance() * 2)), // ~68% loss ratio with more variance
      autoPremiums: Math.round(autoPremiumBase * (1 + variance())),
      autoClaims: Math.round((autoPremiumBase * 0.72) * (1 + variance() * 2)), // ~72% loss ratio
    };
  });
};

// Generate asset data with realistic insurance information
export const generateAssetData = () => {
  const propertyAssets = [
    { name: '123 Maple St Warehouse', city: 'Portland', state: 'OR' },
    { name: '456 Oak Ave Industrial Park', city: 'Seattle', state: 'WA' },
    { name: '789 Pine Blvd Distribution Center', city: 'Sacramento', state: 'CA' },
    { name: '321 Elm St Office Complex', city: 'Denver', state: 'CO' },
    { name: '654 Cedar Ln Manufacturing', city: 'Phoenix', state: 'AZ' },
    { name: '987 Birch Rd Retail Center', city: 'Austin', state: 'TX' },
    { name: '147 Spruce Ave Storage Facility', city: 'Atlanta', state: 'GA' },
    { name: '258 Willow Dr Tech Campus', city: 'Boston', state: 'MA' },
    { name: '369 Aspen Ct Commercial Plaza', city: 'Miami', state: 'FL' },
    { name: '741 Redwood St Mixed Use', city: 'Chicago', state: 'IL' },
  ];

  const autoAssets = [
    { make: 'Freightliner', model: 'Cascadia', year: 2022 },
    { make: 'Peterbilt', model: '579', year: 2023 },
    { make: 'Kenworth', model: 'T680', year: 2021 },
    { make: 'Volvo', model: 'VNL', year: 2022 },
    { make: 'Mack', model: 'Anthem', year: 2023 },
    { make: 'International', model: 'LT', year: 2022 },
    { make: 'Freightliner', model: 'Cascadia', year: 2023 },
    { make: 'Peterbilt', model: '389', year: 2021 },
    { make: 'Kenworth', model: 'W900', year: 2022 },
    { make: 'Western Star', model: '4900', year: 2023 },
    { make: 'Ford', model: 'F-550', year: 2022 },
    { make: 'Chevrolet', model: 'Silverado 3500', year: 2023 },
    { make: 'Ram', model: '5500', year: 2021 },
    { make: 'GMC', model: 'Sierra 3500', year: 2022 },
    { make: 'Isuzu', model: 'NPR', year: 2023 },
  ];

  const assets = [];
  let idCounter = 1;

  // Generate property assets
  propertyAssets.forEach((property, index) => {
    const premiumDue = 2500 + Math.random() * 7500; // $2,500 - $10,000
    const totalClaims = Math.random() * 50000; // $0 - $50,000
    const daysUntilDue = Math.floor(Math.random() * 365);
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + daysUntilDue);

    assets.push({
      id: `PROP-${String(idCounter++).padStart(4, '0')}`,
      assetName: property.name,
      assetCategory: 'Property',
      location: `${property.city}, ${property.state}`,
      premiumDue: Math.round(premiumDue),
      dueDate: dueDate.toISOString().split('T')[0],
      totalClaims: Math.round(totalClaims),
      policyNumber: `P${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
      coverageAmount: Math.round((500000 + Math.random() * 4500000) / 1000) * 1000, // $500k - $5M
      deductible: [5000, 10000, 25000][Math.floor(Math.random() * 3)],
    });
  });

  // Generate auto assets
  autoAssets.forEach((vehicle, index) => {
    const premiumDue = 800 + Math.random() * 2200; // $800 - $3,000
    const totalClaims = Math.random() * 25000; // $0 - $25,000
    const daysUntilDue = Math.floor(Math.random() * 365);
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + daysUntilDue);

    assets.push({
      id: `AUTO-${String(idCounter++).padStart(4, '0')}`,
      assetName: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      assetCategory: 'Auto',
      location: null,
      premiumDue: Math.round(premiumDue),
      dueDate: dueDate.toISOString().split('T')[0],
      totalClaims: Math.round(totalClaims),
      policyNumber: `A${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
      vin: generateVIN(),
      coverageAmount: [100000, 250000, 500000][Math.floor(Math.random() * 3)],
      deductible: [500, 1000, 2500][Math.floor(Math.random() * 3)],
    });
  });

  return assets;
};

// Helper to generate realistic VIN
const generateVIN = () => {
  const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
  let vin = '';
  for (let i = 0; i < 17; i++) {
    vin += chars[Math.floor(Math.random() * chars.length)];
  }
  return vin;
};

// Generate claim history for a specific asset
export const generateClaimHistory = (assetId, assetCategory) => {
  const numClaims = Math.floor(Math.random() * 5); // 0-4 claims
  const claims = [];
  
  const propertyClaimTypes = ['Water Damage', 'Fire Damage', 'Storm Damage', 'Vandalism', 'Theft', 'Structural Damage'];
  const autoClaimTypes = ['Collision', 'Comprehensive', 'Liability', 'Property Damage', 'Theft', 'Weather Damage'];
  const claimTypes = assetCategory === 'Property' ? propertyClaimTypes : autoClaimTypes;
  
  const statuses = ['Paid', 'Closed', 'Under Review', 'Pending'];
  
  for (let i = 0; i < numClaims; i++) {
    const daysAgo = Math.floor(Math.random() * 730); // Within last 2 years
    const claimDate = new Date();
    claimDate.setDate(claimDate.getDate() - daysAgo);
    
    const amount = assetCategory === 'Property' 
      ? 5000 + Math.random() * 45000  // $5k - $50k for property
      : 1000 + Math.random() * 24000;  // $1k - $25k for auto
    
    claims.push({
      claimId: `CLM-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
      claimDate: claimDate.toISOString().split('T')[0],
      claimType: claimTypes[Math.floor(Math.random() * claimTypes.length)],
      amount: Math.round(amount),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      description: generateClaimDescription(assetCategory),
    });
  }
  
  return claims.sort((a, b) => new Date(b.claimDate) - new Date(a.claimDate));
};

const generateClaimDescription = (category) => {
  const propertyDescriptions = [
    'Water leak from ceiling damaged inventory',
    'Storm damage to roof and exterior walls',
    'Fire in electrical room caused smoke damage',
    'Break-in resulted in damaged door and stolen equipment',
    'Hail damage to HVAC units on roof',
    'Flood damage to basement storage area',
  ];
  
  const autoDescriptions = [
    'Rear-end collision at intersection',
    'Vehicle struck by debris on highway',
    'Windshield damaged by road debris',
    'Side-swipe collision in parking lot',
    'Vehicle damaged during severe weather event',
    'Minor collision with guardrail',
  ];
  
  const descriptions = category === 'Property' ? propertyDescriptions : autoDescriptions;
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

// Generate policy documents for asset detail view
export const generatePolicyDocuments = (assetId) => {
  return [
    {
      docId: 'DOC-001',
      docName: 'Policy Agreement',
      docType: 'PDF',
      uploadDate: '2024-01-15',
      size: '2.4 MB',
    },
    {
      docId: 'DOC-002',
      docName: 'Coverage Schedule',
      docType: 'PDF',
      uploadDate: '2024-01-15',
      size: '1.1 MB',
    },
    {
      docId: 'DOC-003',
      docName: 'Underwriting Report',
      docType: 'PDF',
      uploadDate: '2024-01-10',
      size: '3.7 MB',
    },
  ];
};

// Calculate YTD summary statistics
export const calculateYTDStats = (monthlyData, assetData) => {
  const currentYear = new Date().getFullYear();
  const ytdData = monthlyData.filter(m => m.year === currentYear);
  
  const totalOwed = ytdData.reduce((sum, m) => sum + m.propertyPremiums + m.autoPremiums, 0);
  const totalClaimed = ytdData.reduce((sum, m) => sum + m.propertyClaims + m.autoClaims, 0);
  const propertyOwed = ytdData.reduce((sum, m) => sum + m.propertyPremiums, 0);
  const propertyClaimed = ytdData.reduce((sum, m) => sum + m.propertyClaims, 0);
  const autoOwed = ytdData.reduce((sum, m) => sum + m.autoPremiums, 0);
  const autoClaimed = ytdData.reduce((sum, m) => sum + m.autoClaims, 0);
  
  return {
    totalOwed: Math.round(totalOwed),
    totalClaimed: Math.round(totalClaimed),
    propertyOwed: Math.round(propertyOwed),
    propertyClaimed: Math.round(propertyClaimed),
    autoOwed: Math.round(autoOwed),
    autoClaimed: Math.round(autoClaimed),
    lossRatio: ((totalClaimed / totalOwed) * 100).toFixed(1),
  };
};

// Export singleton data instances
let monthlyDataCache = null;
let assetDataCache = null;

export const getMonthlyData = () => {
  if (!monthlyDataCache) {
    monthlyDataCache = generateMonthlyData();
  }
  return monthlyDataCache;
};

export const getAssetData = () => {
  if (!assetDataCache) {
    assetDataCache = generateAssetData();
  }
  return assetDataCache;
};

export const getAssetById = (assetId) => {
  const assets = getAssetData();
  return assets.find(asset => asset.id === assetId);
};
