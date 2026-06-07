"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface NavbarProps {
    variant?: "default" | "transparent"
}

export function Navbar({ variant = "default" }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 border-b transition-colors",
            variant === "transparent"
                ? "bg-background/80 backdrop-blur-md border-border/50"
                : "bg-background border-border"
        )}>
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="text-xl font-bold tracking-tight">
                        Bezpoke Living
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/#rooms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Rooms
                        </Link>
                        <Link href="/#amenities" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Amenities
                        </Link>
                        <Link href="/#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Contact
                        </Link>
                        <ThemeToggle />
                        <Button asChild size="sm">
                            <Link href="/#rooms">Book Now</Link>
                        </Button>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="flex items-center gap-2 md:hidden">
                        <ThemeToggle />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-border/50 animate-in slide-in-from-top-2 duration-200">
                        <div className="flex flex-col gap-3">
                            <Link
                                href="/#rooms"
                                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Rooms
                            </Link>
                            <Link
                                href="/#amenities"
                                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Amenities
                            </Link>
                            <Link
                                href="/#contact"
                                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Contact
                            </Link>
                            <div className="px-4 pt-2">
                                <Button asChild className="w-full">
                                    <Link href="/#rooms" onClick={() => setIsMenuOpen(false)}>
                                        Book Now
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
