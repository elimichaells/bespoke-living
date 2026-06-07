import { getRooms, deleteRoom } from "@/app/actions"

type Room = Awaited<ReturnType<typeof getRooms>>[number]
type RoomImage = Room['images'][number]
import { RoomActionDialog } from "@/components/admin/room-dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, ImageIcon } from "lucide-react"
import Image from "next/image"

export default async function AdminRoomsPage() {
    const rooms = await getRooms()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Rooms</h1>
                <RoomActionDialog />
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-20">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Capacity</TableHead>
                            <TableHead>Images</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rooms.map((room: Room) => {
                            const primaryImage = room.images?.find((img: RoomImage) => img.isPrimary) || room.images?.[0]
                            return (
                                <TableRow key={room.id}>
                                    <TableCell>
                                        <div className="relative w-16 h-12 rounded overflow-hidden bg-muted">
                                            {primaryImage ? (
                                                <Image
                                                    src={primaryImage.url}
                                                    alt={primaryImage.alt || room.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                    <ImageIcon className="w-5 h-5" />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{room.name}</TableCell>
                                    <TableCell>GHS {room.price.toLocaleString()}</TableCell>
                                    <TableCell>{room.capacity}</TableCell>
                                    <TableCell>{room.images?.length || 0}</TableCell>
                                    <TableCell>{room.isAvailable ? "Available" : "Unavailable"}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <RoomActionDialog room={room} />
                                            <form action={async () => {
                                                'use server'
                                                await deleteRoom(room.id)
                                            }}>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/90">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </form>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        {rooms.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                    No rooms found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
