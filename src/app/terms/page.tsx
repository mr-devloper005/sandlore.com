import { PageShell } from "@/components/shared/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_CONFIG } from "@/lib/site-config";

const sections = [
  { title: "Account Usage", body: "Keep your account secure and follow community guidelines." },
  {
    title: "Content Ownership",
    body: "You own the content you publish and grant the platform a license to display it.",
  },
  { title: "Acceptable Use", body: "No spam, harassment, or illegal content." },
];

export default function TermsPage() {
  return (
    <PageShell
      title="Terms of Service"
      description={`The rules and usage guidelines for reading, publishing, and using ${SITE_CONFIG.name}.`}
    >
      <Card className="magazine-frame rounded-[2.2rem] border-border bg-card">
        <CardContent className="space-y-4 p-6 sm:p-8">
                    <h2 className="text-3xl font-semibold tracking-[-0.04em] text-foreground">Clear expectations for using the archive and its connected publishing surfaces.</h2>
          {sections.map((section) => (
            <div key={section.title} className="rounded-[1.5rem] border border-border bg-secondary/40 p-4">
              <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{section.body}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  );
}
