"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import Magnetic from "./Magnetic";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!form.email.trim()) next.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email address.";
    if (!form.message.trim()) next.message = "Please enter a message.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    setError("");
    setProgress(12);
    const timer = setInterval(() => setProgress((p) => Math.min(p + 18, 92)), 120);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      clearInterval(timer);
      setProgress(100);
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
        setErrors({});
      } else {
        setStatus("error");
        setError(data.error || "Something went wrong.");
      }
    } catch {
      clearInterval(timer);
      setProgress(0);
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="glass relative overflow-hidden p-7 sm:p-9"
      aria-label="Contact form"
    >
      <h3 className="mb-6 text-xl font-semibold text-pearl">Send a message</h3>

      {status === "submitting" && (
        <div className="mb-5 progress-track" role="progressbar" aria-label="Submitting">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}

      {status === "success" && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-teal/30 bg-teal/10 px-4 py-3 text-sm text-teal">
          <CheckCircle2 size={18} />
          Thanks! Your message has been sent successfully.
        </div>
      )}

      {status === "error" && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-danger/30 bg-dangerbg px-4 py-3 text-sm text-danger">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="name"
          label="Name"
          required
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
          error={errors.name}
          placeholder="Your name"
        />
        <Field
          id="email"
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
          error={errors.email}
          placeholder="you@example.com"
        />
      </div>

      <div className="mt-5">
        <Field
          id="subject"
          label="Subject"
          value={form.subject}
          onChange={(v) => setForm({ ...form, subject: v })}
          placeholder="Project inquiry"
        />
      </div>

      <div className="mt-5">
        <Field
          id="message"
          label="Message"
          textarea
          required
          value={form.message}
          onChange={(v) => setForm({ ...form, message: v })}
          error={errors.message}
          placeholder="Tell me about your project..."
        />
      </div>

      <div className="mt-7">
        <Magnetic strength={0.5} className="w-full sm:w-auto">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="liquid-fill btn-primary group relative z-10 w-full sm:w-auto"
          >
            <Send size={16} />
            {status === "submitting" ? "Sending..." : "Send Message"}
          </button>
        </Magnetic>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  required,
  type = "text",
  textarea,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  type?: string;
  textarea?: boolean;
  placeholder?: string;
}) {
  return (
    <div className={cn("field-glow", textarea && "sm:col-span-2")}>
      <label htmlFor={id} className="field-label">
        {label} {required && <span className="text-teal">*</span>}
      </label>
      {textarea ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className={cn(
            "field-input resize-y",
            error && "field-input-error"
          )}
          placeholder={placeholder}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className={cn("field-input", error && "field-input-error")}
          placeholder={placeholder}
        />
      )}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
