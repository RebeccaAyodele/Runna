import Image from "next/image";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { ArrowRightIcon, BoltIcon, ChevronDownIcon, ClockIcon, PaymentsIcon, PostAddIcon, StarIcon } from "@/components/icons";
import { BenefitsTabs } from "./_components/benefits-tabs";

const howItWorks = [
  { title: "Post a Task", copy: "Need a delivery? Coffee run? Study notes? Drop it in the app and set your price.", Icon: PostAddIcon, pulse: false },
  { title: "Fastest Claim in the West", copy: "A verified student runner claims your task instantly. They hustle, you relax.", Icon: BoltIcon, pulse: true },
  { title: "Instant Payout", copy: "Job done & paid. Funds are securely transferred the moment you confirm completion.", Icon: PaymentsIcon, pulse: false },
] as const;

const earnBenefits = [
  { title: "Flexible Schedule", copy: "Work between classes. You choose when you're available.", Icon: ClockIcon },
  { title: "Fast Payouts", copy: "Get your money as soon as the task is confirmed.", Icon: PaymentsIcon },
  { title: "Build Your Rep", copy: "Earn ratings and become a top-tier runner in your community.", Icon: StarIcon },
] as const;

const faqs = [
  ["Is Runna only for students?", "Yes! Runna is built exclusively for university students. To maintain a safe and tight-knit campus community, you must verify your account using an active school email address before you can post tasks or start earning."],
  ["How do I get paid?", "Payments are handled securely through our app. Once a task is marked as complete by both parties, funds are instantly transferred to your linked account. No cash handling required!"],
  ["What if something goes wrong?", "We've got your back. Every transaction is covered by our Campus Guarantee. If an item is damaged or a task isn't completed as described, our student support team will step in to mediate and issue refunds if necessary."],
  ["Are there any fees?", "Posting a task is completely free. When a runner completes a task, a small service fee is deducted from the total payout to help keep the platform secure."],
] as const;

const footerLinks = [
  ["How it Works", "#how-it-works"],
  ["Post a Task", "/sign-up"],
  ["Earn Money", "#earn"],
  ["Safety", "#faq"],
  ["Support", "#faq"],
] as const;

/**
 * The app bar from the section designs. It stays pinned because this is a long
 * scrolling page — both routes into onboarding should be one tap away wherever
 * the reader stops.
 */
function SiteHeader() {
  return <header className="sticky top-0 z-50 border-b border-runna-outline bg-white shadow-runna-card">
    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
      <Link href="/" aria-label="Runna home" className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-runna-blue"><Brand /></Link>
      <div className="flex items-center gap-1 sm:gap-3">
        <Link
          href="/sign-in"
          className="rounded-xl px-3 py-2 text-sm font-semibold tracking-[0.02em] text-runna-blue transition-colors hover:bg-runna-blue-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-blue"
        >Sign in</Link>
        <Link
          href="/sign-up"
          className="rounded-2xl bg-runna-coral px-4 py-2.5 text-sm font-semibold tracking-[0.02em] text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-coral"
        >Get Started</Link>
      </div>
    </div>
  </header>;
}

