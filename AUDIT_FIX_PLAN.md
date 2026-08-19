# GEO / AI audit remediation

This file records the remediation applied on 2026-08-19 so the public site can be checked against the supplied GEO audit.

## Audit findings and remediation

1. **Thin entity/schema** — enrich the site-wide `ProfessionalService` entity with legal/contact facts, Moscow address, telephone, email, service catalog, languages and area served. Keep page-level `Service` schema for service pages and expose starting price where a page publishes it.
2. **Thin or vague content** — rewrite the EN/RU home pages around accounting, reporting, IFRS, tax coordination, due diligence and cross-border finance. Expand the core accounting, financial-review/audit-support and IFRS pages with explicit scope, deliverables, pricing, process and source boundaries.
3. **Entity confusion** — remove the homepage positioning that mixes the primary accounting brand with cyber-defense / IT-infrastructure messaging. Those subjects may remain separate secondary pages, but they are not the primary homepage entity definition.
4. **LLM context** — `static/llms.txt` and `static/services.json` are public machine-readable sources and are updated to match the same entity and service scope.
5. **NAP** — publish the contact facts already present on the site/legal pages consistently in JSON-LD, contacts and footer: Accountant & Co., Nagatinskaya St. 16, Moscow 115487, Russia; +7 (930) 335-69-26; partners@accountantandco.com.
6. **Root redirect** — configure a Netlify server-side `301` from `/` to `/en/` rather than relying on Hugo's generated language redirect page.
7. **YMYL boundary** — remove unsubstantiated wording such as a blanket claim that the business is a “regulated entity”; distinguish advisory/review/audit-support work from statutory audit or other regulated professional opinions unless an appropriately authorized provider is explicitly identified.

## Source discipline

Public service pages should distinguish published company facts from general educational information. Russian tax/registration references should point readers to the Federal Tax Service of Russia; IFRS references should point to the IFRS Foundation. Current official requirements take precedence over marketing copy.
