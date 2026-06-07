import { getRooms } from "./actions";
import { RoomCard, type RoomProps } from "@/components/room-card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import {
  Wifi,
  Car,
  UtensilsCrossed,
  ShieldCheck,
  Clock,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Star
} from "lucide-react";

export const dynamic = 'force-dynamic'

const amenities = [
  {
    icon: Wifi,
    title: "Free High-Speed WiFi",
    description: "Stay connected with complimentary internet access throughout the property"
  },
  {
    icon: Car,
    title: "Free Parking",
    description: "Secure on-site parking available for all guests"
  },
  {
    icon: UtensilsCrossed,
    title: "Restaurant & Bar",
    description: "Enjoy local and international cuisine at our in-house restaurant"
  },
  {
    icon: ShieldCheck,
    title: "24/7 Security",
    description: "Round-the-clock security for your peace of mind"
  },
  {
    icon: Clock,
    title: "24-Hour Reception",
    description: "Our friendly staff is always available to assist you"
  },
  {
    icon: Sparkles,
    title: "Daily Housekeeping",
    description: "Fresh linens and towels with daily room cleaning"
  }
];

export default async function Home() {
  const rooms = await getRooms();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navbar variant="transparent" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
            alt="Luxury Lodge"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <p className="text-sm md:text-base uppercase tracking-[0.3em] mb-6 text-white/80 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Welcome to
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Bezpoke Living
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Experience unparalleled comfort and hospitality in the heart of Ghana.
            Your perfect retreat awaits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Button asChild size="lg" className="rounded-full text-base h-12 px-8 bg-white text-black hover:bg-white/90">
              <Link href="#rooms">
                Explore Rooms
                <ChevronRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full text-base h-12 px-8 border-white/30 text-white hover:bg-white/10 bg-transparent">
              <Link href="#contact">Contact Us</Link>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary text-primary-foreground py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold">{rooms.length}+</p>
              <p className="text-sm text-primary-foreground/70 mt-1">Luxury Rooms</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold">500+</p>
              <p className="text-sm text-primary-foreground/70 mt-1">Happy Guests</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold">4.8</p>
              <p className="text-sm text-primary-foreground/70 mt-1">Star Rating</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold">24/7</p>
              <p className="text-sm text-primary-foreground/70 mt-1">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-primary mb-4">About Us</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                A Sanctuary of Comfort & Elegance
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Nestled in a serene location, Bezpoke Living offers a perfect blend of modern luxury
                and traditional Ghanaian hospitality. Whether you're visiting for business or leisure,
                our dedicated team ensures your stay is nothing short of exceptional.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Each room is thoughtfully designed to provide maximum comfort, featuring premium
                amenities and stunning views. Experience the warmth of home with the sophistication
                of a world-class lodge.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                      <Star className="w-4 h-4 text-primary" />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Rated <span className="font-semibold text-foreground">4.8/5</span> by our guests
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop"
                  alt="Luxury Room"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-card p-6 rounded-xl shadow-xl border border-border/50 hidden md:block">
                <p className="text-4xl font-bold text-primary">5+</p>
                <p className="text-sm text-muted-foreground">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="rooms" className="py-24 px-4 md:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.2em] text-primary mb-4">Accommodations</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Rooms & Suites</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose from our selection of premium accommodations, each designed for your ultimate comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room: RoomProps) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>

          {rooms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No rooms available at the moment. Please check back later.</p>
            </div>
          )}
        </div>
      </section>

      {/* Amenities Section */}
      <section id="amenities" className="py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.2em] text-primary mb-4">What We Offer</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Lodge Amenities</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need for a comfortable and memorable stay
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {amenities.map((amenity, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <amenity.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{amenity.title}</h3>
                <p className="text-muted-foreground text-sm">{amenity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop"
            alt="Room Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Experience Luxury?</h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Book your stay today and discover why Bezpoke Living is the preferred choice for discerning travelers.
          </p>
          <Button asChild size="lg" className="rounded-full text-base h-12 px-8 bg-white text-black hover:bg-white/90">
            <Link href="#rooms">
              Book Your Stay
              <ChevronRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 md:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-primary mb-4">Get in Touch</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Have questions or need assistance with your booking? Our team is here to help.
                Reach out to us through any of the channels below.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p className="text-muted-foreground text-sm">
                      123 Lodge Street, Accra<br />
                      Greater Accra Region, Ghana
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-muted-foreground text-sm">
                      +233 XX XXX XXXX<br />
                      +233 XX XXX XXXX
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground text-sm">
                      info@bezpokeliving.com<br />
                      bookings@bezpokeliving.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border/50 shadow-sm">
              <h3 className="text-xl font-semibold mb-6">Send us a Message</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="text-sm font-medium mb-2 block">Name</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-sm font-medium mb-2 block">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="text-sm font-medium mb-2 block">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="text-sm font-medium mb-2 block">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                    placeholder="Tell us more..."
                  />
                </div>
                <Button type="submit" className="w-full h-12 rounded-lg">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">Bezpoke Living</h3>
              <p className="text-primary-foreground/70 mb-6 max-w-md">
                Experience the perfect blend of comfort, luxury, and Ghanaian hospitality at Bezpoke Living.
                Your home away from home.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3 text-sm text-primary-foreground/70">
                <li><Link href="#rooms" className="hover:text-primary-foreground transition-colors">Our Rooms</Link></li>
                <li><Link href="#amenities" className="hover:text-primary-foreground transition-colors">Amenities</Link></li>
                <li><Link href="#contact" className="hover:text-primary-foreground transition-colors">Contact</Link></li>
                <li><Link href="/admin" className="hover:text-primary-foreground transition-colors">Admin Portal</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-3 text-sm text-primary-foreground/70">
                <li>123 Lodge Street, Accra</li>
                <li>Greater Accra Region, Ghana</li>
                <li>+233 XX XXX XXXX</li>
                <li>info@bezpokeliving.com</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/60">
              © 2026 Bezpoke Living. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-primary-foreground/60">
              <Link href="#" className="hover:text-primary-foreground transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
