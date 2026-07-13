import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: ["pooja.writer10@gmail.com"],
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9f9f9; border-radius: 8px;">
          <h2 style="color: #333; margin-bottom: 16px;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 16px; background: #fff; border: 1px solid #e0e0e0; font-weight: bold; color: #555; width: 80px;">Name</td>
              <td style="padding: 12px 16px; background: #fff; border: 1px solid #e0e0e0; color: #333;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; background: #fff; border: 1px solid #e0e0e0; font-weight: bold; color: #555;">Email</td>
              <td style="padding: 12px 16px; background: #fff; border: 1px solid #e0e0e0; color: #333;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; background: #fff; border: 1px solid #e0e0e0; font-weight: bold; color: #555; vertical-align: top;">Message</td>
              <td style="padding: 12px 16px; background: #fff; border: 1px solid #e0e0e0; color: #333; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit. Please try again." },
      { status: 500 }
    );
  }
}
