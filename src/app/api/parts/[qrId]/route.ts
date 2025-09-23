import { NextResponse } from "next/server";
import { getPartByQrId } from "@/lib/data";

export async function GET(
  req: Request,
  { params }: { params: { qrId: string } }
) {
  try {
    const part = await getPartByQrId(params.qrId);

    if (!part) {
      return NextResponse.json({ error: "Part not found" }, { status: 404 });
    }

    // Only return the internal ID for security/simplicity
    return NextResponse.json({ id: part.id });
  } catch (error) {
    console.error("API Error fetching part by QR ID:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
