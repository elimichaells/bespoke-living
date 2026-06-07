"use client"

import { updateBookingStatus } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useState } from "react"
import { Check, X, Loader2 } from "lucide-react"

export function BookingStatusActions({ bookingId, status }: { bookingId: string, status: string }) {
    const [isLoading, setIsLoading] = useState(false)

    const handleUpdate = async (newStatus: string) => {
        setIsLoading(true)
        try {
            await updateBookingStatus(bookingId, newStatus)
            toast.success(`Booking marked as ${newStatus}`)
        } catch (error) {
            toast.error("Failed to update booking")
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
    }

    if (status === 'PENDING') {
        return (
            <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleUpdate('CONFIRMED')}>
                    <Check className="w-4 h-4 mr-1" /> Confirm
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleUpdate('CANCELLED')}>
                    <X className="w-4 h-4 mr-1" /> Cancel
                </Button>
            </div>
        )
    }

    return (
        <span className={`text-sm font-medium ${status === 'CONFIRMED' ? 'text-green-600' :
                status === 'CANCELLED' ? 'text-red-600' : 'text-muted-foreground'
            }`}>
            {status}
        </span>
    )
}
