# Pharmakarma - Node & JavaScript implementation


[//]: # (badges)

### Support

 ![Node.js supported](https://img.shields.io/badge/node-%3E%3D18.7.0-blue) 

### Test Coverage

 ![88.46%25 lines covered](https://img.shields.io/badge/lines-88.46%25-brightgreen) ![88.46%25 statements covered](https://img.shields.io/badge/statements-88.46%25-brightgreen) ![69.09%25 functions covered](https://img.shields.io/badge/functions-69.09%25-yellow) ![82.55%25 branches covered](https://img.shields.io/badge/branches-82.55%25-brightgreen)

[//]: # (badges)

### Client's TypeScript Interface

[//]: # (typescript client)

```typescript
export interface SystemLog extends Record<string, unknown> {
    message: string;
    uniqueCode?: string;
    value?: number;
    partnerId?: string;
    action?: string;
}
export interface PartnerData {
    partnerName: string;
    location: string;
    onsite?: boolean;
    remote?: boolean;
    clinic?: boolean;
    pharmacy?: boolean;
    partnerDescription?: string;
}
export interface Partner extends PartnerData {
    partnerId: string;
    accessToken?: string;
}
export interface CategoryData {
    categoryName: string;
}
export interface Category extends CategoryData {
    categoryId: string;
}
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
    listPartners(): Promise<Partner[]>;
    listSystemLogs(): Promise<SystemLog[]>;
}
```

[//]: # (typescript client)

