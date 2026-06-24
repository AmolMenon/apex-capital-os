import re

with open("frontend/lib/api.ts", "r") as f:
    content = f.read()

playbook_methods = """
  // --- FUND PLAYBOOK ENGINE ---
  getPlaybookStatus: async () => {
    return fetchAPI('/playbooks/status');
  },
  getPlaybooks: async () => {
    return fetchAPI('/playbooks');
  },
  getDefaultPlaybooks: async () => {
    return fetchAPI('/playbooks/defaults');
  },
  getPlaybook: async (playbookId: string) => {
    return fetchAPI(`/playbooks/${playbookId}`);
  },
  activatePlaybook: async (playbookId: string) => {
    return fetchAPI('/playbooks/activate', {
      method: 'POST',
      body: JSON.stringify({ playbook_id: playbookId })
    });
  },
  simulateDealAcrossPlaybooks: async (dealId: string) => {
    return fetchAPI(`/playbooks/simulate/deal/${dealId}`, { method: 'POST' });
  },
  comparePlaybooks: async (playbookA: string, playbookB: string) => {
    return fetchAPI('/playbooks/compare', {
      method: 'POST',
      body: JSON.stringify({ playbookA, playbookB })
    });
  },
"""

# Insert right before the last closing brace in the `export const api = { ... };` object.
content = re.sub(r'(\s*};\s*)$', playbook_methods + r'\1', content)

with open("frontend/lib/api.ts", "w") as f:
    f.write(content)

print("api.ts patched successfully.")
