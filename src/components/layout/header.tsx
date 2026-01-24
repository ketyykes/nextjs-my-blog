import { Navbar } from './navbar'
import { Banner } from './banner'

interface HeaderProps {
  articles?: Array<{ title: string; slug: string; date: string }>
}

export function Header({ articles }: HeaderProps) {
  return (
    <header>
      <Navbar articles={articles} />
      <Banner />
    </header>
  )
}
