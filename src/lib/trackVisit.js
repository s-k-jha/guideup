import api from '../api/client'

const VISITOR_ID_KEY = 'guideup_visitor_id'

function getVisitorId() {
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY)
    if (!id) {
      id = crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
      localStorage.setItem(VISITOR_ID_KEY, id)
    }
    return id
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`
  }
}

/**
 * Fire-and-forget page-view beacon. Never throws, never blocks navigation —
 * a tracking failure must be invisible to the visitor.
 */
export function trackVisit(path) {
  try {
    const params = new URLSearchParams(window.location.search)
    api.post('/track/visit', {
      visitorId: getVisitorId(),
      path,
      referrer: document.referrer || '',
      utmSource: params.get('utm_source') || '',
      utmMedium: params.get('utm_medium') || '',
      utmCampaign: params.get('utm_campaign') || '',
    }).catch(() => {})
  } catch {
    // no-op
  }
}
