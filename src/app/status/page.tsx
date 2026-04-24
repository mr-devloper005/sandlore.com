import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const services = [
  { name: 'Web App', status: 'Operational' },
  { name: 'API', status: 'Operational' },
  { name: 'Media CDN', status: 'Operational' },
]

const incidents = [
  { date: 'Mar 12, 2026', title: 'Delayed notifications', status: 'Resolved' },
  { date: 'Feb 22, 2026', title: 'Search indexing lag', status: 'Resolved' },
]

export default function StatusPage() {
  return (
    <PageShell
      title="System Status"
      description="Live service health for the archive, publishing tools, and supporting site surfaces."
    >
      <div className="space-y-6">
        <Card className="magazine-frame rounded-[2.2rem] border-border">
          <CardContent className="p-7">
            <p className="issue-kicker">Current overview</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">All primary reader-facing systems are operating normally.</h2>
            <p className="mt-4 text-sm leading-8 text-muted-foreground">
              We monitor archive access, search, media delivery, and editorial publishing surfaces to keep the experience calm and reliable.
            </p>
          </CardContent>
        </Card>
        <div className="grid gap-4 md:grid-cols-3">
          {services.map((service) => (
            <Card key={service.name} className="rounded-[1.8rem] border-border bg-card">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-foreground">{service.name}</h2>
                <Badge className="mt-3" variant="secondary">{service.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="rounded-[2rem] border-border bg-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground">Incident History</h3>
            <div className="mt-4 space-y-3">
              {incidents.map((incident) => (
                <div key={incident.title} className="rounded-[1.4rem] border border-border bg-secondary/40 px-4 py-3">
                  <div className="text-xs text-muted-foreground">{incident.date}</div>
                  <div className="text-sm font-medium text-foreground">{incident.title}</div>
                  <div className="text-xs text-muted-foreground">{incident.status}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
