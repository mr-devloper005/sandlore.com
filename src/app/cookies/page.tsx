import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'

const sections = [
  { title: 'Essential Cookies', body: 'Required for authentication and core features.' },
  { title: 'Analytics Cookies', body: 'Help us understand how the platform is used.' },
  { title: 'Preference Cookies', body: 'Remember your settings and saved filters.' },
]

export default function CookiesPage() {
  return (
    <PageShell
      title="Cookie Policy"
      description="Details about the cookies and lightweight storage used across the reading experience."
    >
      <Card className="magazine-frame rounded-[2.2rem] border-border bg-card">
        <CardContent className="p-6 space-y-4 sm:p-8">
          <p className="text-xs text-muted-foreground">Last updated: March 16, 2026</p>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-foreground">A simple overview of the cookies that keep the site usable and measurable.</h2>
          {sections.map((section) => (
            <div key={section.title} className="rounded-[1.5rem] border border-border bg-secondary/40 p-4">
              <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{section.body}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  )
}
