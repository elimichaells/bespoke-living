'use server'

import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File | null

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            )
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
                { status: 400 }
            )
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 5MB.' },
                { status: 400 }
            )
        }

        // Create unique filename
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const timestamp = Date.now()
        const extension = file.name.split('.').pop()
        const filename = `room-${timestamp}.${extension}`

        // Ensure uploads directory exists
        const uploadDir = path.join(process.cwd(), 'public', 'images', 'rooms')
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true })
        }

        // Write file
        const filepath = path.join(uploadDir, filename)
        await writeFile(filepath, buffer)

        // Return the public URL
        const url = `/images/rooms/${filename}`

        return NextResponse.json({ success: true, url })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        )
    }
}
