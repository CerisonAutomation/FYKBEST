import { PageHeader, PageSection } from '@/components/page'
import { Button } from '@/components/ui/button'
import { ArrowRight, Award, Check, Globe, Heart, Shield, Target, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about KING SOCIAL - The premium social network built for discerning individuals seeking authentic connections.',
  openGraph: {
    title: 'About KING SOCIAL',
    description: 'Elite social marketplace for discerning individuals.',
  },
}

const values = [
  {
    icon: Shield,
    title: 'Trust & Safety',
    description:
      'Every profile is rigorously verified to ensure a secure environment for all members.',
  },
  {
    icon: Heart,
    title: 'Authentic Connections',
    description: 'We foster genuine relationships built on shared interests and mutual respect.',
  },
  {
    icon: Globe,
    title: 'Global Community',
    description: 'Connect with exceptional individuals from major cities around the world.',
  },
  {
    icon: Award,
    title: 'Excellence First',
    description: 'Every feature and experience is crafted to the highest standards.',
  },
]

const milestones = [
  { year: '2020', event: 'KING SOCIAL Founded' },
  { year: '2021', event: '10,000 Members Milestone' },
  { year: '2022', event: 'Expanded to 50+ Cities' },
  { year: '2023', event: 'Launched Premium Features' },
  { year: '2024', event: 'Global Recognition Award' },
]

export default function AboutPage() {
  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageHeader
            title="Our Story"
            description="Building the world's most exclusive social network"
            centered
          />
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <PageSection>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-medium mb-6">
                <Target className="w-4 h-4" />
                Our Mission
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Creating Space for
                <span className="text-amber-500"> Meaningful</span> Connections
              </h2>
              <div className="space-y-4 text-slate-400 leading-relaxed">
                <p>
                  KING SOCIAL was founded in 2020 with a simple yet ambitious mission: to create a
                  premium social networking experience that prioritizes quality over quantity.
                </p>
                <p>
                  We believe that meaningful connections happen in spaces designed for authenticity
                  and exclusivity. Our platform brings together verified individuals who share
                  common interests, values, and aspirations.
                </p>
                <p>
                  Whether you&apos;re looking to expand your social circle, attend exclusive events,
                  or find companions for unique experiences, KING SOCIAL provides the perfect
                  environment.
                </p>
              </div>
            </PageSection>

            <PageSection delay={0.2}>
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                        <Users className="w-16 h-16 text-black" />
                      </div>
                      <div className="text-6xl font-black text-white mb-2">50K+</div>
                      <div className="text-slate-500">Verified Members</div>
                    </div>
                  </div>
                </div>

                {/* Floating stats */}
                <div className="absolute -bottom-6 -left-6 p-4 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="text-2xl font-bold text-white">100+</div>
                  <div className="text-sm text-slate-500">Cities</div>
                </div>
                <div className="absolute -top-6 -right-6 p-4 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-sm text-slate-500">Events</div>
                </div>
              </div>
            </PageSection>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our <span className="text-amber-500">Values</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </PageSection>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <PageSection key={value.title} delay={index * 0.1}>
                <div className="flex gap-6 p-6 bg-slate-950 border border-slate-900 rounded-2xl hover:border-amber-500/20 transition-colors">
                  <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <value.icon className="w-7 h-7 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </PageSection>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our <span className="text-amber-500">Journey</span>
            </h2>
            <p className="text-slate-400 text-lg">Milestones that mark our growth</p>
          </PageSection>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-slate-800 md:-translate-x-1/2" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <PageSection key={milestone.year} delay={index * 0.1}>
                  <div
                    className={`
                    relative flex items-center gap-8
                    ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}
                  `}
                  >
                    {/* Content */}
                    <div
                      className={`
                      flex-1 ml-12 md:ml-0
                      ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}
                    `}
                    >
                      <div className="text-3xl font-black text-amber-500 mb-1">
                        {milestone.year}
                      </div>
                      <div className="text-white font-medium">{milestone.event}</div>
                    </div>

                    {/* Dot */}
                    <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-amber-500 md:-translate-x-1/2 ring-4 ring-black" />

                    {/* Spacer for alternating layout */}
                    <div className="hidden md:block flex-1" />
                  </div>
                </PageSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <PageSection>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Join Our <span className="text-amber-500">Community</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
              Be part of an exclusive network of individuals who value quality, authenticity, and
              meaningful connections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-black font-bold"
              >
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-slate-700 text-white hover:bg-slate-800"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </PageSection>
        </div>
      </section>
    </div>
  )
}
