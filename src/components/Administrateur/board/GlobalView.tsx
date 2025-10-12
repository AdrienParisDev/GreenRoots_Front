import KPICard from "../card/KPI";

export interface KPIData {
    value: number | string;
    title: string;
    icon: React.ReactNode;
    variant?: "star" | "good" | "warning" | "bad";
}

interface Props {
    title: string;
    kpis: KPIData[];
}

export default function GlobalViewBoard({ title, kpis }: Props) {
    return (
        <section className="mb-10">
            <h1 className="font-extrabold text-brand-green text-4xl text-center mb-6">
                Vue d'ensemble des {title}
            </h1>
            <div className="flex gap-8 h-64">
                {kpis.map((kpi, i) => (
                    <KPICard key={i} {...kpi} />
                ))}
            </div>
        </section>
    );
}

