export type AppMode = "user" | "admin" | "full";

export const appMode = (import.meta.env.VITE_APP_MODE as AppMode) || "full";

export const isUserApp = appMode === "user";
export const isAdminApp = appMode === "admin";
export const isFullApp = appMode === "full";

/** URL of the standalone admin dev server (user app links here when split). */
export const adminAppUrl =
  import.meta.env.VITE_ADMIN_APP_URL || "http://localhost:8081";

/** URL of the standalone user dev server (admin app “view site” link). */
export const userAppUrl =
  import.meta.env.VITE_USER_APP_URL || "http://localhost:8080";

export type AdminSegment =
  | ""
  | "rooms"
  | "bookings"
  | "guests"
  | "messages"
  | "reports"
  | "finance"
  | "security"
  | "settings";

export function adminRoute(segment: AdminSegment = ""): string {
  if (isAdminApp) {
    return segment === "" ? "/" : `/${segment}`;
  }
  return segment === "" ? "/admin" : `/admin/${segment}`;
}

export function isAdminRouteActive(pathname: string, segment: AdminSegment): boolean {
  const route = adminRoute(segment);
  if (segment === "") {
    return pathname === route || pathname === `${route}/`;
  }
  return pathname === route || pathname.startsWith(`${route}/`);
}

export const adminPageTitle: Record<AdminSegment, string> = {
  "": "Dashboard",
  rooms: "Room Management",
  bookings: "Allocation Management",
  guests: "Student Management",
  messages: "Communication",
  reports: "Reports & Analytics",
  finance: "Financial Records",
  security: "Security & Audit",
  settings: "Settings",
};

export function activeAdminSegment(pathname: string): AdminSegment {
  const segments: AdminSegment[] = [
    "settings",
    "security",
    "finance",
    "reports",
    "messages",
    "guests",
    "bookings",
    "rooms",
    "",
  ];
  for (const segment of segments) {
    if (isAdminRouteActive(pathname, segment)) return segment;
  }
  return "";
}
