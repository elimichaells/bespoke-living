import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
                <div className="p-4 flex items-center gap-4 border-b">
                    <SidebarTrigger />
                    <h1 className="text-lg font-bold">Bezpoke Living Admin</h1>
                </div>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    );
}
