import React from 'react'
function AuthBackground ({ theme }) {
    return (
        <div
            className="absolute  inset-0 bg-cover bg-center"
            style={{
                zIndex: -1,
                backgroundImage:
                    theme === "dark"
                        ? "url('/assets/auth/bg-10-dark.png')"
                        : "url('/assets/auth/bg-10-light.svg')",
            }}
        />
    )
}

export default AuthBackground 
