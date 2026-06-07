"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createBooking } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format, differenceInDays } from "date-fns"
import {
    Calendar as CalendarIcon,
    Loader2,
    CheckCircle2,
    User,
    Mail,
    CreditCard,
    ArrowRight,
    ArrowLeft,
    Copy,
    Phone,
    Building2,
    Wallet,
    Check,
    Clock,
    Shield
} from "lucide-react"
import { getPaymentMethods } from "@/app/actions/settings"
import { toast } from "sonner"

type PaymentMethod = {
    id: string
    name: string
    details: string
    instructions: string | null
}

type Step = 1 | 2 | 3

interface BookingFormProps {
    roomId: string
    roomPrice: number
    isAvailable?: boolean
}

export function BookingForm({ roomId, roomPrice, isAvailable = true }: BookingFormProps) {
    const router = useRouter()
    const [step, setStep] = useState<Step>(1)
    const [checkIn, setCheckIn] = useState<Date>()
    const [checkOut, setCheckOut] = useState<Date>()
    const [customerName, setCustomerName] = useState("")
    const [customerEmail, setCustomerEmail] = useState("")
    const [transactionId, setTransactionId] = useState("")
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])

    useEffect(() => {
        getPaymentMethods().then(setPaymentMethods)
    }, [])

    const numberOfNights = checkIn && checkOut ? Math.max(differenceInDays(checkOut, checkIn), 1) : 0
    const totalAmount = numberOfNights * roomPrice

    const canProceedToStep2 = checkIn && checkOut && customerName.trim() && customerEmail.trim()
    const canProceedToStep3 = canProceedToStep2 && selectedPaymentMethod
    const canSubmit = canProceedToStep3 && transactionId.trim()

    const getPaymentIcon = (name: string) => {
        const lowerName = name.toLowerCase()
        if (lowerName.includes('momo') || lowerName.includes('mobile')) return <Phone className="w-5 h-5" />
        if (lowerName.includes('bank')) return <Building2 className="w-5 h-5" />
        return <Wallet className="w-5 h-5" />
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard!")
    }

    async function handleSubmit() {
        if (!checkIn || !checkOut || !canSubmit) return

        setIsSubmitting(true)

        try {
            const result = await createBooking({
                roomId,
                customerName,
                customerEmail,
                checkIn,
                checkOut,
                transactionId
            })

            if (result.success) {
                toast.success("Booking submitted successfully!")
                router.push(`/booking-confirmation?email=${encodeURIComponent(customerEmail)}`)
            } else {
                toast.error(result.message || "Failed to create booking")
            }
        } catch {
            toast.error("Something went wrong. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const stepTitles = {
        1: "Select Dates",
        2: "Make Payment",
        3: "Confirm Booking"
    }

    return (
        <Card className="border-border/50 bg-card shadow-xl overflow-hidden">
            {/* Header */}
            <CardHeader className="p-0">
                {/* Price Display */}
                <div className="p-5 bg-primary text-primary-foreground">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-xs text-primary-foreground/70 uppercase tracking-wide">Starting from</p>
                            <p className="text-3xl font-bold">GHS {roomPrice.toLocaleString()}</p>
                            <p className="text-sm text-primary-foreground/70">per night</p>
                        </div>
                        {numberOfNights > 0 && (
                            <div className="text-right">
                                <p className="text-xs text-primary-foreground/70">{numberOfNights} night{numberOfNights > 1 ? 's' : ''}</p>
                                <p className="text-xl font-bold">GHS {totalAmount.toLocaleString()}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Step Indicator */}
                {isAvailable && (
                    <div className="px-5 py-4 border-b border-border/50">
                        <div className="flex items-center justify-between mb-3">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center flex-1">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all shrink-0",
                                        step > s
                                            ? "bg-green-500 text-white"
                                            : step === s
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-muted-foreground"
                                    )}>
                                        {step > s ? <Check className="w-4 h-4" /> : s}
                                    </div>
                                    {s < 3 && (
                                        <div className={cn(
                                            "h-0.5 flex-1 mx-2 rounded-full transition-colors",
                                            step > s ? "bg-green-500" : "bg-muted"
                                        )} />
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="text-sm font-medium text-center">{stepTitles[step]}</p>
                    </div>
                )}
            </CardHeader>

            <CardContent className="p-5">
                {/* Room Unavailable State */}
                {!isAvailable ? (
                    <div className="text-center py-6">
                        <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                            <CalendarIcon className="w-7 h-7 text-destructive" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Room Unavailable</h3>
                        <p className="text-muted-foreground text-sm mb-5">
                            This room is currently booked. Please check back later or explore our other rooms.
                        </p>
                        <Button variant="outline" className="w-full" onClick={() => window.history.back()}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            View Other Rooms
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Step 1: Dates & Guest Info */}
                        {step === 1 && (
                            <div className="space-y-4">
                                {/* Date Selection */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-medium text-muted-foreground">Check-in</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal h-12 px-3",
                                                        !checkIn && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                                                    <span className="truncate">
                                                        {checkIn ? format(checkIn, "MMM d, yyyy") : "Select date"}
                                                    </span>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={checkIn}
                                                    onSelect={(date) => {
                                                        setCheckIn(date)
                                                        if (date && checkOut && date >= checkOut) {
                                                            setCheckOut(undefined)
                                                        }
                                                    }}
                                                    disabled={(date) => date < new Date()}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-medium text-muted-foreground">Check-out</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal h-12 px-3",
                                                        !checkOut && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                                                    <span className="truncate">
                                                        {checkOut ? format(checkOut, "MMM d, yyyy") : "Select date"}
                                                    </span>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={checkOut}
                                                    onSelect={setCheckOut}
                                                    disabled={(date) => date <= (checkIn || new Date())}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                {/* Guest Info */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="customerName" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                        <User className="w-3 h-3" /> Full Name
                                    </Label>
                                    <Input
                                        id="customerName"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        required
                                        placeholder="John Doe"
                                        className="h-12"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="customerEmail" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                        <Mail className="w-3 h-3" /> Email Address
                                    </Label>
                                    <Input
                                        id="customerEmail"
                                        type="email"
                                        value={customerEmail}
                                        onChange={(e) => setCustomerEmail(e.target.value)}
                                        required
                                        placeholder="john@example.com"
                                        className="h-12"
                                    />
                                </div>

                                {/* Trust Indicators */}
                                <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Shield className="w-3 h-3" /> Secure
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> Instant confirmation
                                    </span>
                                </div>

                                <Button
                                    className="w-full h-12 text-base"
                                    disabled={!canProceedToStep2}
                                    onClick={() => setStep(2)}
                                >
                                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </div>
                        )}

                        {/* Step 2: Payment Method Selection */}
                        {step === 2 && (
                            <div className="space-y-4">
                                {/* Amount Summary */}
                                <div className="bg-muted/50 rounded-xl p-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">
                                            GHS {roomPrice.toLocaleString()} × {numberOfNights} night{numberOfNights > 1 ? 's' : ''}
                                        </span>
                                        <span>GHS {totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg border-t border-border pt-2">
                                        <span>Total</span>
                                        <span className="text-primary">GHS {totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-semibold flex items-center gap-2 mb-3">
                                        <CreditCard className="w-4 h-4" /> Select Payment Method
                                    </Label>

                                    {paymentMethods.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Wallet className="w-10 h-10 mx-auto mb-3 opacity-50" />
                                            <p className="font-medium">No payment methods available</p>
                                            <p className="text-xs mt-1">Please contact the hotel directly.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {paymentMethods.map((method) => (
                                                <div
                                                    key={method.id}
                                                    onClick={() => setSelectedPaymentMethod(method.id)}
                                                    className={cn(
                                                        "border rounded-xl p-4 cursor-pointer transition-all",
                                                        selectedPaymentMethod === method.id
                                                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                                            : "border-border hover:border-primary/50 hover:bg-muted/30"
                                                    )}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={cn(
                                                            "p-2.5 rounded-xl transition-colors",
                                                            selectedPaymentMethod === method.id
                                                                ? "bg-primary text-primary-foreground"
                                                                : "bg-muted"
                                                        )}>
                                                            {getPaymentIcon(method.name)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold">{method.name}</p>
                                                            <div className="flex items-center gap-2 mt-1.5">
                                                                <code className="text-sm bg-muted px-2 py-1 rounded-md truncate max-w-[180px]">
                                                                    {method.details}
                                                                </code>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-7 w-7 shrink-0"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        copyToClipboard(method.details)
                                                                    }}
                                                                >
                                                                    <Copy className="w-3.5 h-3.5" />
                                                                </Button>
                                                            </div>
                                                            {method.instructions && (
                                                                <p className="text-xs text-muted-foreground mt-2">
                                                                    {method.instructions}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {selectedPaymentMethod === method.id && (
                                                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-12"
                                        onClick={() => setStep(1)}
                                    >
                                        <ArrowLeft className="mr-2 w-4 h-4" /> Back
                                    </Button>
                                    <Button
                                        className="flex-1 h-12"
                                        disabled={!canProceedToStep3}
                                        onClick={() => setStep(3)}
                                    >
                                        Continue <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Enter Transaction ID & Confirm */}
                        {step === 3 && (
                            <div className="space-y-4">
                                {/* Booking Summary */}
                                <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                                    <h4 className="font-semibold text-sm flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        Booking Summary
                                    </h4>
                                    <div className="space-y-2.5 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Check-in</span>
                                            <span className="font-medium">{checkIn && format(checkIn, "EEE, MMM d, yyyy")}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Check-out</span>
                                            <span className="font-medium">{checkOut && format(checkOut, "EEE, MMM d, yyyy")}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Guest</span>
                                            <span className="font-medium">{customerName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Email</span>
                                            <span className="font-medium text-xs truncate max-w-[180px]">{customerEmail}</span>
                                        </div>
                                    </div>
                                    <div className="border-t border-border pt-3 flex justify-between font-bold">
                                        <span>Total</span>
                                        <span className="text-primary">GHS {totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Selected Payment Method */}
                                <div className="border border-primary/30 rounded-xl p-4 bg-primary/5">
                                    <p className="text-xs text-muted-foreground mb-1">Payment sent to</p>
                                    <p className="font-semibold">
                                        {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
                                    </p>
                                    <code className="text-sm">
                                        {paymentMethods.find(m => m.id === selectedPaymentMethod)?.details}
                                    </code>
                                </div>

                                {/* Transaction ID Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="transactionId" className="text-sm font-semibold">
                                        Transaction ID / Reference
                                    </Label>
                                    <Input
                                        id="transactionId"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        required
                                        placeholder="Enter your payment reference"
                                        className="h-12 text-center font-mono text-base"
                                    />
                                    <p className="text-xs text-muted-foreground text-center">
                                        Enter the transaction ID from your payment confirmation
                                    </p>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-12"
                                        onClick={() => setStep(2)}
                                        disabled={isSubmitting}
                                    >
                                        <ArrowLeft className="mr-2 w-4 h-4" /> Back
                                    </Button>
                                    <Button
                                        className="flex-1 h-12"
                                        disabled={!canSubmit || isSubmitting}
                                        onClick={handleSubmit}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="mr-2 w-4 h-4" />
                                                Confirm
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    )
}
