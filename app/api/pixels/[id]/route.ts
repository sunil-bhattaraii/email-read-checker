import { connectDB } from "@/lib/db";
import { Pixel } from "@/models/Pixel";
import { getSessionUser } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }
  const result = await Pixel.deleteOne({ pixelId: id, user: user.id }).exec();
  if (result.deletedCount === 0) {
    return Response.json({ error: "Pixel not found." }, { status: 404 });
  }
  return Response.json({ ok: true });
}

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }
  const result = await Pixel.updateOne(
    { pixelId: id, user: user.id },
    { $set: { opens: 0, lastOpenedAt: null } }
  ).exec();
  if (result.matchedCount === 0) {
    return Response.json({ error: "Pixel not found." }, { status: 404 });
  }
  return Response.json({ ok: true });
}
