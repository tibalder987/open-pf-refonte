import { QuickBar } from '@/components/layout/quickbar'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'

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
      {/* QuickBar rendered AFTER main+footer so DOM order matches reading order */}
      <QuickBar />
    </>
  )
}
