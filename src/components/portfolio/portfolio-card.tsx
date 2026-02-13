'use client'

import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

interface PortfolioCardProps {
  cardHead: string
  cardContent: string
  cardImageSrc: string
  webSrc: string
}

export function PortfolioCard({
  cardHead,
  cardContent,
  cardImageSrc,
  webSrc,
}: PortfolioCardProps) {
  return (
    <Card className="h-fit overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-lg">{cardHead}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Image
          src={cardImageSrc}
          alt={cardHead}
          width={400}
          height={300}
          className="w-full rounded-md"
          unoptimized
        />
        <p className="text-sm text-muted-foreground">{cardContent}</p>
        {webSrc ? (
          <Button
            variant="default"
            className="w-full cursor-pointer"
            onClick={() => window.open(webSrc, '_blank')}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            點我觀看
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}
