import NavbarUser from "@/app/(user)/components/User/NavbarUser";
import FooterUser from "@/app/(user)/components/User/FooterUser";

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-[#FDFBF5]">
            <NavbarUser />
            <main className="flex-grow">
                {children}
            </main>
            <FooterUser />
        </div>
    );
}