import Link from 'next/link'
import { BookOpen, Compass, MessageSquareMore } from 'lucide-react'
import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { mockFaqs } from '@/data/mock-data'

const topics = [
  { title: 'Reading the archive', description: 'Move through articles, visual notes, and support surfaces without losing your place.' },
  { title: 'Publishing support', description: 'Get help with contributor flows, submissions, and archive updates.' },
  { title: 'Search and discovery', description: 'Use search, category lanes, and cross-links to explore deeper parts of the site.' },
]

const quickRoutes = [
  { icon: BookOpen, title: 'Archive basics', body: 'Start with the article archive if you want the core reading experience first.' },
  { icon: Compass, title: 'Navigation guide', body: 'Use section pages and search when you want to branch into supporting routes.' },
  { icon: MessageSquareMore, title: 'Need human help?', body: 'The editorial desk can route publishing, support, and product questions.' },
]

export default function HelpPage() {
  return (
    <PageShell
      title="Help Center"
      description="Find archive guidance, support answers, and publishing help in one place."
      actions={
        <Button asChild className="rounded-full bg-[#2FA084] text-[#EEEEEE] hover:bg-[#1F6F5F]">
          <Link href="/contact">Contact Support</Link>
        </Button>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="grid gap-6 md:grid-cols-2">
          {topics.map((topic) => (
            <Card key={topic.title} className="rounded-[1.9rem] border-border bg-card transition-transform hover:-translate-y-1">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-foreground">{topic.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{topic.description}</p>
              </CardContent>
            </Card>
          ))}
          {quickRoutes.map((item) => (
            <Card key={item.title} className="rounded-[1.9rem] border-border bg-secondary/40">
              <CardContent className="p-6">
                <item.icon className="h-5 w-5 text-[#2FA084]" />
                <h2 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="magazine-frame rounded-[2.2rem] border-border bg-card">
          <CardContent className="p-6 sm:p-8">
            <p className="issue-kicker">Common questions</p>
            <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">Answers for readers, contributors, and returning visitors.</h3>
            <Accordion type="single" collapsible className="mt-4">
              {mockFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
