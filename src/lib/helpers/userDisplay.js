export function getDisplayName(user) {
    const fullName = user?.user_metadata?.full_name;
    if (typeof fullName === "string" && fullName.trim()) return fullName.trim();

    const metadataName = user?.user_metadata?.name;
    if (typeof metadataName === "string" && metadataName.trim()) {
        return metadataName.trim();
    }

    const email = user?.email;
    if (typeof email === "string" && email.includes("@")) {
        const [localPart] = email.split("@");
        if (localPart?.trim()) return localPart.trim();
    }

    return "Usuario";
}

export function getInitials(name) {
    if (!name) return "U";

    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}
