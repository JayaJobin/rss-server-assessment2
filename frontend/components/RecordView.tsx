"use client";

import { useRecordRecentlyViewed } from "./useRecentlyViewed";

// Renders nothing — just records that `slug` was opened, so the parent
// post page can stay a server component while this sliver handles the
// client-only localStorage write.
export default function RecordView({ slug }: { slug: string }) {
  useRecordRecentlyViewed(slug);
  return null;
}
