"use client";

import React from "react";
import { LuListFilter } from "react-icons/lu";

/* ---------------------------------------------
 * 1️⃣ Types génériques pour les colonnes et props
 * --------------------------------------------- */

export interface Column<T> {
    key: keyof T | string;
    label: string;
    width?: string;
    className?: string;
    sortable?: boolean; // ✅ Ajouté
    render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    emptyMessage?: string;
    onSort?: (key: string) => void; // ✅ Ajouté
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

/* ---------------------------------------------
 * 2️⃣ Sous-composant : DataTable
 * --------------------------------------------- */

function DataTable<T extends { id: string | number }>({
    columns,
    data,
    loading = false,
    emptyMessage = "Aucune donnée",
    onSort,
    sortBy,
    sortOrder,
}: DataTableProps<T>) {
    return (
        <table className="border-collapse border border-brand-darkgreen w-full">
            <thead>
                <tr className="h-14 bg-brand-darkgreen text-brand-white">
                    {columns.map((col) => {
                        const isActive = sortBy === col.key;
                        return (
                            <th
                                key={String(col.key)}
                                onClick={() => col.sortable && onSort?.(String(col.key))}
                                className={`border-x border-brand-white text-center cursor-pointer select-none ${col.className ?? ""
                                    }`}
                                style={{ width: col.width }}
                            >
                                <div className="flex justify-center items-center gap-2">
                                    {col.label}
                                    {col.sortable && (
                                        <LuListFilter
                                            className={`ml-2 transition-transform ${isActive
                                                ? sortOrder === "asc"
                                                    ? "rotate-180 text-brand-lightgreen"
                                                    : "text-brand-white"
                                                : "opacity-80"
                                                }`}
                                        />
                                    )}
                                </div>
                            </th>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                {loading ? (
                    <tr>
                        <td colSpan={columns.length} className="text-center py-4">
                            Chargement...
                        </td>
                    </tr>
                ) : data.length > 0 ? (
                    data.map((row) => (
                        <tr key={row.id} className="h-14 hover:bg-gray-50">
                            {columns.map((col) => (
                                <td
                                    key={String(col.key)}
                                    className="border border-brand-darkgreen text-center px-2"
                                    style={{ width: col.width }}
                                >
                                    {col.render ? col.render(row) : (row[col.key as keyof T] as React.ReactNode)}
                                </td>
                            ))}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={columns.length} className="text-center py-4 italic text-gray-500">
                            {emptyMessage}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

/* ---------------------------------------------
 * 3️⃣ Sous-composant : Pagination
 * --------------------------------------------- */

interface PaginationProps {
    page: number;
    totalPages: number;
    limit: number;
    onPageChange: (page: number) => void;
    onLimitChange?: (limit: number) => void;
}

function Pagination({
    page,
    totalPages,
    limit,
    onPageChange,
    onLimitChange,
}: PaginationProps) {
    return (
        <div className="flex justify-between items-center mt-4">
            {/* Sélecteur du nombre d’éléments par page */}
            <div className="flex items-center gap-2">
                <label htmlFor="limit" className="text-sm">Lignes par page:</label>
                {onLimitChange && (
                    <select
                        id="limit"
                        value={limit}
                        onChange={(e) => onLimitChange(parseInt(e.target.value, 10))}
                        className="border rounded px-2 py-1"
                    >
                        {[3, 5, 10, 20].map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                )}
            </div>

            {/* Boutons de navigation */}
            <div className="flex justify-center items-center gap-4">
                <button
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                    ◀ Précédent
                </button>
                <span>
                    Page {page} / {totalPages || 1}
                </span>
                <button
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                    Suivant ▶
                </button>
            </div>
        </div>
    );
}

/* ---------------------------------------------
 * 4️⃣ Composant principal : TableWithPagination
 * --------------------------------------------- */

interface TableWithPaginationProps<T> extends DataTableProps<T> {
    page: number;
    totalPages: number;
    limit: number;
    onPageChange: (p: number) => void;
    onLimitChange: (l: number) => void;
}

export function TableWithPagination<T extends { id: string | number }>({
    columns,
    data,
    loading,
    emptyMessage,
    page,
    totalPages,
    limit,
    onPageChange,
    onLimitChange,
    onSort,
    sortBy,
    sortOrder,
}: TableWithPaginationProps<T>) {
    return (
        <div>
            <DataTable
                columns={columns}
                data={data}
                loading={loading}
                emptyMessage={emptyMessage}
                onSort={onSort}
                sortBy={sortBy}
                sortOrder={sortOrder}
            />
            <Pagination
                page={page}
                totalPages={totalPages}
                limit={limit}
                onPageChange={onPageChange}
                onLimitChange={onLimitChange}
            />
        </div>
    );
}
