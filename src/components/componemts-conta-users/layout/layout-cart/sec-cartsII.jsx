"use client";

import { useState } from "react";
import { useCards, useAddCard, useDeleteCard } from "@/hooks/cardHooks";
import Modal from "@/components/componemts-conta-users/modal/modal";


import {
  VisaIcon,
  MastercardIcon,
  AmexIcon,
  EloIcon,
  DinersIcon,
  DiscoverIcon,
  JcbIcon,
  MaestroIcon,
} from "react-svg-credit-card-payment-icons";


import  { 
  getCardType , 
  validateCardNumber , 
  formatCardNumber , 
}  from  'react-svg-credit-card-payment-icons' ; 

export default function SecCartsll() {
    const { cards, setCards } = useCards();
    const addCardAPI = useAddCard();
    const deleteCardAPI = useDeleteCard();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [numberTouched, setNumberTouched] = useState(false);
    const [form, setForm] = useState({
        holder: "",
        number: "",
        brand: "",
        expMonth: "",
        expYear: "",
    });

    const numberValid = validateCardNumber(form.number);
    const showNumberError = numberTouched && !numberValid;
    const canSubmit =
        numberValid &&
        form.holder &&
        form.number &&
        form.brand &&
        form.expMonth &&
        form.expYear;

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => {
            if (name === "number") {
                const formattedNumber = formatCardNumber(value);
                const detectedBrand = getCardType(formattedNumber);
                return {
                    ...prev,
                    number: formattedNumber,
                    brand:
                        detectedBrand && detectedBrand !== "Generic"
                            ? detectedBrand
                            : "",
                };
            }
            return { ...prev, [name]: value };
        });
    }

    async function handleAdd(e) {
        e.preventDefault();
        if (!numberValid) {
            setNumberTouched(true);
            return;
        }
        const newCard = await addCardAPI(form);
        setCards([newCard, ...cards]);
        setForm({
            holder: "",
            number: "",
            brand: "",
            expMonth: "",
            expYear: "",
        });
        setNumberTouched(false);
        setIsModalOpen(false);
    }




      function renderIcon(brand) {
    const normalized = (brand || "").toLowerCase();
    switch (normalized) {
      case "visa": return <VisaIcon />;
      case "mastercard": return <MastercardIcon />;
      case "americanexpress":
      case "amex": return <AmexIcon />;
      case "elo": return <EloIcon />;
      case "dinersclub":
      case "diners": return <DinersIcon />;
      case "discover": return <DiscoverIcon />;
      case "jcb": return <JcbIcon />;
      case "maestro": return <MaestroIcon />;
      default: return null;
    }
  }


    return (
        <div className="bg-gray-500">
            <h2>Minha Carteira</h2>
            <button
                className="bg-red-300 cursor-pointer"
                onClick={() => setIsModalOpen(true)}
            >
                Adicionar Cartão
            </button>

            <ul>
                {cards.map((card) => {
                    const Icon = renderIcon(card.brand);
                    const maskedLast4 = card.last4
                        ? `**** **** **** ${card.last4}`
                        : "**** **** ****";

                    return (
                        <li
                            key={card.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                            }}
                        >
                            {Icon && (
                                <span style={{ width: "32px", height: "32px" }}>
                                    {Icon}
                                </span>
                            )}{" "}
                            —
                            <span>
                                {maskedLast4} — Exp:{" "}
                                {card.expMonth}/{card.expYear}
                            </span>
                            <button
                                className="bg-green-500 cursor-pointer"
                                onClick={() =>
                                    deleteCardAPI(card.id).then(() =>
                                        setCards(
                                            cards.filter(
                                                (c) => c.id !== card.id,
                                            ),
                                        ),
                                    )
                                }
                            >
                                Excluir
                            </button>
                        </li>
                    );
                })}
            </ul>

            {/* Modal de novo cartão */}
            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                >
                    <h3>Adicionar Cartão</h3>
                    <form onSubmit={handleAdd}>
                        <input
                            name="holder"
                            placeholder="Titular"
                            value={form.holder}
                            onChange={handleChange}
                            autoComplete="cc-name"
                            required
                        />
                        <input
                            name="number"
                            placeholder="Número"
                            value={form.number}
                            onChange={handleChange}
                            onBlur={() => {
                                setNumberTouched(true);
                                setForm((prev) => ({
                                    ...prev,
                                    number: formatCardNumber(prev.number),
                                }));
                            }}
                            aria-invalid={showNumberError}
                            aria-describedby={
                                showNumberError ? "card-number-error" : undefined
                            }
                            className={
                                showNumberError ? "border border-red-500" : ""
                            }
                            inputMode="numeric"
                            autoComplete="cc-number"
                            required
                        />
                        {showNumberError && (
                            <p
                                id="card-number-error"
                                className="text-red-600 text-sm"
                            >
                                Número do cartão inválido.
                            </p>
                        )}
                        <input
                            name="brand"
                            placeholder="Bandeira (auto)"
                            value={form.brand}
                            onChange={handleChange}
                            readOnly
                            required
                        />
                        <input
                            name="expMonth"
                            placeholder="Mês"
                            value={form.expMonth}
                            onChange={handleChange}
                            autoComplete="cc-exp"
                            required
                        />
                        <input
                            name="expYear"
                            placeholder="Ano"
                            value={form.expYear}
                            onChange={handleChange}
                            autoComplete="cc-exp"
                            required
                        />
                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className={
                                !canSubmit
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }
                        >
                            Salvar
                        </button>
                    </form>
                </Modal>
            )}
        </div>
    );
}
