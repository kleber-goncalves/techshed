const DEFAULT_FEATURES = ["5G", "OLED", "Wi-Fi", "4K", "Bluetooth"];

export default function FeatureFilter({ filters, setFilters, features }) {
    function toggleFeature(feature) {
        const exists = filters.features.includes(feature);

        setFilters({
            ...filters,
            features: exists
                ? filters.features.filter((f) => f !== feature)
                : [...filters.features, feature],
        });
    }

    const data = Array.isArray(features) ? features : DEFAULT_FEATURES;

    return (
        <div className=" py-10">
            <p className="font-semibold mb-2">Recursos</p>

            <div className="flex flex-wrap gap-2">
                {data.map((feature) => (
                    <button
                        key={feature}
                        onClick={() => toggleFeature(feature)}
                        className={`px-3 py-1 rounded border text-sm ${
                            filters.features.includes(feature)
                                ? "bg-black text-white"
                                : "bg-white text-black"
                        }`}
                    >
                        {feature}
                    </button>
                ))}
            </div>
        </div>
    );
}
