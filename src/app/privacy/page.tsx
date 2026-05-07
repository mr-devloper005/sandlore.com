import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'

const sections = [
  { title: 'Data We Collect', body: 'Account information, usage analytics, and content you submit.' },
  { title: 'How We Use Data', body: 'To personalize your experience, improve search, and keep the platform secure.' },
  { title: 'Your Choices', body: 'You can manage email preferences and delete your account at any time.' },
]

export default function PrivacyPage() {
  return (
    <PageShell
      title="Privacy Policy"
      description="How reader information is handled across the archive, publishing flows, and supporting site tools."
    >
      <Card className="magazine-frame rounded-[2.2rem] border-border bg-card">
        <CardContent className="p-6 space-y-4 sm:p-8">
                    <h2 className="text-3xl font-semibold tracking-[-0.04em] text-foreground">A plain-language summary of how this editorial product handles personal data.</h2>
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
