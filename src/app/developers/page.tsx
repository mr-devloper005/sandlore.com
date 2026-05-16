import Link from "next/link";
import { Code2, Database, Search, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/shared/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const surfaces = [
  {
    icon: Code2,
    title: "Frontend surfaces",
    body: "The public archive, search experience, static pages, and task UIs are designed to stay visually cohesive while supporting different content types.",
  },
  {
    icon: Search,
    title: "Search and indexing",
    body: "Search remains available across tasks and supporting routes, giving deeper archive access without changing the reading-first front door.",
  },
  {
    icon: Database,
    title: "Content structure",
    body: "The system supports multiple post types beneath the same product shell, allowing article-first emphasis without removing underlying route support.",
  },
  {
    icon: ShieldCheck,
    title: "Operational clarity",
    body: "Canonical, routing, auth, and compatibility layers remain intact while the presentation layer changes around them.",
  },
];

export default function DevelopersPage() {
  return (
    <PageShell
      title="Developers"
      description="A technical overview of the public archive surfaces and the systems that support them."
      actions={
        <Button asChild className="rounded-full bg-[#2FA084] text-[#EEEEEE] hover:bg-[#1F6F5F]">
          <Link href="/contact">Request Technical Help</Link>
        </Button>
      }
    >
      <Card className="magazine-frame rounded-[2.2rem] border-border bg-card">
        <CardContent className="p-7 sm:p-8">
          <p className="issue-kicker">Product overview</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">
            Sandlore keeps the presentation layer editorial while preserving the broader multi-task system underneath.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-muted-foreground">
            This page is meant for partners, implementers, and technical reviewers who need to understand how the public
            interface relates to the rest of the application without digging into backend or deployment internals.
          </p>
        </CardContent>
      </Card>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {surfaces.map((item) => (
          <Card key={item.title} className="rounded-[1.8rem] border-border bg-card">
            <CardContent className="p-6">
              <item.icon className="h-5 w-5 text-[#2FA084]" />
              <h3 className="mt-4 text-xl font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
