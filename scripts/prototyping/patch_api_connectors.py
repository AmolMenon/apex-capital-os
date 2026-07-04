import re

with open("frontend/lib/api.ts", "r") as f:
    content = f.read()

methods = """
  // --- CONNECTOR HUB ---
  getConnectorStatus: async () => fetchAPI('/connectors/status'),
  getConnectorProviders: async () => fetchAPI('/connectors/providers'),
  getProviderStatus: async (provider: string) => fetchAPI(`/connectors/${provider}/status`),
  syncProvider: async (provider: string) => fetchAPI(`/connectors/${provider}/sync`, { method: 'POST' }),
  getConnectorSyncRuns: async () => fetchAPI('/connectors/sync-runs'),
  getConnectorPrivacyPolicy: async () => fetchAPI('/connectors/privacy-policy'),
  getMockEmails: async () => fetchAPI('/connectors/mock/emails'),
  getMockCalendar: async () => fetchAPI('/connectors/mock/calendar'),
  getMockDrive: async () => fetchAPI('/connectors/mock/drive'),
  getMockCRM: async () => fetchAPI('/connectors/mock/crm'),
  getMockSlack: async () => fetchAPI('/connectors/mock/slack'),

  // --- DEAL INBOX ---
  getDealInboxStatus: async () => fetchAPI('/deal-inbox/status'),
  getDealInboxItems: async () => fetchAPI('/deal-inbox/items'),
  getDealInboxItem: async (inboundId: string) => fetchAPI(`/deal-inbox/items/${inboundId}`),
  syncDealInbox: async () => fetchAPI('/deal-inbox/sync', { method: 'POST' }),
  triageInboundDeal: async (inboundId: string) => fetchAPI(`/deal-inbox/items/${inboundId}/triage`, { method: 'POST' }),
  convertInboundToDeal: async (inboundId: string) => fetchAPI(`/deal-inbox/items/${inboundId}/convert-to-deal`, { method: 'POST' }),
  passInboundDeal: async (inboundId: string) => fetchAPI(`/deal-inbox/items/${inboundId}/pass`, { method: 'POST' }),
  watchlistInboundDeal: async (inboundId: string) => fetchAPI(`/deal-inbox/items/${inboundId}/watchlist`, { method: 'POST' }),
  requestInboundInfo: async (inboundId: string) => fetchAPI(`/deal-inbox/items/${inboundId}/request-info`, { method: 'POST' }),
  getInboundDuplicates: async () => fetchAPI('/deal-inbox/duplicates'),
  getInboundPriorityQueue: async () => fetchAPI('/deal-inbox/priority-queue'),

  // --- MEETING INTELLIGENCE ---
  getMeetingsStatus: async () => fetchAPI('/meetings/status'),
  getMeetings: async () => fetchAPI('/meetings'),
  getMeeting: async (meetingId: string) => fetchAPI(`/meetings/${meetingId}`),
  syncCalendarMeetings: async () => fetchAPI('/meetings/sync-calendar', { method: 'POST' }),
  generateMeetingPrep: async (meetingId: string) => fetchAPI(`/meetings/${meetingId}/generate-prep`, { method: 'POST' }),
  uploadMeetingTranscript: async (meetingId: string, payload: any) => fetchAPI(`/meetings/${meetingId}/upload-transcript`, { method: 'POST', body: JSON.stringify(payload) }),
  analyzeMeetingTranscript: async (meetingId: string) => fetchAPI(`/meetings/${meetingId}/analyze-transcript`, { method: 'POST' }),
  getMeetingSummary: async (meetingId: string) => fetchAPI(`/meetings/${meetingId}/summary`),
  getMeetingActionItems: async (meetingId: string) => fetchAPI(`/meetings/${meetingId}/action-items`),
  addPartnerNote: async (meetingId: string, payload: any) => fetchAPI(`/meetings/${meetingId}/partner-note`, { method: 'POST', body: JSON.stringify(payload) }),
  getUpcomingMeetings: async () => fetchAPI('/meetings/queue/upcoming'),
  getMeetingFollowups: async () => fetchAPI('/meetings/queue/followups'),
"""

content = re.sub(r'(\s*};\s*)$', methods + r'\1', content)

with open("frontend/lib/api.ts", "w") as f:
    f.write(content)

print("api.ts patched successfully.")
