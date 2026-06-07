'use server'

import { prisma } from "@/lib/prisma"
import { comparePassword, login, logout } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function loginAction(prevState: any, formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
        return { error: "Please provide both email and password." }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return { error: "Invalid credentials." }
        }

        const isValid = await comparePassword(password, user.password)

        if (!isValid) {
            return { error: "Invalid credentials." }
        }

        await login(formData)
    } catch (error) {
        console.error(error)
        return { error: "Something went wrong." }
    }

    redirect("/admin")
}

export async function logoutAction() {
    await logout()
    redirect("/admin/login")
}
