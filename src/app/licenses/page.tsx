import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'

const licenses = [
  { name: 'Next.js', description: 'MIT License' },
  { name: 'React', description: 'MIT License' },
  { name: 'Tailwind CSS', description: 'MIT License' },
]

export default function LicensesPage() {
  return (
    <PageShell
      title="Licenses"
      description="Open-source acknowledgements behind the reading interface and supporting application layers."
    >
      <Card className="magazine-frame rounded-[2.2rem] border-border bg-card">
        <CardContent className="p-6 space-y-3 sm:p-8">
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-foreground">Open-source tools that support the Sandlore experience.</h2>
          {licenses.map((license) => (
            <div key={license.name} className="rounded-[1.5rem] border border-border bg-secondary/40 p-4">
              <h3 className="text-sm font-semibold text-foreground">{license.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{license.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  )
}
