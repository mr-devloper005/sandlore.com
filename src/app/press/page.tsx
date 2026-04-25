'use client'

import { useState } from 'react'
import Image from 'next/image'
import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { mockPressAssets, mockPressCoverage } from '@/data/mock-data'

export default function PressPage() {
  const { toast } = useToast()
  const [activeAssetId, setActiveAssetId] = useState<string | null>(null)
  const activeAsset = mockPressAssets.find((asset) => asset.id === activeAssetId)

  return (
    <PageShell
      title="Press"
      description="Media resources, brand assets, and story context for coverage of the Sandlore publication."
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="magazine-frame rounded-[2.2rem] border-border bg-card">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <p className="issue-kicker">Press kit</p>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-foreground">Brand material and editorial context for coverage.</h2>
            <p className="text-sm text-muted-foreground">
              Download logos, publication visuals, and reference material that reflects the current visual system of the site.
            </p>
            <div className="grid gap-2">
              {mockPressAssets.map((asset) => (
                <div key={asset.id} className="rounded-[1.5rem] border border-border bg-secondary/35 px-4 py-3">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{asset.title}</p>
                      <p className="text-xs text-muted-foreground">{asset.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{asset.fileType}</Badge>
                      <Button size="sm" variant="outline" onClick={() => setActiveAssetId(asset.id)}>
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          toast({
                            title: 'Download started',
                            description: `${asset.title} is downloading.`,
                          })
                        }
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card className="rounded-[1.8rem] border-border bg-card">
            <CardContent className="p-6">
              <p className="issue-kicker">Coverage note</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-foreground">Sandlore is best described as a quiet editorial product, not a generic content platform.</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                When covering the brand, emphasize the reading-first archive, issue-like layout, and softer print-inspired visual language.
              </p>
            </CardContent>
          </Card>
          {mockPressCoverage.map((item) => (
            <Card key={item.id} className="rounded-[1.8rem] border-border bg-card transition-transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{item.outlet}</div>
                <p className="mt-2 text-sm text-foreground">{item.headline}</p>
                <p className="mt-2 text-xs text-muted-foreground">{item.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={Boolean(activeAsset)} onOpenChange={() => setActiveAssetId(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{activeAsset?.title}</DialogTitle>
          </DialogHeader>
          {activeAsset?.previewUrl && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border bg-muted">
              <Image
                src={activeAsset.previewUrl}
                alt={activeAsset.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <p className="text-sm text-muted-foreground">{activeAsset?.description}</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveAssetId(null)}>
              Close
            </Button>
            <Button
              onClick={() =>
                toast({
                  title: 'Download started',
                  description: `${activeAsset?.title} is downloading.`,
                })
              }
            >
              Download {activeAsset?.fileType}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  )
}
