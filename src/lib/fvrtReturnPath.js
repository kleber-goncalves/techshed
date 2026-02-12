const FVRT_RETURN_PATH_KEY = "techshed.fvrt.returnPath";

function isValidReturnPath(path) {
    return Boolean(path) && typeof path === "string" && path !== "/favoritos";
}

export function saveFvrtReturnPath(path) {
    if (typeof window === "undefined") return;
    if (!isValidReturnPath(path)) return;

    window.sessionStorage.setItem(FVRT_RETURN_PATH_KEY, path);
}

export function getFvrtBackPath(fallback = "/loja") {
    if (typeof window === "undefined") return fallback;

    const savedPath = window.sessionStorage.getItem(FVRT_RETURN_PATH_KEY);
    return isValidReturnPath(savedPath) ? savedPath : fallback;
    
}