// Mock integration data
// In real app these would call real Shopify/CRM APIs

export interface ShopifyData {
  totalProducts: number;
  activeOrders: number;
  revenue: string;
  topProduct: string;
  lowStockItems: number;
}

export interface CRMData {
  totalCustomers: number;
  newLeads: number;
  conversionRate: string;
  topCustomer: string;
  pendingFollowUps: number;
}

export function getShopifyData(): ShopifyData {
  return {
    totalProducts: 150,
    activeOrders: 23,
    revenue: "$12,450",
    topProduct: "Premium Widget ($299)",
    lowStockItems: 5,
  };
}

export function getCRMData(): CRMData {
  return {
    totalCustomers: 1234,
    newLeads: 45,
    conversionRate: "12%",
    topCustomer: "Acme Corp ($50,000 lifetime value)",
    pendingFollowUps: 8,
  };
}