import { useState } from "react"

export default function ThemeToggle() {

    const toggle = () => {
        document.body.classList.toggle('--light-theme')
    }

    return (
        <>
            <button onClick={toggle}>
                THEME
            </button>
        </>
    )
}