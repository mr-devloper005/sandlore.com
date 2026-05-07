import Link from "next/link";
import { BookOpen, Compass, Layers3, PencilLine } from "lucide-react";
import { PageShell } from "@/components/shared/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/site-config";

const highlights = [
  { label: "Feature essays", value: "124" },
  { label: "Reading notes", value: "38" },
  { label: "Archive themes", value: "12" },
];

const values = [
  { title: "Editorial pace", description: "Every page is arranged to feel like part of a publication, not a dashboard." },
  { title: "Visual restraint", description: "Typography, spacing, and imagery do more of the work than loud UI chrome." },
  { title: "Connected archive", description: "Stories, supporting routes, and utilities stay linked without breaking the publication tone." },
];

const pillars = [
  {
    icon: PencilLine,
    title: "Long-form first",
    body: "Sandlore is designed around essays, interviews, dispatches, and slower reading rather than short-lived feed mechanics.",
  },
  {
    icon: Layers3,
    title: "Issue-like structure",
    body: "Lead stories, archive entries, support pages, and search all share the same visual language while keeping distinct rhythms.",
  },
  {
    icon: Compass,
    title: "Calm discovery",
    body: "Navigation and internal pages help readers move deeper into the archive without collapsing everything into one repeated template.",
  },
  {
    icon: BookOpen,
    title: "Useful depth",
    body: "Behind the visual polish, the full task system remains intact and accessible whenever the reader needs it.",
  },
];

export default function AboutPage() {
  return (
    <PageShell
      title={`About ${SITE_CONFIG.name}`}
      description={`${SITE_CONFIG.name} is a reading-first editorial product shaped for essays, visual notes, and a slower archive experience.`}
      actions={
        <>
          <Button variant="outline" asChild className="rounded-full">
            <Link href="/articles">Read the Archive</Link>
          </Button>
          <Button asChild className="rounded-full bg-[#BF4646] text-[#FFF4EA] hover:bg-[#aa3c3c]">
            <Link href="/contact">Contact the Desk</Link>
          </Button>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="magazine-frame overflow-hidden rounded-[2.4rem] border-border">
          <CardContent className="space-y-5 p-8">
            <p className="issue-kicker">Our editorial point of view</p>
            <h2 className="text-4xl font-semibold tracking-[-0.05em] text-foreground">
              A publication surface designed to feel deliberate, tactile, and easy to stay inside.
            </h2>
            <p className="soft-caption max-w-3xl text-sm leading-8">
              {SITE_CONFIG.name} treats the homepage, archive, search, and supporting pages as parts of one reading system.
              The result is a quieter product where branding, layout rhythm, and storytelling matter as much as utility.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item.label} className="rounded-[1.6rem] border border-border bg-white/80 p-4">
                  <div className="text-3xl font-semibold text-foreground">{item.value}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {values.map((value) => (
            <Card key={value.title} className="rounded-[1.8rem] border-border bg-card/90">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {pillars.map((pillar) => (
          <Card key={pillar.title} className="rounded-[1.8rem] border-border bg-secondary/35">
            <CardContent className="p-6">
              <pillar.icon className="h-5 w-5 text-[#BF4646]" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{pillar.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

          </PageShell>
  );
}
