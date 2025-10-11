"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChevronLeft } from "react-icons/fa";

interface SecondaryNavProps {
    /** Permet d’ajouter ou de remplacer le dernier élément du breadcrumb */
    currentLabel?: string;
}

const formatLabel = (segment: string) =>
    decodeURIComponent(segment)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

const isIdSegment = (segment: string) =>
    /^\d+$/.test(segment) || /^[0-9a-fA-F-]{8,}$/.test(segment);

export default function SecondaryNav({ currentLabel }: SecondaryNavProps) {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    // on ignore /admin
    const subSegments = segments.slice(1);
    // on enlève les segments de type ID
    const visibleSegments = subSegments.filter((s) => !isIdSegment(s));

    // rien à afficher si on est juste sur /admin
    if (segments.length <= 1) return null;

    // Si currentLabel est fourni, on l’ajoute à la fin du breadcrumb
    const finalSegments = currentLabel
        ? [...visibleSegments, currentLabel]
        : visibleSegments;

    return (
        <nav
            aria-label="breadcrumb"
            className="mb-6 flex flex-wrap items-center text-sm text-gray-600"
        >
            <Link href="/admin" className="flex items-center gap-1 hover:underline">
                <FaChevronLeft /> Admin
            </Link>

            {finalSegments.map((segment, index) => {
                const href = "/admin/" + visibleSegments.slice(0, index + 1).join("/");
                const isLast = index === finalSegments.length - 1;

                return (
                    <div key={href} className="flex items-center">
                        <span className="mx-2">/</span>
                        {isLast ? (
                            <span aria-current="page" className="font-medium text-green-700">
                                {formatLabel(segment)}
                            </span>
                        ) : (
                            <Link href={href} className="hover:underline">
                                {formatLabel(segment)}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
