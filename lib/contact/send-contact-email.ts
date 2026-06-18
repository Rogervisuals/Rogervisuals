import { Resend } from "resend";

export interface ContactFormSubmission {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  message: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getFromAddress(): string | null {
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!from) return null;
  if (from.includes("<")) return from;
  return `Rogervisuals <${from}>`;
}

function getContactEmail(): string | null {
  return process.env.CONTACT_EMAIL?.trim() || null;
}

export function validateContactSubmission(
  data: ContactFormSubmission
): { ok: true; data: ContactFormSubmission } | { ok: false; error: string } {
  const name = data.name.trim();
  const email = data.email.trim();
  const company = data.company.trim();
  const projectType = data.projectType.trim();
  const budget = data.budget.trim();
  const message = data.message.trim();

  if (!name || !email || !projectType || !budget || !message) {
    return { ok: false, error: "Please fill in all required fields." };
  }

  if (!isValidEmail(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  return {
    ok: true,
    data: { name, email, company, projectType, budget, message },
  };
}

export async function sendContactEmail(
  data: ContactFormSubmission
): Promise<{ success: true } | { error: string; status?: number }> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = getFromAddress();
  const toEmail = getContactEmail();

  if (!apiKey || !fromEmail || !toEmail) {
    return {
      error: "Email is not configured yet. Please try again later.",
      status: 503,
    };
  }

  const validated = validateContactSubmission(data);
  if (!validated.ok) {
    return { error: validated.error, status: 400 };
  }

  const { name, email, company, projectType, budget, message } = validated.data;
  const resend = new Resend(apiKey);
  const subject = `New contact form message from ${name}`;

  const html = `
    <h2>New contact form submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Company:</strong> ${escapeHtml(company || "—")}</p>
    <p><strong>Project type:</strong> ${escapeHtml(projectType)}</p>
    <p><strong>Budget range:</strong> ${escapeHtml(budget)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
  `;

  const text = [
    "New contact form submission",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company || "—"}`,
    `Project type: ${projectType}`,
    `Budget range: ${budget}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: [toEmail],
    replyTo: email,
    subject,
    html,
    text,
  });

  if (error) {
    console.error("sendContactEmail:", error.message);

    if (error.message.includes("domain is not verified")) {
      return {
        error:
          "Email sending is not set up yet. The site domain still needs to be verified in Resend.",
        status: 503,
      };
    }

    return {
      error: "Something went wrong sending your message. Please try again.",
      status: 502,
    };
  }

  return { success: true };
}
