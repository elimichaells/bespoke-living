import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Wifi, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type RoomImage = {
    id: string
    url: string
    alt: string | null
    isPrimary: boolean
    order: number
}

export interface RoomProps {
    id: string
    name: string
    description: string | null
    price: number
    capacity: number
    amenities: string | null
    isAvailable: boolean
    images?: RoomImage[]
}

export function RoomCard({ room }: { room: RoomProps }) {
    // Get primary image or first image
    const primaryImage = room.images?.find(img => img.isPrimary) || room.images?.[0]
    const imageUrl = primaryImage?.url
    const isBooked = !room.isAvailable

    return (
        <Card className={cn(
            "overflow-hidden group transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm",
            isBooked ? "opacity-60 grayscale hover:opacity-70" : "hover:shadow-lg"
        )}>
            <div className="relative h-64 w-full overflow-hidden bg-muted">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={primaryImage?.alt || room.name}
                        fill
                        className={cn(
                            "object-cover transition-transform duration-500",
                            !isBooked && "group-hover:scale-105"
                        )}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="w-12 h-12 opacity-50" />
                    </div>
                )}
                <div className="absolute top-4 right-4">
                    <Badge
                        variant={isBooked ? "destructive" : "secondary"}
                        className="backdrop-blur-md bg-background/80"
                    >
                        {isBooked ? "Booked" : "Available"}
                    </Badge>
                </div>
                {!isBooked && (
                    <div className="absolute bottom-4 left-4">
                        <Badge variant="outline" className="bg-background/80 backdrop-blur-md border-0">
                            GHS {room.price.toLocaleString()} / night
                        </Badge>
                    </div>
                )}
            </div>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className={cn(
                        "text-xl font-bold",
                        isBooked && "text-muted-foreground"
                    )}>
                        {room.name}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground line-clamp-2 text-sm">
                    {room.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{room.capacity} Guests</span>
                    </div>
                    {room.amenities?.toLowerCase().includes('wifi') && (
                        <div className="flex items-center gap-1">
                            <Wifi className="w-4 h-4" />
                            <span>WiFi</span>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="pt-0">
                {isBooked ? (
                    <Button className="w-full" size="lg" variant="secondary" disabled>
                        Currently Unavailable
                    </Button>
                ) : (
                    <Button asChild className="w-full" size="lg">
                        <Link href={`/room/${room.id}`}>
                            View Details & Book
                        </Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
