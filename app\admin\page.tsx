import { requireChatGPTUser } from "../chatgpt-auth";
import { isAdmin } from "../../db/content";
import AdminEditor from "./AdminEditor";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireChatGPTUser("/admin");
  if (!isAdmin(user.email)) return <main className="adminDenied"><h1>Access denied</h1><p>This dashboard is available only to the portfolio owner.</p><a href="/">Return to portfolio</a></main>;
  return <AdminEditor />;
}
