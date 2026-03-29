import { inngest } from "@/lib/inngest";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const { organizationId } = await request.json();

  if (!organizationId)
    return NextResponse.json(
      { error: "Organization ID is required" },
      { status: 400 },
    );

  await inngest.send({
    name: "app/organization.deleted",
    data: {
      organizationId,
    },
  });

  return NextResponse.json({ success: true });
};
