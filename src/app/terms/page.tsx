import Link from "next/link";

import { SUPPORT_EMAIL, SUPPORT_EMAIL_HREF } from "@/lib/support";

export const metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using the WizCodes internship portal.",
};

const SECTIONS = [
  {
    title: "1. Introduction",
    body: [
      'These Terms & Conditions ("Terms") govern your access to and use of the WizCodes Portal website, applications, and related internship services (collectively, the "Platform"), operated by WizCodes ("we", "us", or "our").',
      "By creating an account, logging in, enrolling, or making a payment on the Platform, you confirm that you have read, understood, and agree to be bound by these Terms.",
    ],
  },
  {
    title: "2. Eligibility",
    body: [
      "The Platform is intended primarily for students and learners in India who wish to enrol in structured internship programmes offered by WizCodes.",
      "You must be at least 18 years of age, or have verifiable consent from a parent or legal guardian, to use the Platform.",
      "You agree to provide accurate, complete, and current information during registration and enrollment.",
    ],
  },
  {
    title: "3. Services",
    body: [
      "WizCodes provides online internship programmes across selected domains, including assigned tasks, mentor support (where applicable under your plan), payment verification, and issuance of an offer letter and internship certificate upon successful completion, subject to our review and approval.",
      "We may update, modify, suspend, or discontinue any part of the Platform or programme content at any time without prior notice, where reasonably necessary for operations, compliance, or improvement.",
    ],
  },
  {
    title: "4. Fees and payments",
    body: [
      "Programme fees are displayed on the Platform at the time of enrollment. All fees are quoted in Indian Rupees (INR) unless stated otherwise.",
      "Payment must be made through the payment methods published on the Platform. Access to internship tasks and related benefits may remain restricted until your payment is verified by our team.",
      "You are responsible for ensuring that payment details, transaction references, and uploaded payment proof are accurate.",
    ],
  },
  {
    title: "5. No refund policy",
    body: [
      "All programme fees paid to WizCodes are final and non-refundable, except where a refund is expressly required under applicable law in India.",
      "No refund shall be provided for change of mind, partial completion, non-submission of tasks, failure to meet deadlines, account inactivity, rejection of payment proof due to invalid or mismatched payment, or termination resulting from breach of these Terms.",
      "If you believe a payment was made in error, contact us promptly at the support email below. Any discretionary review does not create an obligation to issue a refund.",
    ],
  },
  {
    title: "6. Certificates and documents",
    body: [
      "Offer letters and internship certificates are issued only after successful completion of the enrolled programme requirements and internal verification.",
      "Details submitted during enrollment — including your full name and internship dates — will be used on official documents. You are responsible for the accuracy of this information.",
      "WizCodes reserves the right to withhold or revoke credentials in cases of fraud, misrepresentation, plagiarism, or violation of these Terms.",
    ],
  },
  {
    title: "7. Acceptable use",
    body: [
      "You agree not to misuse the Platform, including by attempting unauthorised access, sharing login credentials, uploading false payment proof, submitting plagiarised work, harassing staff or other users, or using the Platform for unlawful purposes.",
      "We may suspend or terminate your account, withhold access, or reject enrollment if we reasonably believe you have violated these Terms or applicable law.",
    ],
  },
  {
    title: "8. Intellectual property",
    body: [
      "All Platform content, branding, materials, task structures, and documentation are owned by WizCodes or its licensors and are protected under applicable intellectual property laws.",
      "You receive a limited, non-transferable, revocable licence to use the Platform for personal educational purposes in connection with your enrolled programme.",
    ],
  },
  {
    title: "9. Disclaimer of warranties",
    body: [
      'The Platform and programmes are provided on an "as is" and "as available" basis to the fullest extent permitted by law.',
      "We do not guarantee employment, internship placement with third parties, academic credit, or any specific career outcome.",
    ],
  },
  {
    title: "10. Limitation of liability",
    body: [
      "To the maximum extent permitted under applicable law in India, WizCodes shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or for loss of profits, data, goodwill, or opportunities arising from your use of the Platform.",
      "Our total aggregate liability for any claim relating to the Platform or your enrollment shall not exceed the amount actually paid by you to WizCodes for the relevant programme.",
    ],
  },
  {
    title: "11. Privacy",
    body: [
      "We collect and process personal information necessary to operate the Platform, verify payments, assign tasks, and issue credentials. By using the Platform, you consent to such processing in accordance with applicable Indian law, including reasonable security and data-handling practices.",
    ],
  },
  {
    title: "12. Governing law and jurisdiction",
    body: [
      "These Terms are governed by the laws of India.",
      "Subject to applicable consumer protection laws, courts at Ahmedabad, Gujarat, India shall have exclusive jurisdiction over disputes arising out of or relating to these Terms or your use of the Platform.",
    ],
  },
  {
    title: "13. Changes to these Terms",
    body: [
      "We may update these Terms from time to time. The revised version will be posted on this page with an updated effective date. Continued use of the Platform after changes are published constitutes acceptance of the revised Terms.",
    ],
  },
  {
    title: "14. Contact",
    body: [
      `For support, payment queries, or legal notices, contact us at ${SUPPORT_EMAIL}.`,
    ],
  },
] as const;

export default function TermsPage() {
  return (
    <main className="bg-canvas min-h-full px-4 py-10 sm:px-6 sm:py-14">
      <article className="border-border bg-surface mx-auto max-w-3xl rounded-2xl border p-6 shadow-sm sm:p-10">
        <p className="text-ink-muted text-xs font-medium tracking-[0.2em] uppercase">
          WizCodes Portal
        </p>
        <h1 className="text-ink mt-3 text-3xl font-semibold tracking-tight">
          Terms &amp; Conditions
        </h1>
        <p className="text-ink-secondary mt-3 text-sm">Effective date: 10 September 2026</p>

        <div className="mt-8 space-y-8">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="text-ink text-lg font-semibold">{section.title}</h2>
              <div className="text-ink-secondary mt-3 space-y-3 text-sm leading-relaxed">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="border-border mt-10 border-t pt-6">
          <p className="text-ink-secondary text-sm">
            Questions? Email{" "}
            <a
              href={SUPPORT_EMAIL_HREF}
              className="text-brand hover:text-brand-strong font-medium transition-colors"
            >
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
          <Link
            href="/signup"
            className="text-brand hover:text-brand-strong mt-4 inline-block text-sm font-medium transition-colors"
          >
            ← Back to sign up
          </Link>
        </div>
      </article>
    </main>
  );
}
