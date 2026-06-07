import { prisma } from "@/lib/prisma"
import { BookingForm } from "@/components/booking-form"
import { RoomImageGallery } from "@/components/room-image-gallery"
import { RoomHeader } from "@/components/room-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
    Users,
    MapPin,
    Wifi,
    Tv,
    Coffee,
    Bath,
    Car,
    UtensilsCrossed,
    Snowflake,
    Wine,
    Waves,
    Sun,
    Mountain,
    Home,
    Sparkles,
    Check,
    Star,
    Shield,
    Clock
} from "lucide-react"

// Map amenity names to icons
const amenityIcons: Record<string, any> = {
    'wifi': Wifi,
    'air conditioning': Snowflake,
    'tv': Tv,
    'smart tv': Tv,
    'coffee maker': Coffee,
    'coffee': Coffee,
    'ensuite bathroom': Bath,
    'bathroom': Bath,
    'parking': Car,
    'free parking': Car,
    'restaurant': UtensilsCrossed,
    'mini bar': Wine,
    'mini fridge': Wine,
    'pool': Waves,
    'pool view': Waves,
    'pool access': Waves,
    'jacuzzi': Waves,
    'balcony': Sun,
    'garden view': Mountain,
    'sunset view': Sun,
    'panoramic view': Mountain,
    'living area': Home,
    'living room': Home,
    'kitchenette': UtensilsCrossed,
    'full kitchen': UtensilsCrossed,
    'work desk': Sparkles,
    'office space': Sparkles,
    'default': Star
}

function getAmenityIcon(amenity: string) {
    const lowerAmenity = amenity.toLowerCase().trim()
    for (const [key, icon] of Object.entries(amenityIcons)) {
        if (lowerAmenity.includes(key)) {
            return icon
        }
    }
    return amenityIcons.default
}

export default async function RoomPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const room = await prisma.room.findUnique({
        where: { id },
        include: {
            images: {
                orderBy: { order: 'asc' }
            }
        }
    })

    if (!room) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <Home className="w-8 h-8 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold">Room not found</h1>
                <p className="text-muted-foreground text-center">The room you're looking for doesn't exist or has been removed.</p>
                <Button asChild>
                    <Link href="/#rooms">Browse All Rooms</Link>
                </Button>
            </div>
        )
    }

    const amenitiesList = room.amenities?.split(',').map(a => a.trim()).filter(Boolean) || []

    return (
        <div className="min-h-screen bg-background">
            {/* Fixed Header */}
            <RoomHeader />

            {/* Spacer for fixed header */}
            <div className="h-16" />

            {/* Image Gallery */}
            <RoomImageGallery images={room.images} roomName={room.name} />

            {/* Mobile Price Bar - Fixed at bottom on mobile */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border p-4 safe-area-bottom">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-2xl font-bold text-primary">
                            GHS {room.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">per night</p>
                    </div>
                    <Button asChild size="lg" className="flex-1 max-w-[200px]">
                        <a href="#booking">
                            {room.isAvailable ? "Book Now" : "View Details"}
                        </a>
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 pb-32 lg:pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Left Column - Room Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Room Header */}
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant={room.isAvailable ? "secondary" : "destructive"}>
                                    {room.isAvailable ? "Available" : "Currently Booked"}
                                </Badge>
                                <Badge variant="outline" className="gap-1">
                                    <Users className="w-3 h-3" />
                                    Up to {room.capacity} guests
                                </Badge>
                            </div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                                {room.name}
                            </h1>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>Bezpoke Living, Accra, Ghana</span>
                            </div>
                            {/* Desktop Price */}
                            <div className="hidden lg:flex items-baseline gap-2 pt-2">
                                <span className="text-4xl font-bold text-primary">
                                    GHS {room.price.toLocaleString()}
                                </span>
                                <span className="text-muted-foreground">/ night</span>
                            </div>
                        </div>

                        {/* Highlights */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 rounded-xl bg-muted/30 border border-border/50">
                                <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                                <p className="text-xs text-muted-foreground">Secure</p>
                                <p className="text-sm font-medium">24/7 Security</p>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-muted/30 border border-border/50">
                                <Sparkles className="w-6 h-6 mx-auto mb-2 text-primary" />
                                <p className="text-xs text-muted-foreground">Clean</p>
                                <p className="text-sm font-medium">Daily Service</p>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-muted/30 border border-border/50">
                                <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                                <p className="text-xs text-muted-foreground">Support</p>
                                <p className="text-sm font-medium">24/7 Reception</p>
                            </div>
                        </div>

                        {/* Description */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold">About this Room</h2>
                            <p className="text-muted-foreground leading-relaxed text-base">
                                {room.description || "Experience comfort and luxury in this beautifully appointed room. Perfect for travelers seeking a peaceful retreat with modern amenities and exceptional service."}
                            </p>
                        </section>

                        {/* Amenities */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold">What's Included</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {amenitiesList.map((amenity, i) => {
                                    const IconComponent = getAmenityIcon(amenity)
                                    return (
                                        <div
                                            key={i}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50 hover:border-primary/20 transition-colors"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                <IconComponent className="w-5 h-5 text-primary" />
                                            </div>
                                            <span className="text-sm font-medium">{amenity}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>

                        {/* House Rules */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold">House Rules</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-medium">Check-in</p>
                                        <p className="text-sm text-muted-foreground">From 2:00 PM</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-medium">Check-out</p>
                                        <p className="text-sm text-muted-foreground">Before 11:00 AM</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-medium">No Smoking</p>
                                        <p className="text-sm text-muted-foreground">Smoking not allowed indoors</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-medium">Pets</p>
                                        <p className="text-sm text-muted-foreground">Pets not allowed</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Location Preview */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold">Location</h2>
                            <div className="aspect-video rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center">
                                <div className="text-center p-8">
                                    <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                                    <p className="font-medium">Bezpoke Living</p>
                                    <p className="text-sm text-muted-foreground">Accra, Greater Accra Region, Ghana</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column - Booking Form */}
                    <div className="lg:col-span-1">
                        <div id="booking" className="lg:sticky lg:top-24">
                            <BookingForm
                                roomId={room.id}
                                roomPrice={room.price}
                                isAvailable={room.isAvailable}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
