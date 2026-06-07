import { getPaymentMethods } from "@/app/actions/settings"
import { PaymentMethodsList } from "@/components/admin/payment-methods"

export default async function SettingsPage() {
    const methods = await getPaymentMethods()

    return (
        <div className="max-w-4xl space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

            <div className="space-y-6">
                <PaymentMethodsList methods={methods} />
            </div>
        </div>
    )
}
