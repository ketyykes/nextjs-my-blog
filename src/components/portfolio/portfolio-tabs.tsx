'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PortfolioCard } from './portfolio-card'
import portfolioData from '@/data/portfolio.json'

export function PortfolioTabs() {
  return (
    <Tabs defaultValue="frontend" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="frontend" className="cursor-pointer">
          Front-end
        </TabsTrigger>
        <TabsTrigger value="backend" className="cursor-pointer">
          Backend
        </TabsTrigger>
        <TabsTrigger value="other" className="cursor-pointer">
          Other
        </TabsTrigger>
      </TabsList>
      <TabsContent value="frontend" className="mt-6">
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
          {portfolioData.frontEndCardArray.map((item) => (
            <div key={item.id} className="mb-6 break-inside-avoid">
              <PortfolioCard {...item} />
            </div>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="backend" className="mt-6">
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
          {portfolioData.backEndCardArray.map((item) => (
            <div key={item.id} className="mb-6 break-inside-avoid">
              <PortfolioCard {...item} />
            </div>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="other" className="mt-6">
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
          {portfolioData.otherCardArray.map((item) => (
            <div key={item.id} className="mb-6 break-inside-avoid">
              <PortfolioCard {...item} />
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}
