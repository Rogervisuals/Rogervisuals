"use client";

import { useState, FormEvent } from "react";
import { Button } from "./Button";

const inputClass =
  "type-body w-full border border-white/10 bg-shark px-4 py-3.5 text-white placeholder:text-silver/40 transition-colors focus:border-mariner focus:outline-none";

interface ContactFormSuccessContent {
  title: string;
  message: string;
  resetLabel: string;
}

interface ContactFormProps {
  success: ContactFormSuccessContent;
  projectTypes: string[];
  budgetRanges: string[];
}

export function ContactForm({ success, projectTypes, budgetRanges }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  }

  if (submitted) {
    return (
      <div className="border border-mariner/30 bg-mine-shaft p-8 text-center md:p-12">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-mariner bg-mariner/10">
          <svg className="h-6 w-6 text-mariner" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="type-card-title-lg">{success.title}</h3>
        <p className="type-card-body mt-3">{success.message}</p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="type-nav mt-6 text-mariner transition-colors hover:text-white"
        >
          {success.resetLabel}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="type-meta mb-2.5 block">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className={inputClass}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="type-meta mb-2.5 block">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={inputClass}
            placeholder="you@company.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="company" className="type-meta mb-2.5 block">
          Company
        </label>
        <input
          id="company"
          name="company"
          type="text"
          className={inputClass}
          placeholder="Company or brand (optional)"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="projectType" className="type-meta mb-2.5 block">
            Project type
          </label>
          <select
            id="projectType"
            name="projectType"
            required
            className={inputClass}
            defaultValue=""
          >
            <option value="" disabled className="bg-shark">
              Select a type
            </option>
            {projectTypes.map((type) => (
              <option key={type} value={type} className="bg-shark">
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="budget" className="type-meta mb-2.5 block">
            Budget range
          </label>
          <select
            id="budget"
            name="budget"
            required
            className={inputClass}
            defaultValue=""
          >
            <option value="" disabled className="bg-shark">
              Select a range
            </option>
            {budgetRanges.map((range) => (
              <option key={range} value={range} className="bg-shark">
                {range}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="type-meta mb-2.5 block">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={`${inputClass} resize-none`}
          placeholder="Tell me about your project, timeline, and goals..."
        />
      </div>

      <Button type="submit" variant="primary" size="lg" disabled={loading}>
        {loading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
