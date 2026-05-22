import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'

export default function PublicLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <>
      <SiteHeader />
      <main id="contenu" role="main">{children}</main>
      {modal}
      <SiteFooter />
    </>
  )
}
