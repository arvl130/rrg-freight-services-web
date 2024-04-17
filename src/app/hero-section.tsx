import { ShipVector } from "@/components/vector/ship"

export function HeroSection() {
  return (
    <section id="hero-section" className="[background-color:_#79CFDC] relative">
      <div className="min-h-[60vh] max-w-6xl mx-auto grid md:grid-cols-2 px-6">
        <div className="flex flex-col justify-center text-white font-semibold">
          <p className="text-4xl w-full text-center mb-3 max-w-md mx-auto">
            Don&apos;t leave your shipments to chance.
          </p>
          <p className="text-2xl w-full text-center">
            Take charge of your logistics today.
          </p>
        </div>
        <div className="hidden md:flex items-end">
          <div className="w-full max-w-lg mx-auto translate-y-24">
            <ShipVector />
          </div>
        </div>
      </div>
      <div className="h-24 bg-gradient-to-b from-[#79CFDC] to-white"></div>
    </section>
  )
}
