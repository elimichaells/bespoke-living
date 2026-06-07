"use client"

import { useState, useRef } from "react"
import { createRoom, updateRoom } from "@/app/actions/rooms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Plus, Pencil, Loader2, Upload, X, ImageIcon, Star } from "lucide-react"
import Image from "next/image"

type RoomImage = {
    id?: string
    url: string
    alt?: string | null
    isPrimary: boolean
    order: number
}

type Room = {
    id?: string
    name: string
    description: string | null
    price: number
    capacity: number
    amenities: string | null
    images?: RoomImage[]
}

export function RoomActionDialog({ room }: { room?: Room }) {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [images, setImages] = useState<RoomImage[]>(room?.images || [])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const isEdit = !!room

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files
        if (!files || files.length === 0) return

        setIsUploading(true)

        for (const file of Array.from(files)) {
            const formData = new FormData()
            formData.append('file', file)

            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                })

                const result = await response.json()

                if (result.success) {
                    setImages(prev => [
                        ...prev,
                        {
                            url: result.url,
                            alt: file.name.replace(/\.[^/.]+$/, ""),
                            isPrimary: prev.length === 0,
                            order: prev.length,
                        }
                    ])
                } else {
                    toast.error(result.error || 'Failed to upload image')
                }
            } catch {
                toast.error('Failed to upload image')
            }
        }

        setIsUploading(false)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    function removeImage(index: number) {
        setImages(prev => {
            const newImages = prev.filter((_, i) => i !== index)
            // If we removed the primary image, make the first one primary
            if (prev[index].isPrimary && newImages.length > 0) {
                newImages[0].isPrimary = true
            }
            // Reorder
            return newImages.map((img, i) => ({ ...img, order: i }))
        })
    }

    function setPrimaryImage(index: number) {
        setImages(prev => prev.map((img, i) => ({
            ...img,
            isPrimary: i === index,
        })))
    }

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)

        // Add images as JSON
        formData.set('images', JSON.stringify(images))

        let result

        if (isEdit && room?.id) {
            result = await updateRoom(room.id, formData)
        } else {
            result = await createRoom(formData)
        }

        setIsSubmitting(false)

        if (result.success) {
            toast.success(isEdit ? "Room updated successfully" : "Room created successfully")
            setOpen(false)
            if (!isEdit) {
                setImages([])
            }
        } else {
            toast.error(result.error || (isEdit ? "Failed to update room" : "Failed to create room"))
        }
    }

    function handleOpenChange(newOpen: boolean) {
        setOpen(newOpen)
        if (newOpen) {
            setImages(room?.images || [])
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {isEdit ? (
                    <Button variant="ghost" size="icon"><Pencil className="w-4 h-4" /></Button>
                ) : (
                    <Button><Plus className="w-4 h-4 mr-2" /> Add Room</Button>
                )}
            </DialogTrigger>
            <DialogContent className="overflow-y-auto max-h-[90vh] max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Room" : "Create New Room"}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? "Update the room details below." : "Add a new room to the available listings."}
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Room Name</Label>
                        <Input id="name" name="name" required placeholder="e.g. Deluxe Suite" defaultValue={room?.name} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" required placeholder="Room details..." defaultValue={room?.description || ""} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price per night (GHS)</Label>
                            <Input id="price" name="price" type="number" min="0" step="0.01" required defaultValue={room?.price} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="capacity">Capacity (guests)</Label>
                            <Input id="capacity" name="capacity" type="number" min="1" required defaultValue={room?.capacity} />
                        </div>
                    </div>

                    {/* Multiple Image Upload Section */}
                    <div className="space-y-2">
                        <Label>Room Images</Label>
                        <p className="text-xs text-muted-foreground">Upload multiple images. Click the star to set the primary image.</p>

                        {/* Image Grid */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-3 gap-3">
                                {images.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <div className="relative w-full aspect-video rounded-md overflow-hidden bg-muted">
                                            <Image
                                                src={image.url}
                                                alt={image.alt || "Room image"}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        {/* Primary indicator / button */}
                                        <Button
                                            type="button"
                                            variant={image.isPrimary ? "default" : "secondary"}
                                            size="icon"
                                            className="absolute top-1 left-1 h-6 w-6"
                                            onClick={() => setPrimaryImage(index)}
                                            title={image.isPrimary ? "Primary image" : "Set as primary"}
                                        >
                                            <Star className={`w-3 h-3 ${image.isPrimary ? "fill-current" : ""}`} />
                                        </Button>
                                        {/* Remove button */}
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => removeImage(index)}
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Upload Area */}
                        <div className="border-2 border-dashed rounded-lg p-4 transition-colors hover:border-primary/50">
                            <label className="flex flex-col items-center justify-center h-24 cursor-pointer">
                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="w-8 h-8 mb-2 animate-spin" />
                                            <span className="text-sm">Uploading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <ImageIcon className="w-8 h-8 mb-2" />
                                            <span className="text-sm font-medium">Click to upload images</span>
                                            <span className="text-xs mt-1">PNG, JPG, WebP up to 5MB each</span>
                                        </>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                    disabled={isUploading}
                                    multiple
                                />
                            </label>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            {isUploading ? "Uploading..." : "Add Images"}
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amenities">Amenities (comma separated)</Label>
                        <Input id="amenities" name="amenities" placeholder="WiFi, AC, TV, Pool Access" defaultValue={room?.amenities || ""} />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting || isUploading}>
                            {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : (isEdit ? "Update Room" : "Create Room")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
