import Link from "next/link";
import { PenTool, Sparkles, Telescope } from "lucide-react";
import { PageShell } from "@/components/shared/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SITE_CONFIG } from "@/lib/site-config";

const roles = [
  { title: "Product Designer", location: "Remote", type: "Full-time", level: "Mid" },
  { title: "Frontend Engineer", location: "New York, NY", type: "Full-time", level: "Senior" },
  { title: "Community Lead", location: "Remote", type: "Part-time", level: "Mid" },
];

const benefits = [
  "A small team with strong editorial taste",
  "Flexible schedules and async-friendly collaboration",
  "Space to shape brand, layout, and storytelling together",
  "Direct influence over how the archive evolves",
];

const principles = [
  { icon: PenTool, title: "Editorial sensitivity", body: "We value people who can build for tone, pacing, and reader attention." },
  { icon: Telescope, title: "Long-view thinking", body: "The work is about cohesion over time, not one-off feature bursts." },
  { icon: Sparkles, title: "Taste plus craft", body: "We care about polish, clarity, and products that feel distinctive without feeling loud." },
];

export default function CareersPage() {
  return (
    <PageShell
      title="Careers"
      description={`Help shape the archive, product language, and editorial experience at ${SITE_CONFIG.name}.`}
      actions={
        <Button asChild className="rounded-full bg-[#BF4646] text-[#FFF4EA] hover:bg-[#aa3c3c]">
          <Link href="/contact">Get In Touch</Link>
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <Card className="magazine-frame rounded-[2.2rem] border-border">
            <CardContent className="p-7">
              <p className="issue-kicker">Why join</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">
                Build a calmer, more memorable publishing product with a small team.
              </h2>
              <p className="mt-4 text-sm leading-8 text-muted-foreground">
                We are interested in people who care about storytelling, strong UI rhythm, and making a product feel
                like a branded editorial world instead of a collection of disconnected screens.
              </p>
            </CardContent>
          </Card>
          {roles.map((role) => (
            <Card key={role.title} className="rounded-[1.8rem] border-border bg-card">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{role.level}</Badge>
                  <Badge variant="outline">{role.type}</Badge>
                </div>
                <h2 className="mt-3 text-lg font-semibold text-foreground">{role.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{role.location}</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/contact">View Role</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="rounded-[2rem] border-border bg-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground">Why {SITE_CONFIG.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We are building a publication-shaped product that prizes clarity, tone, and thoughtful discovery.
            </p>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              {benefits.map((benefit) => (
                <div key={benefit} className="rounded-md border border-border bg-secondary/40 px-3 py-2">
                  {benefit}
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3">
              {principles.map((item) => (
                <div key={item.title} className="rounded-[1.4rem] border border-border bg-white/80 p-4">
                  <item.icon className="h-4 w-4 text-[#BF4646]" />
                  <p className="mt-3 text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
