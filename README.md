# Karma - Node & JavaScript implementation

[//]: # "badges"

### Support

 ![Node.js supported](https://img.shields.io/badge/node-%3E%3D18.7.0-blue) 

### Test Coverage

 ![66.2%25 lines covered](https://img.shields.io/badge/lines-66.2%25-yellow) ![66.2%25 statements covered](https://img.shields.io/badge/statements-66.2%25-yellow) ![56.6%25 functions covered](https://img.shields.io/badge/functions-56.6%25-yellow) ![83.44%25 branches covered](https://img.shields.io/badge/branches-83.44%25-brightgreen)

[//]: # "badges"

### Client's TypeScript Interface

[//]: # "typescript client"

```typescript
export interface ClientOptions {
  partnerId?: string;
  accessToken?: string;
  version?: number;
  prefix?: string;
  url?: string | URL;
}

export interface Client {
  addPartner(partner: PartnerData): Promise<Partner>;
  addCategory(category: CategoryData): Promise<Category>;
  addProduct(product: ProductData): Promise<Product>;
  addReport(report: ReportData): Promise<Report>;
  addReportMetrics(data: ReportMetricsData): Promise<ReportMetrics>;
  getProduct(productId: string): Promise<Product | undefined>;
  getReport(reportId: string): Promise<Report | undefined>;
  listPartners(): Promise<Partner[]>;
  listOrganisations(): Promise<Organisation[]>;
  listSystemLogs(): Promise<SystemLog[]>;
  listProducts(): Promise<Product[]>;
  listReports(): Promise<Report[]>;
  listCategories(): Promise<Category[]>;
  listDailyMetrics(): Promise<CountryProductMetrics[]>;
  listMonthlyMetrics(): Promise<CountryProductMetrics[]>;
  listMetrics(): Promise<CountryProductMetrics[]>;
  listReportMetrics(): Promise<ReportMetrics[]>;
  listProductMetrics(productId: string): Promise<CountryProductMetrics[]>;
  listCalculationKeys(): Promise<string[]>;
  listCalculations(): Promise<CalculationSource[]>;
  background(query: Record<string, string> | URLSearchParams): Promise<void>;
}

export type SystemRole = "system";

export type AuthenticationRole =
  | "moderator"
  | "admin"
  | "owner"
  | "patient"
  | "industry"
  | "member"
  | "pharmacy"
  | "clinic"
  | "booster"
  | "developer"
  | "coordinator"
  | "partner"
  | SystemRole;

export interface CalculationSource {
  calculationKey: string;
  title: string;
  description: string;
  anonymous: boolean;
}

export interface CategoryData extends Record<string, unknown> {
  categoryName: string;
  defaultUnit?: string;
  defaultSizes?: ProductSizeData[];
  countryCode?: string;
  order?: number;
  associatedTerms?: string[];
}

export interface Category extends CategoryData {
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expiring {
  expiresAt?: string;
}

export interface FormMetaData extends Record<string, unknown> {}

export interface FormMeta extends FormMetaData {
  formMetaId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActiveIngredientMetrics extends Record<string, unknown> {
  type: string;
  unit: string;
  value: string;
  // If the calculation of cost takes into account the
  // proportion of this vs total active ingredients
  proportional?: boolean;
  mean?: boolean;
  size?: ProductSizeData;
  prefix?: string;
}

export interface ProductMetricData extends Record<string, unknown> {
  productId: string;
  activeIngredients: ActiveIngredientMetrics[];
}

export interface MetricsData
  extends ReportDateData,
    Expiring,
    CalculationConsent {
  products: ProductMetricData[];
  countryCode: string;
  currencySymbol?: string; // "$"
  timezone?: string; // Pacific/Auckland
  anonymous?: boolean;
}

export interface ReportMetricsData extends MetricsData {
  parentReportId?: string;
}

export interface ReportMetrics
  extends ReportMetricsData,
    ReportRoleData,
    Record<string, unknown> {
  metricsId: string;
  reportId: string;
  reportedAt: string;
  createdAt: string;
  updatedAt: string;
  // consent required to be stored
  calculationConsent: CalculationConsentItem[];
}

export type CountryProductMetricDuration = "day" | "month";

export interface CountryProductMetrics extends MetricsData {
  metricsId: string;
  createdAt: string;
  updatedAt: string;
  currencySymbol: string; // "$"
  timezone: string;
  duration: CountryProductMetricDuration;
  reportingDateKey: keyof ReportDateData;
}

export interface OrganisationBaseData extends Record<string, unknown> {
  countryCode?: string; // "NZ"
  location?: string;
  remote?: boolean;
  onsite?: boolean;
  pharmacy?: boolean;
  delivery?: boolean;
  clinic?: boolean;
  website?: string;
  associatedBrandingTerms?: string[]; // Eg common names used to refer to the organisation by way of brand
}

export interface OrganisationData extends OrganisationBaseData {
  organisationName: string;
  partnerId?: string;
  approved?: boolean;
  approvedAt?: string;
}

export interface Organisation extends OrganisationData {
  organisationId: string;
  createdAt: string;
  updatedAt: string;
  approvedByUserId?: string;
}

export interface PartnerData extends Record<string, unknown> {
  partnerName: string;
  countryCode?: string;
}

export interface AddPartnerData extends PartnerData, OrganisationBaseData {}

export interface Partner extends PartnerData {
  partnerId: string;
  organisationId: string;
  accessToken?: string;
  createdAt: string;
  updatedAt: string;
  approved?: boolean;
  approvedAt?: string;
  approvedByUserId?: string;
}

export interface ProductSizeData extends Record<string, unknown> {
  value: string;
  unit: string;
}

export interface ProductInfo {
  title?: string;
  text: string;
  url?: string;
  description?: string;
}

export interface ProductData extends Record<string, unknown> {
  productName: string;
  order?: number;
  countryCode?: string;
  organisationId?: string;
  licencedOrganisationId?: string;
  // Flag for products we don't have the exact licence date for
  licenceApprovedBeforeGivenDate?: boolean;
  licenceApprovedAt?: string;
  licenceExpiredAt?: string;
  licenceApprovalWebsite?: string;
  // ISO 3166-1 alpha-3 country code
  licenceCountryCode?: string;
  // Flag for products we don't have the exact availability date for
  availableBeforeGivenDate?: boolean;
  availableAt?: string;
  // For products that we will no longer have available
  availableUntil?: string;
  sizes?: ProductSizeData[];
  // Direct text about the active ingredients, not specific values
  activeIngredientDescriptions?: string[];
  categoryId?: string;
  generic?: boolean;
  branded?: boolean;
  genericSearchTerm?: string;
  genericCategoryNames?: string[];
  genericAcronym?: string;
  info?: ProductInfo[];
  obsoleteAt?: string;
}

export interface ProductActiveIngredient {
  type: string;
  unit: string;
  value: string;
  prefix?: string;
  calculated?: boolean;
  calculatedUnit?: string;
  size?: ProductSizeData;
  proportional?: boolean;
}

export interface Product extends ProductData {
  productId: string;
  createdAt: string;
  updatedAt: string;
  activeIngredients?: ProductActiveIngredient[];
}

export interface ReportDateData {
  orderedAt?: string;
  shippedAt?: string;
  receivedAt?: string;
  updatedAt?: string;
  createdAt?: string;
  reportedAt?: string;
}

export interface CalculationConsentItem extends Record<string, unknown> {
  calculationKey: string;
  consented?: boolean;
  consentedAt?: string;
}

export interface CalculationConsent {
  calculationConsent?: CalculationConsentItem[];
}

export interface ReportRoleData {
  roles: AuthenticationRole[];
}

export type ReportType = "product-purchase" | "product";

export interface ReportData
  extends ReportDateData,
    Expiring,
    CalculationConsent,
    Record<string, unknown> {
  type: ReportType | string;
  countryCode: string; // "NZ"
  currencySymbol?: string; // "$"
  timezone?: string; // Pacific/Auckland
  note?: string;
  parentReportId?: string;
  productId?: string;
  productName?: string; // Actual productName, not free text
  productText?: string; // User free text of the product
  productSize?: ProductSizeData;
  createdByUserId?: string;
  anonymous?: boolean;
  productTotalCost?: string | number; // "908.50", capture the user input raw
  productItems?: string | number; // "2", capture the user input raw
  productItemCost?: string | number; // "450", capture the user input raw
  productDeliveryCost?: string | number; // "8.50", capture the user input raw
  productFeeCost?: string | number; // "3.50", capture the user input raw
  productOrganisationId?: string;
  productOrganisationName?: string; // Actual organisationName, not free text
  productOrganisationText?: string; // User free text of the organisationName
  // TODO No longer used fields, but keeping around until v1.0.0
  productPurchase?: boolean;
  productPurchaseTotalCost?: string | number; // "908.50", capture the user input raw
  productPurchaseItems?: string | number; // "2", capture the user input raw
  productPurchaseItemCost?: string | number; // "450", capture the user input raw
  productPurchaseDeliveryCost?: string | number; // "8.50", capture the user input raw
  productPurchaseFeeCost?: string | number; // "3.50", capture the user input raw
  productPurchaseOrganisationId?: string;
  productPurchaseOrganisationName?: string; // Actual organisationName, not free text
  productPurchaseOrganisationText?: string; // User free text of the organisationName
}

export interface Report extends ReportData, ReportRoleData {
  reportId: string;
  createdAt: string;
  updatedAt: string;
  reportedAt: string;
  reports?: Report[];
}

export interface SystemLogData extends Record<string, unknown> {
  uniqueCode?: string;
  value?: number;
  partnerId: string;
  message: string;
  timestamp?: string;
  action?: string;
}

export interface SystemLog extends SystemLogData {
  systemLogId: string;
  timestamp: string;
}
```

[//]: # "typescript client"

### Local Development

#### `mkcert`

[`mkcert`](https://github.com/FiloSottile/mkcert) is used
to setup local https
