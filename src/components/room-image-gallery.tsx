"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, ImageIcon, X, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"

type RoomImage = {
    id: string
    url: string
    alt: string | null
    isPrimary: boolean
    order: number
}

interface RoomImageGalleryProps {
    images: RoomImage[]
    roomName: string
}

export function RoomImageGallery({ images, roomName }: RoomImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [touchEnd, setTouchEnd] = useState<number | null>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)

    // Find primary image index or default to 0
    const primaryIndex = images.findIndex(img => img.isPrimary)
    const initialIndex = primaryIndex >= 0 ? primaryIndex : 0

    useEffect(() => {
        setCurrentIndex(initialIndex)
    }, [initialIndex])

    // Handle keyboard navigation in fullscreen
    useEffect(() => {
        if (!isFullscreen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsFullscreen(false)
            if (e.key === 'ArrowLeft') goToPrevious()
            if (e.key === 'ArrowRight') goToNext()
        }

        window.addEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'hidden'

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [isFullscreen])

    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }, [images.length])

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }, [images.length])

    const goToIndex = (index: number) => {
        setCurrentIndex(index)
    }

    // Touch handlers for swipe
    const minSwipeDistance = 50

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null)
        setTouchStart(e.targetTouches[0].clientX)
    }

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance

        if (isLeftSwipe) {
            goToNext()
        } else if (isRightSwipe) {
            goToPrevious()
        }
    }

    // If no images, show placeholder
    if (images.length === 0) {
        return (
            <div className="relative h-[40vh] md:h-[50vh] w-full bg-muted flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No images available</p>
                </div>
            </div>
        )
    }

    const currentImage = images[currentIndex]

    return (
        <>
            {/* Main Gallery */}
            <div
                className="relative h-[40vh] md:h-[50vh] w-full bg-black overflow-hidden"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {/* Main Image */}
                <div className="relative h-full w-full">
                    <Image
                        src={currentImage.url}
                        alt={currentImage.alt || roomName}
                        fill
                        className="object-cover transition-opacity duration-300"
                        priority
                        sizes="100vw"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
                </div>

                {/* Fullscreen Button */}
                <button
                    onClick={() => setIsFullscreen(true)}
                    className="absolute top-4 left-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
                    aria-label="View fullscreen"
                >
                    <ZoomIn className="w-5 h-5" />
                </button>

                {/* Navigation Arrows - only show if more than 1 image */}
                {images.length > 1 && (
                    <>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white border-0 z-10 w-10 h-10 md:w-12 md:h-12"
                            onClick={goToPrevious}
                        >
                            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                        </Button>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white border-0 z-10 w-10 h-10 md:w-12 md:h-12"
                            onClick={goToNext}
                        >
                            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                        </Button>
                    </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium text-white z-10">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}

                {/* Dot Indicators - Mobile */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 md:hidden">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToIndex(index)}
                                className={cn(
                                    "h-1.5 rounded-full transition-all duration-300",
                                    currentIndex === index
                                        ? "bg-white w-6"
                                        : "bg-white/50 w-1.5 hover:bg-white/70"
                                )}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Thumbnail Strip - Desktop */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 hidden md:block">
                        <div className="flex gap-2 p-2 bg-black/50 backdrop-blur-sm rounded-xl">
                            {images.map((image, index) => (
                                <button
                                    key={image.id}
                                    onClick={() => goToIndex(index)}
                                    className={cn(
                                        "relative w-14 h-10 lg:w-16 lg:h-12 rounded-lg overflow-hidden transition-all duration-200",
                                        currentIndex === index
                                            ? "ring-2 ring-white scale-105"
                                            : "opacity-60 hover:opacity-100"
                                    )}
                                >
                                    <Image
                                        src={image.url}
                                        alt={image.alt || `${roomName} - Image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div
                    className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
                    onClick={() => setIsFullscreen(false)}
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setIsFullscreen(false)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-20"
                        aria-label="Close fullscreen"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Counter */}
                    <div className="absolute top-4 left-4 text-white/80 text-sm z-20">
                        {currentIndex + 1} / {images.length}
                    </div>

                    {/* Image */}
                    <div
                        className="relative w-full h-full"
                        onClick={(e) => e.stopPropagation()}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        <Image
                            src={currentImage.url}
                            alt={currentImage.alt || roomName}
                            fill
                            className="object-contain"
                            sizes="100vw"
                            priority
                        />
                    </div>

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    goToPrevious()
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-20"
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    goToNext()
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-20"
                            >
                                <ChevronRight className="w-8 h-8" />
                            </button>
                        </>
                    )}

                    {/* Thumbnail Strip */}
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                            <div className="flex gap-2 p-2 bg-white/10 backdrop-blur-sm rounded-xl">
                                {images.map((image, index) => (
                                    <button
                                        key={image.id}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            goToIndex(index)
                                        }}
                                        className={cn(
                                            "relative w-12 h-9 md:w-16 md:h-12 rounded-lg overflow-hidden transition-all duration-200",
                                            currentIndex === index
                                                ? "ring-2 ring-white"
                                                : "opacity-50 hover:opacity-100"
                                        )}
                                    >
                                        <Image
                                            src={image.url}
                                            alt={image.alt || `${roomName} - Image ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="64px"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}
