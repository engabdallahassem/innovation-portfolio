import { getChatGPTUser } from "../../../chatgpt-auth";
import { isAdmin, readSiteContent, writeSiteContent } from "../../../../db/content";
import type { SiteContent } from "../../../content";

async function adminUser() {
  const user = await getChatGPTUser();
  return user && isAdmin(user.email) ? user : null;
}

export async function GET() {
  const user = await adminUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return Response.json({ content: await readSiteContent(), user: user.displayName });
}

export async function PUT(request: Request) {
  const user = await adminUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const content = await request.json() as SiteContent;
  if (!content.headline?.trim() || !Array.isArray(content.projects)) return Response.json({ error: "Invalid content" }, { status: 400 });
  await writeSiteContent(content, user.email);
  return Response.json({ ok: true });
}