function Hero() {
  return <section className="relative isolate flex min-h-[calc(100svh-4rem)] items-center overflow-hidden">
    <Image src="/runna-campus-mobile.png" alt="" fill priority sizes="(min-width: 640px) 1px, 100vw" className="-z-10 object-cover sm:hidden" />
    <Image src="/runna-campus.png" alt="" fill priority sizes="(min-width: 640px) 100vw, 1px" className="-z-10 hidden object-cover sm:block" />
    <span aria-hidden="true" className="absolute inset-0 -z-10 bg-black/20" />
    {/* The signature route-path motif, running behind the headline. */}
    <svg aria-hidden="true" viewBox="0 0 400 160" className="pointer-events-none absolute inset-x-0 top-1/4 -z-10 w-full opacity-70">
      <path className="route-path route-path-light" fill="none" d="M-10 130C80 130 100 30 200 30s120 100 210 40" />
    </svg>
    <div className="relative mx-auto w-full max-w-xl px-5 py-16 text-center sm:px-8">
      <h1 className="font-heading text-5xl font-extrabold leading-[1.05] tracking-[-0.02em] text-white sm:text-6xl">Your campus, your crew, your errands.</h1>
      <Link
        href="/sign-up"
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-runna-coral px-8 py-[18px] font-heading text-xl font-semibold text-white shadow-runna-button transition-transform hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95"
      >Get Started<ArrowRightIcon className="size-6" /></Link>
      <div className="mt-6 flex flex-col items-center gap-2">
        <span className="flex -space-x-3">
          <Image src="/student-1.jpg" alt="" width={32} height={32} className="size-8 rounded-full border-2 border-runna-blue object-cover" />
          <Image src="/student-2.jpg" alt="" width={32} height={32} className="size-8 rounded-full border-2 border-runna-blue object-cover" />
          <Image src="/student-3.jpg" alt="" width={32} height={32} className="size-8 rounded-full border-2 border-runna-blue object-cover" />
        </span>
        <p className="text-sm font-semibold tracking-[0.02em] text-white">Join 2,000+ students at your uni.</p>
      </div>
    </div>
  </section>;
}

