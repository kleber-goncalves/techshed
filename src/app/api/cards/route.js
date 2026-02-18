import prisma from "@/lib/prisma/prisma";
import { supabase } from "@/lib/supabase/supabaseClient";

function sanitizeCardNumber(input) {
    return (input ?? "").toString().replace(/\D/g, "");
}

function isValidLuhn(cardNumber) {
    if (cardNumber.length < 13 || cardNumber.length > 19) return false;
    let sum = 0;
    let alternate = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i], 10);
        if (alternate) {
            digit *= 2;
            if (digit > 9) digit = digit % 10 + 1;
        }
        sum += digit;
        alternate = !alternate;
    }
    return sum % 10 === 0;
}

function parseExpYear(rawYear) {
    const year = parseInt(rawYear, 10);
    if (Number.isNaN(year)) return null;
    if (year < 100) return 2000 + year;
    return year;
}

function isValidExpiration(expMonth, expYear) {
    const month = parseInt(expMonth, 10);
    const year = parseExpYear(expYear);
    if (!month || month < 1 || month > 12 || !year) return false;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    return true;
}

/**
 * GET /api/cards
 *
 * Retorna lista de cartoes do usuario autenticado
 *
 * @param {Request} request - Requisicao
 * @returns {Response} - Resposta com lista de cartoes
 * @throws {Response} - Erro de nao autenticado com status 401
 */
export async function GET(request) {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    const {
        data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) return Response.json({ error: "Nao autenticado" }, { status: 401 });
    
    const cards = await prisma.card.findMany({
        where: { userId: user.id },
    });

    return Response.json(cards);
}


/**
 * POST /api/cards
 *
 * Cria uma nova carta para o usuario autenticado
 *
 * @param {Request} request - Requisicao
 * @returns {Response} - Resposta com a carta criada
 * @throws {Response} - Erro de nao autenticado com status 401
 */
export async function POST(request) {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    const {
        data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) return Response.json({ error: "Nao autenticado" }, { status: 401 });

    const body = await request.json();
    const sanitizedNumber = sanitizeCardNumber(body.number);
    if (!isValidLuhn(sanitizedNumber)) {
        return Response.json({ error: "Numero de cartao invalido" }, { status: 400 });
    }
    if (!isValidExpiration(body.expMonth, body.expYear)) {
        return Response.json(
            { error: "Data de expiracao invalida" },
            { status: 400 },
        );
    }
    const last4 = sanitizedNumber.slice(-4);

    const newCard = await prisma.card.create({
        data: {
            userId: user.id,
            holder: body.holder,
            last4,
            brand: body.brand,
            expMonth: parseInt(body.expMonth),
            expYear: parseExpYear(body.expYear),
        },
    });

    return Response.json(newCard);
}
