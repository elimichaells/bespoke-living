const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    // Seed Admin User
    const email = 'admin@nanalodge.com'
    const password = await bcrypt.hash('password123', 10)

    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            password,
            name: 'Admin User',
            role: 'ADMIN',
        },
    })

    console.log('Created admin user:', user.email)

    // Seed Rooms (prices in GHS - Ghana Cedis)
    const rooms = [
        {
            name: 'Standard Single Room',
            description: 'A cozy single room perfect for solo travelers. Features a comfortable single bed, work desk, and ensuite bathroom.',
            price: 450,
            capacity: 1,
            amenities: 'WiFi,Air Conditioning,TV,Work Desk,Ensuite Bathroom',
            isAvailable: true,
            images: [
                { url: '/images/rooms/standard-single-1.jpg', alt: 'Standard Single Room - Main View', isPrimary: true, order: 0 },
                { url: '/images/rooms/standard-single-2.jpg', alt: 'Standard Single Room - Bathroom', isPrimary: false, order: 1 },
            ],
        },
        {
            name: 'Standard Double Room',
            description: 'Comfortable room with a queen-sized bed, ideal for couples or single travelers who prefer more space.',
            price: 650,
            capacity: 2,
            amenities: 'WiFi,Air Conditioning,TV,Mini Fridge,Ensuite Bathroom,Coffee Maker',
            isAvailable: true,
            images: [
                { url: '/images/rooms/standard-double-1.jpg', alt: 'Standard Double Room - Main View', isPrimary: true, order: 0 },
                { url: '/images/rooms/standard-double-2.jpg', alt: 'Standard Double Room - Bathroom', isPrimary: false, order: 1 },
            ],
        },
        {
            name: 'Deluxe Double Room',
            description: 'Spacious room featuring a king-sized bed, sitting area, and beautiful garden views.',
            price: 950,
            capacity: 2,
            amenities: 'WiFi,Air Conditioning,Smart TV,Mini Bar,Ensuite Bathroom,Coffee Maker,Balcony,Garden View',
            isAvailable: false, // Mark as booked for testing
            images: [
                { url: '/images/rooms/deluxe-double-1.jpg', alt: 'Deluxe Double Room - Main View', isPrimary: true, order: 0 },
                { url: '/images/rooms/deluxe-double-2.jpg', alt: 'Deluxe Double Room - Sitting Area', isPrimary: false, order: 1 },
                { url: '/images/rooms/deluxe-double-3.jpg', alt: 'Deluxe Double Room - Balcony', isPrimary: false, order: 2 },
            ],
        },
        {
            name: 'Twin Room',
            description: 'Perfect for friends or colleagues traveling together. Features two comfortable single beds.',
            price: 700,
            capacity: 2,
            amenities: 'WiFi,Air Conditioning,TV,Work Desk,Ensuite Bathroom',
            isAvailable: true,
            images: [
                { url: '/images/rooms/twin-room-1.jpg', alt: 'Twin Room - Main View', isPrimary: true, order: 0 },
                { url: '/images/rooms/twin-room-2.jpg', alt: 'Twin Room - Bathroom', isPrimary: false, order: 1 },
            ],
        },
        {
            name: 'Family Suite',
            description: 'Spacious suite with a king bed and two single beds, perfect for families. Includes a separate living area.',
            price: 1500,
            capacity: 4,
            amenities: 'WiFi,Air Conditioning,Smart TV,Mini Bar,Ensuite Bathroom,Coffee Maker,Living Area,Kitchenette',
            isAvailable: true,
            images: [
                { url: '/images/rooms/family-suite-1.jpg', alt: 'Family Suite - Master Bedroom', isPrimary: true, order: 0 },
                { url: '/images/rooms/family-suite-2.jpg', alt: 'Family Suite - Kids Room', isPrimary: false, order: 1 },
                { url: '/images/rooms/family-suite-3.jpg', alt: 'Family Suite - Living Area', isPrimary: false, order: 2 },
                { url: '/images/rooms/family-suite-4.jpg', alt: 'Family Suite - Kitchenette', isPrimary: false, order: 3 },
            ],
        },
        {
            name: 'Executive Suite',
            description: 'Luxurious suite designed for business travelers. Features a separate office space and premium amenities.',
            price: 1800,
            capacity: 2,
            amenities: 'WiFi,Air Conditioning,Smart TV,Mini Bar,Ensuite Bathroom,Coffee Maker,Office Space,Printer,Meeting Table',
            isAvailable: true,
            images: [
                { url: '/images/rooms/executive-suite-1.jpg', alt: 'Executive Suite - Main View', isPrimary: true, order: 0 },
                { url: '/images/rooms/executive-suite-2.jpg', alt: 'Executive Suite - Office Space', isPrimary: false, order: 1 },
                { url: '/images/rooms/executive-suite-3.jpg', alt: 'Executive Suite - Bathroom', isPrimary: false, order: 2 },
            ],
        },
        {
            name: 'Honeymoon Suite',
            description: 'Romantic suite with a king-sized canopy bed, jacuzzi tub, and private balcony with sunset views.',
            price: 2200,
            capacity: 2,
            amenities: 'WiFi,Air Conditioning,Smart TV,Mini Bar,Jacuzzi,Ensuite Bathroom,Coffee Maker,Balcony,Sunset View,Champagne Service',
            isAvailable: false, // Mark as booked for testing
            images: [
                { url: '/images/rooms/honeymoon-suite-1.jpg', alt: 'Honeymoon Suite - Canopy Bed', isPrimary: true, order: 0 },
                { url: '/images/rooms/honeymoon-suite-2.jpg', alt: 'Honeymoon Suite - Jacuzzi', isPrimary: false, order: 1 },
                { url: '/images/rooms/honeymoon-suite-3.jpg', alt: 'Honeymoon Suite - Sunset Balcony', isPrimary: false, order: 2 },
            ],
        },
        {
            name: 'Garden View Room',
            description: 'Peaceful room overlooking our lush tropical gardens. Perfect for nature lovers seeking tranquility.',
            price: 800,
            capacity: 2,
            amenities: 'WiFi,Air Conditioning,TV,Ensuite Bathroom,Coffee Maker,Garden View,Patio',
            isAvailable: true,
            images: [
                { url: '/images/rooms/garden-view-1.jpg', alt: 'Garden View Room - Main View', isPrimary: true, order: 0 },
                { url: '/images/rooms/garden-view-2.jpg', alt: 'Garden View Room - Patio', isPrimary: false, order: 1 },
            ],
        },
        {
            name: 'Pool View Room',
            description: 'Modern room with direct views of the swimming pool. Easy access to pool area and outdoor activities.',
            price: 850,
            capacity: 2,
            amenities: 'WiFi,Air Conditioning,TV,Mini Fridge,Ensuite Bathroom,Pool View,Pool Access',
            isAvailable: true,
            images: [
                { url: '/images/rooms/pool-view-1.jpg', alt: 'Pool View Room - Main View', isPrimary: true, order: 0 },
                { url: '/images/rooms/pool-view-2.jpg', alt: 'Pool View Room - Pool View', isPrimary: false, order: 1 },
            ],
        },
        {
            name: 'Presidential Suite',
            description: 'Our most luxurious accommodation featuring two bedrooms, full living room, dining area, and panoramic views.',
            price: 3500,
            capacity: 4,
            amenities: 'WiFi,Air Conditioning,Smart TV,Full Bar,Jacuzzi,Ensuite Bathrooms,Full Kitchen,Living Room,Dining Room,Panoramic View,Butler Service,Private Entrance',
            isAvailable: true,
            images: [
                { url: '/images/rooms/presidential-suite-1.jpg', alt: 'Presidential Suite - Master Bedroom', isPrimary: true, order: 0 },
                { url: '/images/rooms/presidential-suite-2.jpg', alt: 'Presidential Suite - Living Room', isPrimary: false, order: 1 },
                { url: '/images/rooms/presidential-suite-3.jpg', alt: 'Presidential Suite - Dining Area', isPrimary: false, order: 2 },
                { url: '/images/rooms/presidential-suite-4.jpg', alt: 'Presidential Suite - Kitchen', isPrimary: false, order: 3 },
                { url: '/images/rooms/presidential-suite-5.jpg', alt: 'Presidential Suite - Panoramic View', isPrimary: false, order: 4 },
            ],
        },
    ]

    for (const roomData of rooms) {
        const { images, ...room } = roomData
        const roomId = room.name.toLowerCase().replace(/\s+/g, '-')

        const createdRoom = await prisma.room.upsert({
            where: { id: roomId },
            update: {
                name: room.name,
                description: room.description,
                price: room.price,
                capacity: room.capacity,
                amenities: room.amenities,
                isAvailable: room.isAvailable,
            },
            create: {
                id: roomId,
                ...room,
            },
        })

        // Delete existing images for this room and recreate
        await prisma.roomImage.deleteMany({
            where: { roomId: createdRoom.id },
        })

        // Create new images
        for (const image of images) {
            await prisma.roomImage.create({
                data: {
                    ...image,
                    roomId: createdRoom.id,
                },
            })
        }

        console.log(`Created room: ${createdRoom.name} with ${images.length} images`)
    }

    console.log(`\nSeeded ${rooms.length} rooms successfully!`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
