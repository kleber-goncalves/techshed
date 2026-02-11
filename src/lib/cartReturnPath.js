const CART_RETURN_PATH_KEY = "techshed.cart.returnPath";

function isValidReturnPath(path) {
    return Boolean(path) && typeof path === "string" && path !== "/carrinho";
}

export function saveCartReturnPath(path) {
    if (typeof window === "undefined") return;
    if (!isValidReturnPath(path)) return;

    window.sessionStorage.setItem(CART_RETURN_PATH_KEY, path);
}

export function getCartBackPath(fallback = "/loja") {
    if (typeof window === "undefined") return fallback;

    const savedPath = window.sessionStorage.getItem(CART_RETURN_PATH_KEY);
    return isValidReturnPath(savedPath) ? savedPath : fallback;
}
