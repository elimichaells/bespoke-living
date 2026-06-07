import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function BookingConfirmationPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="max-w-md w-full text-center border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full">
                        <CheckCircle2 className="w-12 h-12 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Booking Request Received!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                    <p>
                        Thank you for your booking request. We have received your details and are holding the room for you.
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg text-left text-sm space-y-2">
                        <p className="font-semibold text-foreground">Next Steps:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Our team will review your request.</li>
                            <li>You will receive an email with payment instructions shortly.</li>
                            <li>Once payment is confirmed, your booking will be finalized.</li>
                        </ul>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button asChild>
                        <Link href="/">Back to Home</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
