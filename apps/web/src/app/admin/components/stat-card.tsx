export function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <article className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">{label}</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums">{value}</p>
        </article>
    )
}