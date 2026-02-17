

export interface TenantConfig {
    id: string                      // Unique tenant identifier (lowercase, no spaces)
    name: string                    // Display name for the tenant
    domain: string                  // Primary domain (e.g., "misrut.com")
    adminDomain: string             // Admin panel domain (e.g., "admin.misrut.com")
    databaseUrl: string             // PostgreSQL connection string
    port: number                    // Instance port
    payloadSecret: string           // Unique encryption key (generate with: openssl rand -base64 32)
    customConfig?: Record<string, any>  // Optional: Instance-specific Payload config overrides
}

export const tenants: TenantConfig[] = [
    {
        id: 'misrut',
        name: 'Misrut',
        domain: process.env.MISRUT_DOMAIN || 'misrut.local',
        adminDomain: process.env.MISRUT_ADMIN_DOMAIN || 'admin.misrut.local',
        databaseUrl: process.env.MISRUT_DATABASE_URL || 'postgresql://payload:payload@localhost:5433/misrut_db',
        port: parseInt(process.env.MISRUT_PORT || '3001'),
        payloadSecret: process.env.MISRUT_PAYLOAD_SECRET || 'misrut-secret-change-in-production',
        customConfig: {
            collections: ['users', 'media', 'pages'], // Misrut: Pages-only website
        }
    },
    {
        id: 'synrgy',
        name: 'Synrgy',
        domain: process.env.SYNRGY_DOMAIN || 'synrgy.local',
        adminDomain: process.env.SYNRGY_ADMIN_DOMAIN || 'admin.synrgy.local',
        databaseUrl: process.env.SYNRGY_DATABASE_URL || 'postgresql://payload:payload@localhost:5433/synrgy_db',
        port: parseInt(process.env.SYNRGY_PORT || '3002'),
        payloadSecret: process.env.SYNRGY_PAYLOAD_SECRET || 'synrgy-secret-change-in-production',
        customConfig: {
            collections: ['users', 'media', 'posts'], // Synrgy: Blog platform
        }
    },
]

/**
 * Get tenant by ID
 */
export function getTenantById(id: string): TenantConfig | undefined {
    return tenants.find(tenant => tenant.id === id)
}

/**
 * Get tenant by domain
 */
export function getTenantByDomain(domain: string): TenantConfig | undefined {
    return tenants.find(tenant =>
        tenant.domain === domain ||
        tenant.adminDomain === domain
    )
}

/**
 * Get current tenant from environment
 * Used when starting a specific instance
 */
export function getCurrentTenant(): TenantConfig {
    const tenantId = process.env.TENANT_ID

    if (!tenantId) {
        throw new Error('TENANT_ID environment variable is required')
    }

    const tenant = getTenantById(tenantId)

    if (!tenant) {
        throw new Error(`Tenant not found: ${tenantId}`)
    }

    return tenant
}
