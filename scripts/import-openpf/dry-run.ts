/**
 * Step 4 — Dry-run report generator
 *
 * Input:  data/import/openpf-members-merge-plan.json
 * Output: Console summary + data/import/openpf-members-report.md
 *
 * Run: pnpm import:openpf:dry-run
 */

import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import type { MergePlan, MergePlanEntry } from './lib/types'

const DATA_DIR = path.resolve(process.cwd(), 'data/import')
const PLAN_FILE = path.join(DATA_DIR, 'openpf-members-merge-plan.json')
const REPORT_FILE = path.join(DATA_DIR, 'openpf-members-report.md')

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pct(n: number, total: number): string {
  if (total === 0) return '0%'
  return `${Math.round((n / total) * 100)}%`
}

function mdTable(headers: string[], rows: string[][]): string {
  const sep = headers.map((h) => '-'.repeat(Math.max(h.length, 3)))
  const lines = [
    `| ${headers.join(' | ')} |`,
    `| ${sep.join(' | ')} |`,
    ...rows.map((r) => `| ${r.join(' | ')} |`),
  ]
  return lines.join('\n')
}

// ─── Console summary ──────────────────────────────────────────────────────────

function printConsoleSummary(plan: MergePlan): void {
  const total = plan.totalProfiles
  console.log('╔═══════════════════════════════════════════════╗')
  console.log('║   OPEN PF — Import Dry-Run Report             ║')
  console.log('╚═══════════════════════════════════════════════╝')
  console.log(`Generated: ${plan.generatedAt}`)
  console.log(`Source:    ${plan.sourceFile}`)
  console.log()
  console.log('── Overview ──────────────────────────────────────')
  console.log(`  Total profiles:     ${total}`)
  console.log(`  → Updates:          ${plan.updates.length} (${pct(plan.updates.length, total)})`)
  console.log(`    • Need review:    ${plan.updates.filter((e) => e.needsReview).length}`)
  console.log(`    • Fields to fill: ${plan.updates.reduce((s, e) => s + e.fieldsToFill.length, 0)}`)
  console.log(`    • Conflicts:      ${plan.updates.reduce((s, e) => s + e.conflicts.length, 0)}`)
  console.log(`  → Creates:          ${plan.creates.length} (${pct(plan.creates.length, total)})`)
  console.log(`  → Failed:           ${plan.failed.length} (${pct(plan.failed.length, total)})`)
  console.log(`  → Unmapped domains: ${plan.unmappedDomains.length}`)
  console.log()

  if (plan.creates.length > 0) {
    console.log('── New members to create ─────────────────────────')
    for (const e of plan.creates) {
      console.log(`  • ${e.slug} — "${e.sourceName ?? '?'}"`)
    }
    console.log()
  }

  if (plan.failed.length > 0) {
    console.log('── Failed extractions ────────────────────────────')
    for (const e of plan.failed) {
      console.log(`  • ${e.slug}: ${e.reason}`)
    }
    console.log()
  }

  if (plan.unmappedDomains.length > 0) {
    console.log('── Unmapped domains ──────────────────────────────')
    for (const d of plan.unmappedDomains) {
      console.log(`  • "${d}"`)
    }
    console.log()
  }
}

// ─── Markdown report ──────────────────────────────────────────────────────────

