import { NextRequest, NextResponse } from "next/server";
import { submitDmcaNotice } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { work_title, film_identifier, claimant_name, claimant_email, infringement_details } = body;

    if (!work_title || !film_identifier || !claimant_name || !claimant_email || !infringement_details) {
      return NextResponse.json(
        { error: "All fields are required to process a formal DMCA notice." },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(claimant_email)) {
      return NextResponse.json(
        { error: "Please provide a valid contact email address." },
        { status: 400 }
      );
    }

    const result = await submitDmcaNotice({
      work_title,
      film_identifier,
      claimant_name,
      claimant_email,
      infringement_details,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to submit DMCA notice";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
