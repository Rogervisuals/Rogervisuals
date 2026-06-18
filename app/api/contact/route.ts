import { NextResponse } from "next/server";
import {
  sendContactEmail,
  type ContactFormSubmission,
} from "@/lib/contact/send-contact-email";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const raw = body as Partial<ContactFormSubmission>;
  const submission: ContactFormSubmission = {
    name: String(raw.name ?? ""),
    email: String(raw.email ?? ""),
    company: String(raw.company ?? ""),
    projectType: String(raw.projectType ?? ""),
    budget: String(raw.budget ?? ""),
    message: String(raw.message ?? ""),
  };

  const result = await sendContactEmail(submission);

  if ("error" in result) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status ?? 500 }
    );
  }

  return NextResponse.json({ success: true });
}
