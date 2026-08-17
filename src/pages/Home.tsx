import { Footer } from '../components/Footer'
import { Nav } from '../components/Nav'
import { WhatsAppFab } from '../components/WhatsAppFab'
import { Cadence } from '../sections/Cadence'
import { Cards } from '../sections/Cards'
import { Contact } from '../sections/Contact'
import { Coverage } from '../sections/Coverage'
import { Desks } from '../sections/Desks'
import { Faq } from '../sections/Faq'
import { Hero } from '../sections/Hero'
import { Offer } from '../sections/Offer'
import { Quotes } from '../sections/Quotes'
import { Route } from '../sections/Route'
import { Services } from '../sections/Services'

export function Home() {
  return (
    <div id="top">
      <Nav />
      <main>
        <Hero />
        <Offer />
        <Cadence />
        <Services />
        <Route />
        <Coverage />
        <Desks />
        <Quotes />
        <Faq />
        <Cards />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  )
}
