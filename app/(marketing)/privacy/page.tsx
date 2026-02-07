/**
 * Privacy Policy Page
 *
 * Privacy policy and data handling information.
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'KING SOCIAL Privacy Policy and data protection',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-invert prose-amber max-w-none">
          <p className="text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
            <p className="text-slate-300">
              We collect information you provide directly to us, including your name, email address,
              profile information, and any other information you choose to provide.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
            <p className="text-slate-300">
              We use the information we collect to provide, maintain, and improve our services, to
              communicate with you, and to protect our users.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">3. Data Security</h2>
            <p className="text-slate-300">
              We implement appropriate technical and organizational measures to protect your
              personal data against unauthorized access, alteration, or destruction.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
