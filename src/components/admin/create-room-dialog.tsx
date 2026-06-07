"use client"

import { useState } from "react"
import { createRoom } from "@/app/actions/rooms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Plus } from "lucide-react"

export function CreateRoomDialog() {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)
        const result = await createRoom(formData)
        setIsSubmitting(false)

        if (result.success) {
            toast.success("Room created successfully")
            setOpen(false)
        } else {
            toast.error(result.error || "Failed to create room")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-2" /> Add Room</Button>
            </DialogTrigger>
            <DialogContent className="overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Create New Room</DialogTitle>
                    <DialogDescription>
                        Add a new room to the available listings.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Room Name</Label>
                        <Input id="name" name="name" required placeholder="e.g. Deluxe Suite" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" required placeholder="Room details..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (per night)</Label>
                            <Input id="price" name="price" type="number" min="0" step="0.01" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="capacity">Capacity (guests)</Label>
                            <Input id="capacity" name="capacity" type="number" min="1" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input id="imageUrl" name="imageUrl" type="url" placeholder="https://..." />
                    </div>
                    {/* Amenities could be a multi-select, keep simple for now */}
                    {/* <div className="space-y-2">
                        <Label htmlFor="amenities">Amenities (comma separated)</Label>
                        <Input id="amenities" name="amenities" placeholder="WiFi, AC, TV" />
                    </div> */}
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Room"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
