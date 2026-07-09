'use client'

import Headerauth from "./_layout/headerAuth";


export default function authLayout({ children }) {
    return (
        <>
            <Headerauth 
                
            />
            <main>{children}</main>
        </>
    );
}