function HowItWorks() {
  return <section id="how-it-works" className="mx-auto max-w-lg scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
    <div className="text-center">
      <h2 className="font-heading text-4xl font-extrabold tracking-[-0.02em]">How it Works</h2>
      <p className="mt-2 text-lg leading-7 text-runna-muted">Three simple steps to hustle harder and get things done.</p>
    </div>
    <div className="relative mt-10">
      <span aria-hidden="true" className="absolute bottom-12 left-8 top-12 border-l-2 border-dashed border-runna-blue opacity-50" />
      <div className="relative space-y-8">
        {howItWorks.map(({ title, copy, Icon, pulse }) => <article key={title} className="group flex items-start gap-6">
          <span className="relative flex size-16 shrink-0 items-center justify-center rounded-full border-2 border-transparent bg-white text-runna-blue shadow-runna-card transition-colors group-hover:border-runna-blue">
            {pulse ? <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-runna-coral opacity-20" /> : null}
            <Icon className="relative size-8" />
          </span>
          <div className="flex-1 rounded-2xl bg-white p-5 shadow-runna-card transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-runna-card-hover">
            <h3 className="font-heading text-xl font-semibold">{title}</h3>
            <p className="mt-1 leading-6 text-runna-muted">{copy}</p>
          </div>
        </article>)}
      </div>
    </div>
    <Link
      href="/sign-up"
      className="mx-auto mt-10 flex w-full max-w-xs items-center justify-center rounded-2xl bg-runna-coral px-8 py-3.5 text-sm font-semibold tracking-[0.02em] text-white shadow-runna-card transition-all duration-300 hover:-translate-y-1 hover:shadow-runna-card-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-coral"
    >Post Your First Task</Link>
  </section>;
}

function WhyRunna() {
  return <section id="why-runna" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
    <div className="mx-auto max-w-md">
      <div className="text-center">
        <h2 className="font-heading text-4xl font-extrabold tracking-[-0.02em]">Why Runna?</h2>
        <p className="mt-1 text-lg leading-7 text-runna-muted">Whether you need help or want to hustle.</p>
      </div>
      <BenefitsTabs />
    </div>
  </section>;
}

function EarnCash() {
  return <section id="earn" className="relative mx-auto max-w-md scroll-mt-24 overflow-hidden px-5 py-20 sm:px-8 sm:py-24">
    <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-runna-blue opacity-[0.03] blur-3xl" />
    <span aria-hidden="true" className="pointer-events-none absolute -left-16 bottom-20 size-48 rounded-full bg-runna-coral opacity-5 blur-2xl" />
    <header className="relative z-10 text-center">
      <h2 className="font-heading text-[40px] font-extrabold leading-[48px] tracking-[-0.02em]">Turn Errands into <span className="text-runna-blue">Earnings</span></h2>
      <p className="mx-auto mt-3 max-w-sm text-lg leading-7 text-runna-slate">Join the campus hustle. Get paid to help your peers with small tasks.</p>
    </header>
    <div className="relative z-10 mt-8 space-y-6">
      {/* The route motif threads the cards together — wide screens only, where there's room beside them. */}
      <span aria-hidden="true" className="pointer-events-none absolute bottom-8 left-6 top-8 hidden border-l-2 border-dashed border-runna-blue opacity-20 md:block" />
      {earnBenefits.map(({ title, copy, Icon }) => <article key={title} className="group relative z-10 flex gap-4 rounded-2xl bg-white p-6 shadow-runna-card-soft transition-transform duration-300 hover:-translate-y-1">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-runna-blue-mist text-runna-blue transition-colors group-hover:bg-runna-blue group-hover:text-white">
          <Icon className="size-6" />
        </span>
        <div>
          <h3 className="font-heading text-xl font-semibold leading-[26px]">{title}</h3>
          <p className="mt-1 leading-6 text-runna-slate">{copy}</p>
        </div>
      </article>)}
    </div>
    <div className="relative z-10 mt-8 text-center">
      <Link
        href="/sign-up"
        className="flex w-full items-center justify-center rounded-2xl bg-runna-coral px-8 py-4 font-heading text-2xl font-bold leading-[30px] text-white shadow-md transition-all duration-200 hover:opacity-90 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-runna-coral/40"
      >Start Earning Today</Link>
      <p className="mt-3 text-sm leading-5 text-runna-muted">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-sm font-semibold tracking-[0.02em] text-runna-blue hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-blue">Log in</Link>
      </p>
    </div>
  </section>;
}

function Faq() {
  return <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
    <div className="text-center">
      <h2 className="font-heading text-4xl font-extrabold tracking-[-0.02em] text-runna-blue">Got Questions?</h2>
      <p className="mt-1 text-lg leading-7 text-runna-muted">Everything you need to know about hustling and getting tasks done on campus.</p>
    </div>
    <div className="mt-10 space-y-4">
      {/* A shared `name` makes this an exclusive accordion natively — no JavaScript. */}
      {faqs.map(([question, answer], index) => <details key={question} name="faq" open={index === 0} className="group overflow-hidden rounded-2xl border border-transparent bg-white shadow-runna-card transition-colors hover:border-runna-outline">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 font-semibold">
          <span>{question}</span>
          <ChevronDownIcon className="size-6 shrink-0 text-runna-coral transition-transform duration-300 group-open:rotate-180" />
        </summary>
        <div className="px-6 pb-6">
          <p className="border-t border-runna-outline pt-4 leading-relaxed text-runna-muted">{answer}</p>
        </div>
      </details>)}
    </div>
  </section>;
}

function SiteFooter() {
  return <footer className="mt-auto rounded-t-3xl bg-runna-ink px-5 py-12 text-white sm:px-8">
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
      <span className="font-heading text-2xl font-bold tracking-tight">Runna</span>
      <nav aria-label="Footer" className="flex flex-wrap justify-center gap-4 text-sm">
        {footerLinks.map(([label, href]) => <Link
          key={label}
          href={href}
          className="text-white/70 transition-colors hover:text-runna-coral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >{label}</Link>)}
      </nav>
      <p className="text-sm text-white/55">© {new Date().getFullYear()} Runna. Hustle Harder.</p>
    </div>
  </footer>;
}

export default function MarketingHome() {
  return <div className="flex min-h-full flex-col bg-runna-paper text-runna-ink">
    <SiteHeader />
    <main>
      <Hero />
      <HowItWorks />
      <WhyRunna />
      <EarnCash />
      <Faq />
    </main>
    <SiteFooter />
  </div>;
}
