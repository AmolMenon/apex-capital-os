import re

with open("frontend/lib/api.ts", "r") as f:
    content = f.read()

data_room_methods = """
  // Data Room
  getDataRoomStatus: () => fetchAPI<any>("/data-room/status"),
  uploadDataRoomDocument: async (id: string | number, file: File, category: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    // Cannot use fetchAPI directly for FormData due to Content-Type headers being automatically set incorrectly by fetchAPI wrapper
    const activeId = resolveId(id);
    const response = await fetch(`${API_URL}/data-room/deals/${activeId}/upload`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to upload document");
    return response.json();
  },
  getDataRoomDocuments: (id: string | number) => fetchAPI<any[]>(`/data-room/deals/${resolveId(id)}/documents`),
  parseDataRoom: (id: string | number) => fetchAPI<any>(`/data-room/deals/${resolveId(id)}/parse`, { method: "POST" }),
  getDataRoomReport: (id: string | number) => fetchAPI<any>(`/data-room/deals/${resolveId(id)}/report`),
  getDataRoomMetrics: (id: string | number) => fetchAPI<any[]>(`/data-room/deals/${resolveId(id)}/metrics`),
  getDataRoomContradictions: (id: string | number) => fetchAPI<any[]>(`/data-room/deals/${resolveId(id)}/contradictions`),
  getDataRoomCompleteness: (id: string | number) => fetchAPI<any>(`/data-room/deals/${resolveId(id)}/completeness`),
  getPrivateEvidenceGraph: (id: string | number) => fetchAPI<any>(`/data-room/deals/${resolveId(id)}/evidence-graph`),
"""

if "getDataRoomStatus" not in content:
    content = content.replace("export const api = {", "export const api = {\n" + data_room_methods)
    with open("frontend/lib/api.ts", "w") as f:
        f.write(content)
