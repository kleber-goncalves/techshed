import { useEffect, useState } from "react";
import { getCards, addCard, deleteCard } from "@/lib/helpers/api/cardApi";

export function useCards() {
    const [cards, setCards] = useState([]);
    useEffect(() => {
        getCards().then(setCards);
    }, []);

    return { cards, setCards };
}

export function useAddCard() {
    return addCard;
}

export function useDeleteCard() {
    return deleteCard;
}
