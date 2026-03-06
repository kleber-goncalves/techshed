export default function FeedbackBanners({ error, success }) {
    return (
        <>
            {error ? (
                <div className="rounded-lg border border-red-300 bg-red-500/10 p-3 text-sm text-red-700 dark:border-red-900 dark:text-red-300">
                    {error}
                </div>
            ) : null}
            {success ? (
                <div className="rounded-lg border border-emerald-300 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:border-emerald-900 dark:text-emerald-300">
                    {success}
                </div>
            ) : null}
        </>
    );
}
