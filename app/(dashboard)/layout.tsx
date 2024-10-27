import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode } from "react";

const links = [
    { href: "/", label: "Home" },
    { href: "/journal", label: "Journal" },
    { href: "/history", label: "History" },
];

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    return (
        <div className="h-screen w-screen relative">
            <aside className="absolute left-0 top-0 h-full w-[200px] border-r border-black/10">
                <div className="px-4 my-4">
                    <span className="text-3xl">MOOD</span>
                </div>
                <ul className="px-4">
                    {links.map((link) => {
                        return (
                            <li key={link.href} className="text-xl my-4">
                                <Link href={link.href}>{link.label}</Link>
                            </li>
                        );
                    })}
                </ul>
            </aside>
            <div className="ml-[200px] h-full w-[calc(100vw-200px)]">
                <header className="h-[60px] border-b border-black/10">
                    <nav className="px-4 h-full">
                        <div  className="flex items-center justify-end h-full">
                            <UserButton />
                        </div>
                    </nav>
                </header>
                <div className="h-[calc(100vh-60px)]">{children}</div>
            </div>
        </div>
    );
};

export default DashboardLayout;
