import { Quotes } from "@phosphor-icons/react/dist/ssr/Quotes"

export function TestimonialSection() {
  return (
    <section>
      <div className="bg-white">
        <div className="text-center my-1 md:my-3">
          <div className="font-size font-semibold text-2xl sm:text-2xl md:text-3xl lg:text-4xl my-2 sm:my-15 ">
            <p className="py-3 mt-10">RRG CLIENTS TESTIMONIALS</p>
          </div>
        </div>
      </div>
      {/* Testimonial Cards */}
      <div className="py-2">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center">
          {/* Testimonial Card 1 */}
          <div className="w-full md:w-1/2 lg:w-1/3 p-5 md:p-5">
            <div className="min-h-[100%] drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)] bg-white rounded-lg p-6">
              <div className="text-3xl text-gray-600 mb-4">
                <Quotes size={32} weight="fill" /> {/* Quotation Icon */}
              </div>
              <p className="text-lg text-gray-800 mb-4">
                RRG Freight Company is like the James Bond of logistics always
                on a top-secret mission to deliver packages with unmatched
                precision and style. I&apos;m convinced your trucks come
                equipped with secret agent gadgets and a license to thrill every
                client with lightning-fast deliveries.
              </p>
              <div className="text-3xl text-gray-600 mb-4">
                <i className="far fa-comment-dots"></i> {/* Comment Icon */}
              </div>
              <p className="text-lg text-gray-800">&#x2013; John Doe</p>
            </div>
          </div>

          {/* Testimonial Card 2 */}
          <div className="w-full md:w-1/2 lg:w-1/3 p-4">
            <div className="min-h-[100%] drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)] bg-white rounded-lg p-6">
              <div className="text-3xl text-gray-600 mb-4">
                <Quotes size={32} weight="fill" /> {/* Quotation Icon */}
              </div>
              <p className="text-lg text-gray-800 mb-4">
                RRG Freight Company doesn&apos;t just transport goods;
                you&apos;re the magicians of moving merchandise! I&apos;ve heard
                rumors that your trucks have a magical touch, turning traffic
                jams into open highways and transforming delivery deadlines into
                mere suggestions. It&apos;s like watching a magical spectacle
                every time RRG hits the road!
              </p>
              <div className="text-3xl text-gray-600 mb-4">
                <i className="far fa-comment-dots"></i> {/* Comment Icon */}
              </div>
              <p className="text-lg text-gray-800">&#x2013; Jane Smith</p>
            </div>
          </div>

          {/* Testimonial Card 3 */}
          <div className="w-full md:w-1/2 lg:w-1/3 p-4">
            <div className="min-h-[100%] drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)] bg-white rounded-lg p-6">
              <div className="text-3xl text-gray-600 mb-4">
                <Quotes size={32} weight="fill" /> {/* Quotation Icon */}
              </div>
              <p className="text-lg text-gray-800 mb-4">
                RRG Freight Company, you&apos;re the rock stars of the shipping
                world! Your trucks are like tour buses on a cross-country
                concert, bringing joy and harmony to every destination. I hear
                your delivery drivers even have their own fan clubs, complete
                with screaming admirers whenever they roll into town. Keep on
                rocking those deliveries, RRG!
              </p>
              <div className="text-3xl text-gray-600 mb-4">
                <i className="far fa-comment-dots"></i> {/* Comment Icon */}
              </div>
              <p className="text-lg text-gray-800">&#x2013; Sarah Johnson</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
