'use client'

/**
 * Pattern 2: Click in Live Preview iframe → focus the matching field in the Admin (same window).
 * - Preview iframe posts postMessage({ type: 'PAYLOAD_INSPECTOR_FOCUS', collectionSlug, docID, fieldPath }).
 * - This component (injected into the Edit View) listens for that message and either focuses the field
 *   if we're already on the right doc, or navigates to the doc and then focuses (using sessionStorage).
 */
import * as React from 'react'

type FocusMsg =
  | {
      type: 'PAYLOAD_INSPECTOR_FOCUS'
      collectionSlug: string
      docID: string
      fieldPath: string
    }
  | {
      type: 'PAYLOAD_INSPECTOR_FOCUS_GLOBAL'
      globalSlug: string
      fieldPath: string
    }

const STORAGE_KEY = 'payload:pending-focus'

function getAdminOrigin(): string {
  // safest: hardcode/configure expected origin
  // e.g. process.env.NEXT_PUBLIC_PAYLOAD_ADMIN_ORIGIN in the admin build
  return (window as any).__PAYLOAD_ADMIN_ORIGIN__ || window.location.origin
}

function currentEditContext() {
  // Typical Payload routes:
  // /admin/collections/:collectionSlug/:id
  // /admin/globals/:globalSlug
  const path = window.location.pathname
  const parts = path.split('/').filter(Boolean)

  const idxCollections = parts.indexOf('collections')
  if (idxCollections !== -1 && parts.length >= idxCollections + 3) {
    return {
      kind: 'collection' as const,
      collectionSlug: parts[idxCollections + 1],
      id: parts[idxCollections + 2],
    }
  }

  const idxGlobals = parts.indexOf('globals')
  if (idxGlobals !== -1 && parts.length >= idxGlobals + 2) {
    return { kind: 'global' as const, globalSlug: parts[idxGlobals + 1] }
  }

  return { kind: 'unknown' as const }
}

function navigateToCollectionDoc(collectionSlug: string, docID: string) {
  const url = `/admin/collections/${collectionSlug}/${docID}`
  window.location.assign(url)
}

function navigateToGlobal(globalSlug: string) {
  const url = `/admin/globals/${globalSlug}`
  window.location.assign(url)
}

/**
 * Focus strategy:
 * Payload 3 admin uses:
 * - input/textarea name={path} (e.g. "layout.0.heading")
 * - input/textarea id="field-{path with dots → __}" (e.g. "field-layout__0__heading")
 * We try these first, then fall back to label-based scroll.
 */
function focusField(fieldPath: string): boolean {
  const payloadId = `field-${fieldPath.replace(/\./g, '__')}`
  const selectors = [
    `#${CSS.escape(payloadId)}`,
    `[name="${CSS.escape(fieldPath)}"]`,
    `[data-path="${CSS.escape(fieldPath)}"]`,
    `[data-field-path="${CSS.escape(fieldPath)}"]`,
    `textarea[name="${CSS.escape(fieldPath)}"]`,
    `input[name="${CSS.escape(fieldPath)}"]`,
  ]

  for (const sel of selectors) {
    const el = document.querySelector(sel) as HTMLElement | null
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      ;(el as HTMLInputElement).focus?.()
      return true
    }
  }

  const last = fieldPath.split('.').slice(-1)[0]
  const label = Array.from(document.querySelectorAll('label')).find(
    (l) => (l.textContent || '').trim().toLowerCase() === last.toLowerCase(),
  )
  if (label) {
    label.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return true
  }

  return false
}

/** Try to focus a field, with retries so we catch the form after it has rendered (e.g. blocks). */
function focusFieldWithRetry(fieldPath: string, retries = 3, delayMs = 150) {
  let attempt = 0
  const tryFocus = () => {
    if (focusField(fieldPath)) return
    attempt += 1
    if (attempt < retries) setTimeout(tryFocus, delayMs)
  }
  tryFocus()
}

export default function AdminInspectorBridge() {
  React.useEffect(() => {
    // 1) On mount, if we have a pending focus (after navigation), apply it.
    const pendingRaw = sessionStorage.getItem(STORAGE_KEY)
    if (pendingRaw) {
      sessionStorage.removeItem(STORAGE_KEY)
      try {
        const pending = JSON.parse(pendingRaw) as FocusMsg
        setTimeout(() => focusFieldWithRetry(pending.fieldPath, 5, 200), 300)
      } catch {
        // ignore
      }
    }

    // 2) Listen for focus requests from preview iframe
    function onMessage(event: MessageEvent) {
      // SECURITY: validate origin (don’t accept arbitrary postMessage)
      const expected = getAdminOrigin()
      if (event.origin !== expected) return

      const data = event.data as FocusMsg
      if (!data || typeof data !== 'object') return

      const ctx = currentEditContext()

      if (data.type === 'PAYLOAD_INSPECTOR_FOCUS') {
        // Compare as strings: URL id is always string, docID from frontend may be number (e.g. Postgres)
        const sameDoc =
          ctx.kind === 'collection' &&
          ctx.collectionSlug === data.collectionSlug &&
          String(ctx.id) === String(data.docID)

        if (sameDoc) {
          focusFieldWithRetry(data.fieldPath)
          return
        }

        // otherwise navigate and store pending focus
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        navigateToCollectionDoc(data.collectionSlug, String(data.docID))
        return
      }

      if (data.type === 'PAYLOAD_INSPECTOR_FOCUS_GLOBAL') {
        if (ctx.kind === 'global' && ctx.globalSlug === data.globalSlug) {
          focusFieldWithRetry(data.fieldPath)
          return
        }

        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        navigateToGlobal(data.globalSlug)
      }
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return null
}
