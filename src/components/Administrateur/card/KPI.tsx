"use client";

import { ReactNode } from "react";

interface Props {
    value: number | string;
    title: string;
    icon: ReactNode;
    variant?: "star" | "good" | "warning" | "bad";
}

export default function KPICard({ value, title, icon, variant = "star" }: Props) {
    // 🧩 Styles selon la variante
    let bg = "";
    let border = "";
    let textMain = "";
    let textSecondary = "";
    let iconBg = "";

    switch (variant) {
        case "good":
            bg = "bg-brand-white";
            border = "border-brand-lightgreen/30";
            textMain = "text-brand-green";
            textSecondary = "text-brand-darkgreen";
            iconBg = "bg-brand-lightgreen/10";
            break;
        case "warning":
            bg = "bg-orange-300/10";
            border = "border-orange-300";
            textMain = "text-orange-400";
            textSecondary = "text-orange-600";
            iconBg = "bg-orange-600/10";
            break;
        case "bad":
            bg = "bg-red-300/10";
            border = "border-red-300";
            textMain = "text-red-400";
            textSecondary = "text-red-600";
            iconBg = "bg-red-600/10";
            break;
        default:
            bg = "bg-brand-darkgreen";
            border = "border-brand-darkgreen";
            textMain = "text-brand-white";
            textSecondary = "text-brand-white";
            iconBg = "bg-brand-green";
            break;
    }

    return (
        <div
            className={`flex flex-col justify-around w-full rounded-xl md:rounded-2xl p-4 md:p-6 border shadow-sm text-center ${bg} ${border}`}
        >
            <p className={`font-extrabold text-4xl mb-3 ${textMain}`}>{value}</p>

            <h3 className={`text-base font-semibold mb-2 ${textSecondary}`}>{title}</h3>

            <div
                className={`rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-3 md:mb-4 ${iconBg}`}
            >
                {icon}
            </div>
        </div>
    );
}
