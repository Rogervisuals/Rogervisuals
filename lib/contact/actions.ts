"use server";

import { Resend } from "resend";

const CONTACT_TO_EMAIL = "business@rogervisuals.com";

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

export async function submitContactForm(
  data: ContactFormSubmission
): Promise<{ success: true } | { error: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey) {
    return { error: "Email is not configured yet. Please try again later." };
  }

  if (!fromEmail) {
    return { error: "Email is not configured yet. Please try again later." };
  }

  const name = data.name.trim();
  const email = data.email.trim();
  const company = data.company.trim();
  const projectType = data.projectType.trim();
  const budget = data.budget.trim();
  const message = data.message.trim();

  if (!name || !email || !projectType || !budget || !message) {
    return { error: "Please fill in all required fields." };
  }

  if (!isValidEmail(email)) {
    return { error: "Please enter a valid email address." };
  }

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
    to: [CONTACT_TO_EMAIL],
    replyTo: email,
    subject,
    html,
    text,
  });

  if (error) {
    console.error("submitContactForm:", error.message);

    if (error.message.includes("domain is not verified")) {
      return {
        error:
          "Email sending is not set up yet. The site domain still needs to be verified in Resend.",
      };
    }

    return { error: "Something went wrong sending your message. Please try again." };
  }

  return { success: true };
}
