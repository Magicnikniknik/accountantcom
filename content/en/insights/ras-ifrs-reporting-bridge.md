---
title: "How to build a RAS-to-IFRS reporting bridge that rolls forward"
description: "A controlled architecture for mapping Russian accounting records to IFRS or group reporting without rebuilding the transformation every period."
summary: "The bridge should preserve the local ledger, isolate approved adjustments and show exactly how each transformed balance reaches the group reporting line."
type: insights
translationKey: ras-ifrs-reporting-bridge
date: 2026-08-30
lastmod: 2026-08-30
weight: 20
faq:
  - question: "Should IFRS adjustments be posted into the Russian statutory ledger?"
    answer: "Not by default. A controlled transformation layer usually preserves the statutory ledger and records approved reporting adjustments separately, unless a specific local correction is also required."
  - question: "What makes an adjustment reproducible?"
    answer: "A stable identifier, policy reference, source data, calculation, preparer and reviewer, period movement and evidence link should allow the next-period team to roll it forward and challenge it."
---

The weakest RAS-to-IFRS files look sophisticated but have no stable architecture: tabs are copied, formulas break, prior-period adjustments are mixed with current movements and nobody can explain why the group balance differs from the Russian ledger.

A durable bridge treats transformation as a controlled subledger. It keeps local records intact, stores each reporting adjustment with evidence and produces a clear reconciliation to the group package.

## The minimum data model

For every mapped balance, preserve:

1. local account and analytical dimensions;
2. closing balance from the locked local ledger;
3. group account and reporting line;
4. recurring and period-specific adjustments;
5. transformed closing balance;
6. elimination or consolidation input, where relevant;
7. supporting schedule and review status.

Mapping and adjustment logic should not be hidden inside one formula. They solve different problems and should be controlled separately.

## The adjustment register

Give each adjustment a stable code and classify it as opening balance, recurring, reversal, current-period movement or reclassification. A useful register includes the accounting topic, debit/credit group lines, currency, amount, calculation method, source, preparer, reviewer and status.

The opening position must reconcile to the prior issued package. Then show separately:

**opening transformed balance + current movement + current adjustments = closing transformed balance.**

This roll-forward prevents the common failure where a cumulative adjustment is mistakenly posted again as a new-period movement.

## Controls that matter

- The mapped local balances must reconcile to the locked trial balance.
- Total debits and credits of transformation entries must balance.
- Opening transformed balances must equal the prior approved closing package.
- Intercompany balances should be matched by counterparty before consolidation.
- Manual overrides and formula changes should be listed, not buried.
- Each material adjustment should have a reviewer and evidence link.
- The final reporting forms must reconcile to the transformation output.

## Separate accounting conclusions from file mechanics

A technically clean workbook cannot determine whether an IFRS adjustment is correct. Recognition, measurement and presentation depend on the applicable IFRS Accounting Standards, the facts and group accounting policies. The [IFRS Foundation standards navigator](https://www.ifrs.org/issued-standards/) is the authoritative public starting point for current IFRS materials.

The operating file should therefore show the source and approval of the accounting conclusion rather than present a spreadsheet convention as professional authority.

## Ownership and close calendar

Define who owns local closing, source schedules, accounting conclusions, transformation entries, group upload and final review. Place these tasks in the same close calendar used for the [monthly close package](/en/insights/monthly-close-package-russia/). Transformation cannot be reliable if the local source balances are still moving without version control.

For recurring implementation, see [RAS and IFRS Parallel Reporting](/en/services/ras-ifrs-parallel-reporting/) and [IFRS Reporting Services](/en/services/ifrs-services/).
