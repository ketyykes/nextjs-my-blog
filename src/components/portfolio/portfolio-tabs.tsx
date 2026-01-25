'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PortfolioCard } from './portfolio-card'
import portfolioData from '@/data/portfolio.json'

export function PortfolioTabs() {
  return (
    <Tabs defaultValue="frontend" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="frontend">Front-end</TabsTrigger>
        <TabsTrigger value="backend">Backend</TabsTrigger>
        <TabsTrigger value="other">Other</TabsTrigger>
      </TabsList>
      <TabsContent value="frontend" className="mt-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {portfolioData.frontEndCardArray.map((item) => (
            <PortfolioCard key={item.id} {...item} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="backend" className="mt-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {portfolioData.backEndCardArray.map((item) => (
            <PortfolioCard key={item.id} {...item} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="other" className="mt-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {portfolioData.otherCardArray.map((item) => (
            <PortfolioCard key={item.id} {...item} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}
