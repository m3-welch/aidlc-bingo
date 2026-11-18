import { bearer } from "@/lib/auth";
import { handle } from "@/lib/http";
import { getMyCard } from "@/lib/mobs";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export const GET = async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  return handle(() => getMyCard(id, bearer(req)));
};
