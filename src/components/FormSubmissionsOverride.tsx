'use client'
import React, { useEffect, useState } from 'react'
import { useDocumentInfo, useField } from '@payloadcms/ui'

export const FormSubmissionsOverride: React.FC = () => {
  const { savedDocumentData, data: liveData, id, collectionSlug } = useDocumentInfo()
  const [isMounted, setIsMounted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Explicitly link to the status field
  const { value: currentStatus, setValue } = useField<string>({ path: 'status' })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  const doc = savedDocumentData || liveData
  const rows = doc?.submissionData || []
  const activeStatus = currentStatus || doc?.status || 'new'

  const activeCheckboxes: string[] = []
  const contactDetails: { label: string; value: string }[] = []
  const contactKeywords = ['name', 'email', 'company', 'phone', 'message']

  if (Array.isArray(rows)) {
    rows.forEach((row: any) => {
      const val = String(row?.value).toLowerCase()
      if (val === 'true' || val === 'on') {
        activeCheckboxes.push(row.field)
      } else if (contactKeywords.some(key => (row?.field || '').toLowerCase().includes(key)) && row?.value) {
        contactDetails.push({ label: row.field, value: String(row.value) })
      }
    })
  }

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === activeStatus || isSaving) return

    setIsSaving(true)
    
    // Update local UI state immediately
    setValue(newStatus)

    try {
      // Use the dynamically detected collectionSlug from useDocumentInfo
      const slug = collectionSlug || 'form-submissions'
      const response = await fetch(`/api/${slug}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Server responded with ${response.status}: ${errorText}`)
      }
      
      console.log('Lead status permanently updated.')
    } catch (err) {
      console.error('Instant Save Error:', err)
      alert(`Save failed. Please check the browser console (F12) for details.`)
      // Rollback UI state if save failed
      setValue(doc?.status || 'new')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div style={{
      padding: '1.5rem',
      border: '1px solid var(--theme-elevation-150)',
      borderRadius: '12px',
      background: 'var(--theme-elevation-50)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      {/* 1. STATUS SELECTOR */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', alignItems: 'center' }}>
          <h4 style={{ fontSize: '0.7rem', opacity: 0.5, fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>
            Lead Status
          </h4>
          {isSaving && <span style={{ fontSize: '0.6rem', color: 'var(--theme-success-500)', fontWeight: 'bold' }}>SAVING...</span>}
        </div>
        
        <div style={{ display: 'flex', gap: '4px', background: 'var(--theme-elevation-100)', padding: '4px', borderRadius: '8px' }}>
          {['new', 'contacted', 'in-progress'].map((status) => (
            <button
              key={status}
              type="button"
              disabled={isSaving}
              onClick={() => handleStatusChange(status)}
              style={{
                flex: 1,
                padding: '8px 0',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                textTransform: 'capitalize',
                background: activeStatus === status ? 'var(--theme-elevation-800)' : 'transparent',
                color: activeStatus === status ? 'var(--theme-elevation-0)' : 'var(--theme-elevation-500)',
                transition: 'all 0.2s',
              }}
            >
              {status.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* 2. ACTIVE SERVICES (HORIZONTAL) */}
      {activeCheckboxes.length > 0 && (
        <div>
          <h4 style={{ fontSize: '0.7rem', opacity: 0.5, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Active Services
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {activeCheckboxes.map((label, i) => (
              <span key={i} style={{ 
                padding: '4px 12px', 
                background: 'var(--theme-success-500)', 
                color: 'white', 
                borderRadius: '20px', 
                fontSize: '0.75rem', 
                fontWeight: 'bold' 
              }}>
                {label.replace('-', ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 3. CONTACT DETAILS (BOLD & LARGE) */}
      <div>
        <h4 style={{ fontSize: '0.7rem', opacity: 0.5, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Lead Contact
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {contactDetails.map((item, i) => (
            <div key={i} style={{ borderLeft: '3px solid var(--theme-elevation-200)', paddingLeft: '12px' }}>
              <div style={{ fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>
                {item.label.replace('-', ' ')}
              </div>
              <div style={{ fontSize: '1.25rem', color: 'var(--theme-elevation-900)', fontWeight: '700', lineHeight: '1.2' }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
