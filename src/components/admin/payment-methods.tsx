'use client'

import { useActionState, useState } from "react"
import { createPaymentMethod, deletePaymentMethod, togglePaymentMethod } from "@/app/actions/settings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"

type PaymentMethod = {
    id: string
    name: string
    details: string
    instructions: string | null
    isActive: boolean
}

const initialState = { error: "", success: false }

export function PaymentMethodsList({ methods }: { methods: PaymentMethod[] }) {
    const [state, action, isPending] = useActionState(createPaymentMethod, initialState)
    const [isAdding, setIsAdding] = useState(false)

    // Reset form after success (rudimentary way, better with useEffect on state)
    if (state?.success && isAdding) {
        setIsAdding(false)
        toast.success("Payment Method Added")
        // Reset state manually or handle via key
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Payment Methods</h2>
                <Button onClick={() => setIsAdding(!isAdding)} size="sm">
                    {isAdding ? "Cancel" : <><Plus className="w-4 h-4 mr-2" /> Add Method</>}
                </Button>
            </div>

            {isAdding && (
                <Card>
                    <CardHeader>
                        <CardTitle>Add Payment Method</CardTitle>
                        <CardDescription>Add a new way for customers to pay.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={action} className="space-y-4">
                            {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Method Name (e.g. Momo, Bank)</Label>
                                <Input id="name" name="name" placeholder="MTN Mobile Money" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="details">Account Details</Label>
                                <Input id="details" name="details" placeholder="054XXXXXXX - John Doe" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="instructions">Instructions (Optional)</Label>
                                <Textarea id="instructions" name="instructions" placeholder="Please reset reference as..." />
                            </div>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? <Loader2 className="animate-spin w-4 h-4" /> : "Save Method"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4">
                {methods.map((method) => (
                    <Card key={method.id} className="flex flex-row items-center justify-between p-4">
                        <div className="space-y-1">
                            <h3 className="font-medium flex items-center gap-2">
                                {method.name}
                                <span className={`text-xs px-2 py-0.5 rounded-full ${method.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {method.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </h3>
                            <p className="text-sm text-muted-foreground">{method.details}</p>
                            {method.instructions && <p className="text-xs text-muted-foreground italic">{method.instructions}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={method.isActive}
                                onCheckedChange={(checked: boolean) => togglePaymentMethod(method.id, checked)}
                            />
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deletePaymentMethod(method.id)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
