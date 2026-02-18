export function detectCardBrand(number) {
    if (!number) return null;
    
    const cleaned = number.replace(/\s+/g, "");
    if (cleaned.match(/^4/)) return "visa" || "Visa";
    if (cleaned.match(/^5[1-5]/)) return "mastercard";
    if (cleaned.match(/^3[47]/)) return "amex";
    if (cleaned.match(/^36|^38/)) return "diners";
    if (cleaned.match(/^6(?:011|5)/)) return "discover";
    if (cleaned.match(/^35/)) return "jcb";
    if (cleaned.match(/^50|^56|^57/)) return "maestro";
    if (cleaned.match(/^636/)) return "elo";
    return null;
}
