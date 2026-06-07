'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getPaymentMethods() {
    return await prisma.paymentMethod.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
    })
}

export async function createPaymentMethod(prevState: any, formData: FormData) {
    const name = formData.get("name") as string
    const details = formData.get("details") as string
    const instructions = formData.get("instructions") as string

    if (!name || !details) {
        return { error: "Name and Details are required.", success: false }
    }

    try {
        await prisma.paymentMethod.create({
            data: {
                name,
                details,
                instructions,
                isActive: true
            }
        })
        revalidatePath("/admin/settings")
        revalidatePath("/rooms/[id]", 'page') // Revalidate booking form potentially
        return { success: true, error: "" }
    } catch (error) {
        return { error: "Failed to create payment method.", success: false }
    }
}

export async function deletePaymentMethod(id: string) {
    try {
        await prisma.paymentMethod.delete({ where: { id } })
        revalidatePath("/admin/settings")
    } catch (error) {
        console.error("Failed to delete payment method:", error)
    }
}

export async function togglePaymentMethod(id: string, isActive: boolean) {
    try {
        await prisma.paymentMethod.update({
            where: { id },
            data: { isActive }
        })
        revalidatePath("/admin/settings")
    } catch (error) {
        console.error("Failed to update payment method:", error)
    }
}
