'use client'

import { useState } from 'react'

interface SiteStatsFormProps {
  currentCount: number | null
}

export function SiteStatsForm({ currentCount }: SiteStatsFormProps) {
  const [value, setValue] = useState<string>(currentCount?.toString() ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    const { updateSiteStats } = await import('@/lib/actions/admin/settings')
    await updateSiteStats(value ? parseInt(value, 10) : null)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', maxWidth: '360px' }}>
      <div className="form-field" style={{ flex: 1 }}>
        <label htmlFor="employeeCount">
          Salariés représentés (affiché : &quot;+{value || '?'}&quot;)
        </label>
        <input
          id="employeeCount"
          type="number"
          min="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={handleSave}
        disabled={saving}
        style={{ flexShrink: 0 }}
      >
        {saving ? 'Sauvegarde…' : saved ? '✓ Sauvegardé' : 'Sauvegarder'}
      </button>
    </div>
  )
}
