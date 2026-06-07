import { getBookings, getRooms } from "@/app/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BedDouble, Calendar, DollarSign, Users } from "lucide-react"

export default async function AdminDashboardPage() {
    const rooms = await getRooms()
    const bookings = await getBookings()

    const totalRevenue = bookings
        .filter((b: { status: string }) => b.status !== 'CANCELLED')
        .reduce((acc: any, curr: { totalAmount: any }) => acc + curr.totalAmount, 0)

    const confirmedBookings = bookings.filter((b: { status: string }) => b.status === 'CONFIRMED').length

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Estimate from non-cancelled bookings</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bookings</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{bookings.length}</div>
                        <p className="text-xs text-muted-foreground">{confirmedBookings} confirmed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rooms</CardTitle>
                        <BedDouble className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{rooms.length}</div>
                        <p className="text-xs text-muted-foreground">Total rooms available</p>
                    </CardContent>
                </Card>
                {/* <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Guests</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                         <div className="text-2xl font-bold">--</div>
                    </CardContent>
                </Card> */}
            </div>
        </div>
    )
}
