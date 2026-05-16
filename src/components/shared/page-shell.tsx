import type { ReactNode } from 'react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'

export function PageShell({
  title,
  description,
  actions,
  children,
}: {
  title: string
  description?: string
  actions?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <NavbarShell />
      <main>
        <section className="border-b border-[#6FCF97] bg-[linear-gradient(180deg,#EEEEEE_0%,#6FCF97_100%)]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="issue-kicker">Archive surface</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">{title}</h1>
                {description && (
                  <p className="soft-caption mt-4 max-w-2xl text-sm leading-8">{description}</p>
                )}
              </div>
              {actions && <div className="flex flex-wrap gap-3 lg:justify-end">{actions}</div>}
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {children}
        </section>
      </main>
      <Footer />
    </div>
  )
}
