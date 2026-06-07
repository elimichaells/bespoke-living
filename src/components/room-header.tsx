"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ChevronLeft } from "lucide-react"

export function RoomHeader() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between h-16">
                    <Button variant="ghost" size="sm" asChild className="gap-2">
                        <Link href="/#rooms">
                            <ChevronLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Back to Rooms</span>
                            <span className="sm:hidden">Back</span>
                        </Link>
                    </Button>
                    <Link href="/" className="text-lg font-bold">
                        Bezpoke Living
                    </Link>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    )
}
