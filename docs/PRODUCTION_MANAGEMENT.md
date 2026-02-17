# Production Management & Connection Guide

This guide explains how to manage your multi-tenant Payload CMS and connect it to individual client websites.

## 🔗 Connecting Client Websites

Each client website (e.g., in a separate repository) connects to the CMS using three methods:

### 1. Environment Variables (Frontend)

In the client website's `.env`, add:

```bash
PAYLOAD_API_URL=https://misrut.cms.yourdomain.com
PAYLOAD_API_KEY=your-tenant-specific-api-key
```

### 2. Fetching Data

Use standard fetch with the API key:

```typescript
const res = await fetch(`${process.env.PAYLOAD_API_URL}/api/pages?where[slug][equals]=home`, {
  headers: {
    Authorization: `users API-Key ${process.env.PAYLOAD_API_KEY}`,
  },
})
```

### 3. Automatic Updates (Webhooks)

When you publish content in the CMS, it can trigger a rebuild of the client repo.

- **CMS Setup**: We've added a `webhook` field to the `Tenants` or a global config.
- **Action**: Sending a POST request to `https://api.vercel.com/v1/integrations/deploy/...`

---

## 🛠️ Deploying a New Tenant

1.  **Database**: Create a new schema in your production Postgres.
    ```sql
    CREATE SCHEMA tenant_new_client;
    ```
2.  **Kubernetes**: Apply the deployment manifest with new env vars.
    ```bash
    kubectl create configmap config-new-client --from-literal=tenant-id=new-client
    kubectl create secret generic secrets-new-client --from-literal=database-url=...
    kubectl apply -f deploy/k8s/tenant-deployment.yaml
    ```
3.  **DNS**: Map `new-client.cms.yourdomain.com` to your Cluster Ingress.

---

## 📈 Monitoring

- **Logs**: Use `kubectl logs -f deployment/payload-tenant-new-client`.
- **Dashboards**: Connect Grafana to your cluster to monitor CPU/Memory per tenant.
- **Health**: Access `https://tenant.cms.yourdomain.com/api/health` to verify instance uptime.
