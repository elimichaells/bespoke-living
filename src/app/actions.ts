'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getRooms() {
    return await prisma.room.findMany({
        include: {
            images: {
                orderBy: { order: 'asc' }
            }
        },
        orderBy: { createdAt: 'desc' }
    })
}

export async function deleteRoom(id: string) {
    await prisma.room.delete({ where: { id } })
    revalidatePath('/admin/rooms')
    revalidatePath('/')
}

export async function getBookings() {
    return await prisma.booking.findMany({
        include: { room: true },
        orderBy: { createdAt: 'desc' }
    })
}

export async function createBooking(data: {
    roomId: string,
    customerName: string,
    customerEmail: string,
    checkIn: Date,
    checkOut: Date,
    transactionId: string
}) {
    const { roomId, customerName, customerEmail, checkIn, checkOut, transactionId } = data

    // Calculate total days * price
    const room = await prisma.room.findUnique({ where: { id: roomId } })
    if (!room) return { success: false, message: 'Room not found' }

    const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    const totalAmount = (days > 0 ? days : 1) * room.price

    await prisma.booking.create({
        data: {
            roomId,
            customerName,
            customerEmail,
            checkIn,
            checkOut,
            totalAmount,
            status: 'PENDING',
            paymentDetails: 'Pending Payment Verification',
            transactionId
        }
    })

    revalidatePath('/admin/bookings')
    return { success: true, message: 'Booking created successfully' }
}

export async function updateBookingStatus(id: string, status: string) {
    await prisma.booking.update({
        where: { id },
        data: { status }
    })
    revalidatePath('/admin/bookings')
}
