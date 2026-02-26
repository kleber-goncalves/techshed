import Link from "next/link";

export default function Breadcrumb({ items }) {
    return (
        <nav className=" text-gray-600 mb-4 dark:text-gray-200">
            <ol className="flex items-center gap-2 flex-wrap">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={item.href} className="flex items-center gap-2">
                            {!isLast ? (
                                <Link
                                    href={item.href}
                                    className="hover:underline"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {item.label}
                                </span>
                            )}

                            {!isLast && <span>{">"}</span>}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
