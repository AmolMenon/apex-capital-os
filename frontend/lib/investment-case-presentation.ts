export const StatusMapping: Record<string, { label: string; colorClass: string }> = {
  // Assumption Statuses
  Unverified: { label: "Unverified", colorClass: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  Verified: { label: "Supported", colorClass: "bg-green-100 text-green-800 border-green-200" },
  Invalidated: { label: "Invalidated", colorClass: "bg-red-100 text-red-800 border-red-200" },

  // Conflict Statuses
  OPEN: { label: "Open", colorClass: "bg-orange-100 text-orange-800 border-orange-200" },
  RESOLVED: { label: "Resolved", colorClass: "bg-blue-100 text-blue-800 border-blue-200" },
  CONFIRMED_CONTRADICTION: { label: "Confirmed Contradiction", colorClass: "bg-red-100 text-red-800 border-red-200" },

  // Task Statuses
  PENDING: { label: "Pending", colorClass: "bg-gray-100 text-gray-800 border-gray-200" },
  IN_PROGRESS: { label: "In Progress", colorClass: "bg-blue-100 text-blue-800 border-blue-200" },
  COMPLETED: { label: "Completed", colorClass: "bg-green-100 text-green-800 border-green-200" },
  FAILED: { label: "Failed", colorClass: "bg-red-100 text-red-800 border-red-200" },

  // Finding Effects (Human Readable)
  SUPPORTS_CLAIM_A: { label: "Supports Claim A", colorClass: "bg-blue-50 text-blue-700 border-blue-100" },
  SUPPORTS_CLAIM_B: { label: "Supports Claim B", colorClass: "bg-blue-50 text-blue-700 border-blue-100" },
  RECONCILES_BOTH: { label: "Reconciles Both", colorClass: "bg-green-50 text-green-700 border-green-100" },
  CONFLICT_REMAINS: { label: "Conflict Remains", colorClass: "bg-orange-50 text-orange-700 border-orange-100" },
  INSUFFICIENT_EVIDENCE: { label: "Insufficient Evidence", colorClass: "bg-gray-50 text-gray-700 border-gray-100" },
  SUPPORTS: { label: "Supports", colorClass: "bg-green-50 text-green-700 border-green-100" },
  WEAKENS: { label: "Weakens", colorClass: "bg-orange-50 text-orange-700 border-orange-100" },
  INVALIDATES: { label: "Invalidates", colorClass: "bg-red-50 text-red-700 border-red-100" },
};

export function getStatusPresentation(status: string | null | undefined) {
  if (!status) return { label: "Unknown", colorClass: "bg-gray-100 text-gray-800 border-gray-200" };
  return StatusMapping[status] || { label: status, colorClass: "bg-gray-100 text-gray-800 border-gray-200" };
}
