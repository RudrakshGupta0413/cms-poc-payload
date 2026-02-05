
export type PayloadInspectorMessage =
  | {
      type: 'PAYLOAD_INSPECTOR_FOCUS'
      collectionSlug: string
      docID: string
      fieldPath: string // e.g. "hero.title" or "sections.0.heading"
    }
  | {
      type: 'PAYLOAD_INSPECTOR_FOCUS_GLOBAL'
      globalSlug: string
      fieldPath: string
    }

export function postFocusToPayloadAdmin(
  msg: PayloadInspectorMessage,
  adminOrigin: string,
) {
  // Only works when embedded in an iframe (Live Preview)
  if (typeof window === 'undefined') return
  if (window.parent === window) return

  window.parent.postMessage(msg, adminOrigin)
}
