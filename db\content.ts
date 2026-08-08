import { env } from "cloudflare:workers";
import { defaultContent, type SiteContent } from "../app/content";

export async function readSiteContent(): Promise<SiteContent> {
  try {
    const row = await env.DB.prepare("SELECT content FROM site_content WHERE id = 1").first<{ content: string }>();
    return row?.content ? { ...defaultContent, ...JSON.parse(row.content) } : defaultContent;
  } catch {
    return defaultContent;
  }
}

export async function writeSiteContent(content: SiteContent, email: string) {
  await env.DB.prepare(`INSERT INTO site_content (id, content, updated_at, updated_by)
    VALUES (1, ?, CURRENT_TIMESTAMP, ?)
    ON CONFLICT(id) DO UPDATE SET content = excluded.content, updated_at = CURRENT_TIMESTAMP, updated_by = excluded.updated_by`)
    .bind(JSON.stringify(content), email)
    .run();
}

export function isAdmin(email: string) {
  return Boolean(env.ADMIN_EMAIL) && email.toLowerCase() === env.ADMIN_EMAIL.toLowerCase();
}