function buildMarkdownReport(plan: MergePlan): string {
  const total = plan.totalProfiles
  const updatesNeedReview = plan.updates.filter((e) => e.needsReview)
  const updatesClean = plan.updates.filter((e) => !e.needsReview)
  const totalFieldsToFill = plan.updates.reduce((s, e) => s + e.fieldsToFill.length, 0)
  const totalConflicts = plan.updates.reduce((s, e) => s + e.conflicts.length, 0)

  const lines: string[] = []

  // 1. Title
  lines.push('# OPEN PF — Import Dry-Run Report')
  lines.push('')
  lines.push(`> **Generated:** ${plan.generatedAt}`)
  lines.push(`> **Source:** \`${plan.sourceFile}\``)
  lines.push(`> **Status:** DRY-RUN — no writes performed`)
  lines.push('')

  // 2. Executive summary
  lines.push('## 1. Executive Summary')
  lines.push('')
  lines.push(
    `This report covers the automated comparison of **${total} member profiles** scraped from the legacy site [open.pf](https://open.pf) against the current Neon production database.`,
  )
  lines.push('')
  lines.push('**Key findings:**')
  lines.push(`- **${plan.updates.length}** existing members matched (${pct(plan.updates.length, total)})`)
  lines.push(`- **${plan.creates.length}** profiles have no DB match and require creation`)
  lines.push(`- **${plan.failed.length}** profiles could not be extracted`)
  lines.push(`- **${totalFieldsToFill}** empty DB fields can be filled from source data`)
  lines.push(`- **${totalConflicts}** field conflicts require human review`)
  lines.push(`- **${plan.unmappedDomains.length}** source domain labels could not be mapped to DB domains`)
  lines.push('')

  // 3. Statistics
  lines.push('## 2. Statistics')
  lines.push('')
  lines.push(
    mdTable(
      ['Category', 'Count', 'Percentage'],
      [
        ['Total profiles scraped', String(total), '100%'],
        ['Matched (updates)', String(plan.updates.length), pct(plan.updates.length, total)],
        ['  — clean (no review needed)', String(updatesClean.length), pct(updatesClean.length, total)],
        ['  — need review', String(updatesNeedReview.length), pct(updatesNeedReview.length, total)],
        ['New (creates)', String(plan.creates.length), pct(plan.creates.length, total)],
        ['Failed extractions', String(plan.failed.length), pct(plan.failed.length, total)],
        ['Skipped', String(plan.skipped.length), pct(plan.skipped.length, total)],
      ],
    ),
  )
  lines.push('')

  // 4. Matched members — updates
  lines.push('## 3. Matched Members (Updates)')
  lines.push('')
  if (plan.updates.length === 0) {
    lines.push('_No matched members found._')
  } else {
    lines.push(
      mdTable(
        ['Slug', 'Source Name', 'Matched By', 'Needs Review', 'Fields to Fill', 'Conflicts'],
        plan.updates.map((e) => [
          e.slug,
          e.sourceName ?? '—',
          e.matchInfo.matchedBy ?? '—',
          e.needsReview ? '⚠️ YES' : '✅ no',
          e.fieldsToFill.map((f) => f.field).join(', ') || '—',
          e.conflicts.map((c) => c.field).join(', ') || '—',
        ]),
      ),
    )
  }
  lines.push('')

  // 5. Fields to fill detail
  lines.push('## 4. Fields to Fill (Safe Updates)')
  lines.push('')
  lines.push('These DB fields are currently empty but have data available from the source.')
  lines.push('')
  const withFills = plan.updates.filter((e) => e.fieldsToFill.length > 0)
  if (withFills.length === 0) {
    lines.push('_No empty fields to fill._')
  } else {
    for (const e of withFills) {
      lines.push(`### ${e.slug}`)
      for (const f of e.fieldsToFill) {
        lines.push(`- **${f.field}**: \`${f.value}\``)
      }
      lines.push('')
    }
  }

  // 6. Conflicts
  lines.push('## 5. Field Conflicts (Require Human Review)')
  lines.push('')
  lines.push('These fields differ between the source and the DB. A human must decide which value to keep.')
  lines.push('')
  const withConflicts = plan.updates.filter((e) => e.conflicts.length > 0)
  if (withConflicts.length === 0) {
    lines.push('_No conflicts detected._')
  } else {
    for (const e of withConflicts) {
      lines.push(`### ${e.slug} (${e.sourceName ?? '?'})`)
      lines.push('')
      lines.push(
        mdTable(
          ['Field', 'Source Value', 'DB Value'],
          e.conflicts.map((c) => [c.field, c.sourceValue, c.dbValue]),
        ),
      )
      lines.push('')
    }
  }

  // 7. New members (creates)
  lines.push('## 6. New Members (Creates)')
  lines.push('')
  lines.push('These profiles have no match in the DB. All require admin review before import.')
  lines.push('')
  if (plan.creates.length === 0) {
    lines.push('_No new members to create._')
  } else {
    lines.push(
      mdTable(
        ['Slug', 'Source Name', 'Email', 'Website', 'Domains'],
        plan.creates.map((e) => {
          // The clean profile data is embedded in the plan entry as top-level fields
          return [
            e.slug,
            e.sourceName ?? '—',
            '(see clean JSON)',
            '(see clean JSON)',
            e.mappedDomains.length > 0
              ? e.mappedDomains.map((d) => d.sourceLabel).join(', ')
              : '—',
          ]
        }),
      ),
    )
  }
  lines.push('')

  // 8. Failed extractions
  lines.push('## 7. Failed Extractions')
  lines.push('')
  if (plan.failed.length === 0) {
    lines.push('_All profiles extracted successfully._')
  } else {
    lines.push(
      mdTable(
        ['Slug', 'Source URL', 'Reason'],
        plan.failed.map((e) => [e.slug, e.sourceUrl, e.reason]),
      ),
    )
  }
  lines.push('')

  // 9. Domain mapping
  lines.push('## 8. Domain Mapping')
  lines.push('')
  lines.push('### 8.1 Unmapped Domains')
  lines.push('')
  if (plan.unmappedDomains.length === 0) {
    lines.push('_All source domain labels were successfully mapped to DB domains._')
  } else {
    lines.push('The following source labels could not be matched to any DB domain:')
    lines.push('')
    for (const d of plan.unmappedDomains) {
      lines.push(`- \`${d}\``)
    }
  }
  lines.push('')
  lines.push('### 8.2 Domain mapping per profile (updates)')
  lines.push('')
  const domainLines: string[][] = []
  for (const e of plan.updates) {
    for (const d of e.mappedDomains) {
      domainLines.push([
        e.slug,
        d.sourceLabel,
        d.domainId ?? '❌ unmapped',
        d.exact ? '✅ exact' : d.domainId ? '⚠️ fuzzy' : '❌ none',
      ])
    }
  }
  if (domainLines.length === 0) {
    lines.push('_No domain mappings for updates._')
  } else {
    lines.push(mdTable(['Member Slug', 'Source Label', 'Mapped Domain ID', 'Match Type'], domainLines))
  }
  lines.push('')

  // 10. Suggested action plan
  lines.push('## 9. Suggested Action Plan')
  lines.push('')
  lines.push(
    '1. **Review conflicts** (Section 5) — for each conflicting field, decide whether source or DB value is authoritative.',
  )
  lines.push(
    '2. **Review new members** (Section 6) — validate each profile before creating it in the DB.',
  )
  lines.push(
    '3. **Fix unmapped domains** (Section 8.1) — add missing domains to the `activity_domains` table or update the `mapDomain` function.',
  )
  lines.push(
    '4. **Apply safe fills** (Section 4) — run a controlled update script for `fieldsToFill` entries, these are non-destructive.',
  )
  lines.push(
    '5. **Re-run extraction** for failed profiles (Section 7) — check if the source pages are accessible.',
  )
  lines.push('')

  // 11. Risk assessment
  lines.push('## 10. Risk Assessment')
  lines.push('')
  lines.push(
    mdTable(
      ['Risk', 'Level', 'Count', 'Mitigation'],
      [
        [
          'Data conflicts',
          totalConflicts > 10 ? '🔴 High' : totalConflicts > 0 ? '🟡 Medium' : '🟢 Low',
          String(totalConflicts),
          'Manual review of each conflict before applying',
        ],
        [
          'New members without validation',
          plan.creates.length > 5 ? '🟡 Medium' : '🟢 Low',
          String(plan.creates.length),
          'Admin review required before any CREATE',
        ],
        [
          'Unmapped domains',
          plan.unmappedDomains.length > 0 ? '🟡 Medium' : '🟢 Low',
          String(plan.unmappedDomains.length),
          'Update domain table or mapDomain() before import',
        ],
        [
          'Extraction failures',
          plan.failed.length > 0 ? '🟡 Medium' : '🟢 Low',
          String(plan.failed.length),
          'Manual check of source URLs',
        ],
      ],
    ),
  )
  lines.push('')

  // 12. Methodology
  lines.push('## 11. Methodology')
  lines.push('')
  lines.push('### Data collection')
  lines.push(
    '- Archive pages `/adherents/` through `/adherents/page/6/` crawled with 500ms delay between requests',
  )
  lines.push('- Each profile page fetched with 600ms delay, 10s timeout')
  lines.push('- HTML parsed with regex/string operations (no external DOM parser)')
  lines.push('- User-Agent: `OPEN-PF-Import/1.0 (migration script)`')
  lines.push('')
  lines.push('### Matching strategy (priority order)')
  lines.push('1. Slug match (exact)')
  lines.push('2. Normalized name match (case-insensitive)')
  lines.push('3. Email match via memberContacts table')
  lines.push('4. Normalized website URL match')
  lines.push('')
  lines.push('### Domain mapping')
  lines.push(
    'Source labels are normalized (trim, slash spacing, HTML entities) then matched against DB labels with exact-first, fuzzy-fallback strategy.',
  )
  lines.push('')

  // 13. Data quality
  lines.push('## 12. Data Quality Notes')
  lines.push('')
  lines.push('- Some source pages may have incomplete contact information (address or phone missing)')
  lines.push('- Logo URLs point to the legacy WordPress CDN (`open.pf/wp-content/uploads/`) and may require re-hosting')
  lines.push('- Phone numbers are in local Polynesian format (8 digits, no country code) — verify before import')
  lines.push('- Presentation texts contain raw HTML entities that have been decoded')
  lines.push('')

  // 14. Files generated
  lines.push('## 13. Files Generated')
  lines.push('')
  lines.push(
    mdTable(
      ['File', 'Description'],
      [
        ['`data/import/openpf-member-urls.json`', 'All discovered member URLs'],
        ['`data/import/openpf-members-raw.json`', 'Raw extracted profiles (before normalization)'],
        ['`data/import/openpf-members-clean.json`', 'Normalized profiles ready for comparison'],
        ['`data/import/openpf-members-merge-plan.json`', 'Full merge plan with matches and conflicts'],
        ['`data/import/openpf-members-report.md`', 'This report'],
      ],
    ),
  )
  lines.push('')

  // 15. Next steps
  lines.push('## 14. Next Steps')
  lines.push('')
  lines.push('Before running the actual import (which does NOT exist yet — this is dry-run only):')
  lines.push('')
  lines.push('- [ ] Review and approve the merge plan with the bureau')
  lines.push('- [ ] Resolve all field conflicts (Section 5)')
  lines.push('- [ ] Validate all new member profiles (Section 6)')
  lines.push('- [ ] Fix unmapped domain labels (Section 8.1)')
  lines.push('- [ ] Decide on logo re-hosting strategy (Vercel Blob vs keeping legacy URLs)')
  lines.push('- [ ] Write and test a controlled `apply-import.ts` script with transaction support')
  lines.push('- [ ] Run `apply-import.ts` in a staging environment first')
  lines.push('- [ ] Get sign-off before running on production')
  lines.push('')

  // 16. Appendix
  lines.push('## 15. Appendix — All Profiles')
  lines.push('')
  lines.push(
    mdTable(
      ['Slug', 'Source Name', 'Action', 'Match', 'Review?', 'Fields to Fill', 'Conflicts'],
      [
        ...plan.updates.map(entryRow),
        ...plan.creates.map(entryRow),
        ...plan.failed.map(entryRow),
        ...plan.skipped.map(entryRow),
      ],
    ),
  )
  lines.push('')

  return lines.join('\n')
}

function entryRow(e: MergePlanEntry): string[] {
  return [
    e.slug,
    e.sourceName ?? '—',
    e.action,
    e.matchInfo.matchedBy ?? '—',
    e.needsReview ? '⚠️ YES' : '✅ no',
    e.fieldsToFill.map((f) => f.field).join(', ') || '—',
    e.conflicts.map((c) => c.field).join(', ') || '—',
  ]
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main(): void {
  console.log('=== OPEN PF — Dry-Run Report ===\n')

  const plan = JSON.parse(readFileSync(PLAN_FILE, 'utf-8')) as MergePlan

  printConsoleSummary(plan)

  const report = buildMarkdownReport(plan)
  writeFileSync(REPORT_FILE, report, 'utf-8')

  console.log(`\nReport written to: ${REPORT_FILE}`)
}

main()
