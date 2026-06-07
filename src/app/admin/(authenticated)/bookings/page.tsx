import { getBookings } from "@/app/actions"
import { BookingStatusActions } from "@/components/admin/booking-status-actions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"

export default async function AdminBookingsPage() {
    const bookings = await getBookings()

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Room</TableHead>
                            <TableHead>Dates</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell>
                                    <div className="font-medium">{booking.customerName}</div>
                                    <div className="text-sm text-muted-foreground">{booking.customerEmail}</div>
                                </TableCell>
                                <TableCell>{booking.room.name}</TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        {format(new Date(booking.checkIn), "MMM d")} - {format(new Date(booking.checkOut), "MMM d, yyyy")}
                                    </div>
                                </TableCell>
                                <TableCell>${booking.totalAmount}</TableCell>
                                <TableCell>
                                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                            booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {booking.status}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <BookingStatusActions bookingId={booking.id} status={booking.status} />
                                </TableCell>
                            </TableRow>
                        ))}
                        {bookings.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    No bookings found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
