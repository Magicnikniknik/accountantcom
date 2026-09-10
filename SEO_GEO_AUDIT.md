# Accountant & Co. — SEO/GEO audit and remediation

Date: 2026-08-30

Production source: `Magicnikniknik/accountantcom`

Domain: `https://accountantandco.com/`

## Executive finding

The site had a technically useful bilingual foundation, but its public identity was diluted by legacy IT/ESG/cyber pages, stale search snippets and unsupported trust claims stored in translations and machine-readable files. The contact template existed but was never rendered because both contact pages used the wrong Hugo content type.

This branch converts the site into one coherent accounting/reporting entity and adds the evidence-led content needed for search engines and answer engines to understand its expertise.

## Critical issues found

| Priority | Finding | Risk | Remediation in this branch |
|---|---|---|---|
| Critical | `accountantandco` and `accountantcom` repositories represent different generations of the site | Editing the wrong repository would not change production | Work is isolated to `Magicnikniknik/accountantcom` |
| Critical | Contact pages used `type: page`, so `layouts/contacts/single.html` and the Netlify form were not rendered | Visitors had no conversion form | Correct content type, rebuilt accessible form, honeypot, consent and lead analytics |
| Critical | Machine-readable files asserted `Accountant & Co., Inc.` without verified entity data | Entity inconsistency and legal/trust risk | Removed unverified `legalName` from schema, AI overview and `llms.txt` |
| High | Indexable cyber, IT infrastructure, ESG, apps and thin business-support pages contradicted the accounting entity | Topical dilution and confusing search/AI answers | Added `noindex,follow` and sitemap exclusion; curated service hub shows only core services |
| High | Hidden translations contained unverified claims: 1,200 projects, activity since the 1990s, insured liability, 24/7 support | False or unverifiable E-E-A-T signals | Reduced i18n files to the translations actually used by current layouts |
| High | Cross-border page promised guaranteed compliance, bank outcomes and absence of tax claims | Credibility, regulatory and legal risk | Rewritten as documentation-led finance support with explicit boundaries |
| High | Homepage mixed accounting with adjacent legacy topics and generic claims | Weak positioning and conversion | Rebuilt around a traceable reporting chain, recurring deliverables and clear audience |
| Medium | No expert content hub or Article/FAQ schema | Weak topical depth for SEO and GEO | Added four bilingual operating guides, Article schema and fact-based FAQ schema |
| Medium | Services navigation linked directly to one page | Incomplete discovery and weak internal hierarchy | Added bilingual service hub; navigation and footer now link to hubs |

## New information architecture

- `/en|ru/` — accounting and reporting proposition
- `/en|ru/services/` — curated service hub
- `/en|ru/services/...` — nine core service pages
- `/en|ru/insights/` — expert operating guides
- `/en|ru/contacts/` — working brief and contact details
- `/llms.txt`, `/services.json`, `/ai-overview.html` — aligned machine-readable context

## GEO approach

The changes are designed for retrieval and quotation, not keyword stuffing:

- one stable organization `@id` across WebSite, WebPage, Service and Article data;
- explicit service boundaries and authoritative-source boundaries;
- bilingual `hreflang` and translation keys;
- question/answer blocks whose answers are also visible on the page;
- first-party operating guides with checklists, tables and reproducible controls;
- aligned `llms.txt`, service graph and AI overview;
- removal of contradictory entities and sensational promises.

## Facts still required from the owner

These should not be invented. Until supplied, they remain deliberately absent from public schema and marketing claims:

1. Exact contracting legal entity, legal form, registration jurisdiction, INN/KPP/OGRN and registered address.
2. Whether Nagatinskaya St. 16 is an office open to visitors, a mailing address or only an operational location.
3. Named team members, roles, real qualifications and professional memberships that may be published.
4. Whether professional liability insurance exists, including insurer, policy scope and validity period.
5. Two to four real, consented or safely anonymized accounting/IFRS/due-diligence cases with scope, starting situation, deliverables and measurable result.
6. Exact service-level response commitments, only if contractually supported.

The current legal pages still name `Accountant & Co., Inc.`. They should be rewritten only after item 1 is confirmed; silently replacing a legal party with a guessed entity would be worse than the current inconsistency.

## Post-release actions

1. Submit the new sitemap in Google Search Console and Yandex Webmaster.
2. Request recrawl of both homepages, service hubs, contact pages and the eight insight URLs.
3. Use URL removal only for legacy pages that remain visible in results after `noindex` is deployed.
4. Monitor indexed pages, canonical selection, form submissions and organic landing pages for 6–8 weeks.
5. Add verified team/entity/case data as soon as the owner supplies it; this is the remaining E-E-A-T bottleneck.
