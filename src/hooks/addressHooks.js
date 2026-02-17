import { useState, useEffect } from "react";
import {
    getAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
} from "@/lib/helpers/api/addressApi";

export function useAddresses() {
    const [addresses, setAddresses] = useState([]);
    useEffect(() => {
        getAddresses().then(setAddresses);
    }, []);
    return { addresses, setAddresses };
}

export function useCreateAddress() {
    return createAddress;
}

export function useUpdateAddress() {
    return updateAddress;
}

export function useDeleteAddress() {
    return deleteAddress;
}
