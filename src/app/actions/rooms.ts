'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export type RoomImageInput = {
    url: string
    alt?: string
    isPrimary?: boolean
    order?: number
}

export async function createRoom(formData: FormData) {
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const capacity = parseInt(formData.get('capacity') as string)
    const amenities = formData.get('amenities') as string
    const imagesJson = formData.get('images') as string

    let images: RoomImageInput[] = []
    try {
        images = imagesJson ? JSON.parse(imagesJson) : []
    } catch {
        images = []
    }

    try {
        await prisma.room.create({
            data: {
                name,
                description,
                price,
                capacity,
                amenities,
                isAvailable: true,
                images: {
                    create: images.map((img, index) => ({
                        url: img.url,
                        alt: img.alt || name,
                        isPrimary: index === 0,
                        order: index,
                    })),
                },
            }
        })
        revalidatePath('/admin/rooms')
        revalidatePath('/')
        return { success: true }
    } catch (e) {
        console.error(e)
        return { success: false, error: 'Failed to create room' }
    }
}

export async function updateRoom(id: string, formData: FormData) {
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const capacity = parseInt(formData.get('capacity') as string)
    const amenities = formData.get('amenities') as string
    const imagesJson = formData.get('images') as string

    let images: RoomImageInput[] = []
    try {
        images = imagesJson ? JSON.parse(imagesJson) : []
    } catch {
        images = []
    }

    try {
        // Update room details
        await prisma.room.update({
            where: { id },
            data: {
                name,
                description,
                price,
                capacity,
                amenities,
            }
        })

        // Delete existing images and create new ones
        await prisma.roomImage.deleteMany({
            where: { roomId: id },
        })

        if (images.length > 0) {
            await prisma.roomImage.createMany({
                data: images.map((img, index) => ({
                    url: img.url,
                    alt: img.alt || name,
                    isPrimary: index === 0,
                    order: index,
                    roomId: id,
                })),
            })
        }

        revalidatePath('/admin/rooms')
        revalidatePath('/')
        revalidatePath(`/room/${id}`)
        return { success: true }
    } catch (e) {
        console.error(e)
        return { success: false, error: 'Failed to update room' }
    }
}

export async function addRoomImage(roomId: string, imageData: RoomImageInput) {
    try {
        // Get current max order
        const maxOrder = await prisma.roomImage.findFirst({
            where: { roomId },
            orderBy: { order: 'desc' },
            select: { order: true },
        })

        const newOrder = (maxOrder?.order ?? -1) + 1

        // If this is the first image, make it primary
        const imageCount = await prisma.roomImage.count({ where: { roomId } })

        await prisma.roomImage.create({
            data: {
                url: imageData.url,
                alt: imageData.alt,
                isPrimary: imageCount === 0,
                order: newOrder,
                roomId,
            },
        })

        revalidatePath('/admin/rooms')
        revalidatePath('/')
        revalidatePath(`/room/${roomId}`)
        return { success: true }
    } catch (e) {
        console.error(e)
        return { success: false, error: 'Failed to add image' }
    }
}

export async function deleteRoomImage(imageId: string) {
    try {
        const image = await prisma.roomImage.findUnique({
            where: { id: imageId },
            select: { roomId: true, isPrimary: true },
        })

        if (!image) {
            return { success: false, error: 'Image not found' }
        }

        await prisma.roomImage.delete({ where: { id: imageId } })

        // If deleted image was primary, make the first remaining image primary
        if (image.isPrimary) {
            const firstImage = await prisma.roomImage.findFirst({
                where: { roomId: image.roomId },
                orderBy: { order: 'asc' },
            })

            if (firstImage) {
                await prisma.roomImage.update({
                    where: { id: firstImage.id },
                    data: { isPrimary: true },
                })
            }
        }

        revalidatePath('/admin/rooms')
        revalidatePath('/')
        revalidatePath(`/room/${image.roomId}`)
        return { success: true }
    } catch (e) {
        console.error(e)
        return { success: false, error: 'Failed to delete image' }
    }
}

export async function setPrimaryImage(imageId: string) {
    try {
        const image = await prisma.roomImage.findUnique({
            where: { id: imageId },
            select: { roomId: true },
        })

        if (!image) {
            return { success: false, error: 'Image not found' }
        }

        // Remove primary from all images in this room
        await prisma.roomImage.updateMany({
            where: { roomId: image.roomId },
            data: { isPrimary: false },
        })

        // Set this image as primary
        await prisma.roomImage.update({
            where: { id: imageId },
            data: { isPrimary: true },
        })

        revalidatePath('/admin/rooms')
        revalidatePath('/')
        revalidatePath(`/room/${image.roomId}`)
        return { success: true }
    } catch (e) {
        console.error(e)
        return { success: false, error: 'Failed to set primary image' }
    }
}
