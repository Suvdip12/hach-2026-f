/**
 * Utility functions for multi-tenant architecture
 * Extracts and manages school domain from subdomain
 */

/**
 * Extracts the school domain from the current URL subdomain
 * Examples:
 * - school1.example.com -> "school1"
 * - localhost -> "system" (fallback for development)
 * - example.com -> "system" (fallback for main domain)
 *
 * Special cases:
 * - For localhost development, returns "system" unless subdomain is present
 */
export function getSchoolDomain(): string {
  if (typeof window === "undefined") {
    return "system";
  }

  const hostname = window.location.hostname;

  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("192.168.")
  ) {
    return "system";
  }

  const parts = hostname.split(".");

  if (parts.length >= 3) {
    return parts[0];
  }

  return "system";
}

export function getTenantHeaders(
  customDomain?: string,
): Record<string, string> {
  return {
    "x-school-domain": customDomain || getSchoolDomain(),
  };
}
