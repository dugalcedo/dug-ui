import { useRef } from "react"

export default function Modal(props) {

    const {
        head = null,         // string | jsx
        children,
        xButton = false,
        closeButton = "close",
        confirmButton = null,
        onClose = () => {},
        onConfirm = () => {},
        shown = true
    } = props
    

    return (
        <div className="--modal" style={{
            display: shown ? 'flex' : 'none'
        }}>
            <div className="--modal-window">
                <div className="--layout">
                    {head && (
                        <div className="--head flex aic jcsb">
                            {typeof head === 'string' ? (
                                <h2>{head}</h2>
                            ): head}
                            {xButton && <button type="button" className="--x">&#x2715;</button>}
                        </div>
                    )}
                    <main>
                        {children}
                    </main>
                    {(closeButton || confirmButton) && (
                        <div className="--foot">
                            {confirmButton && (
                                <button type="button" onClick={onConfirm}>
                                    {confirmButton}
                                </button>
                            )}
                            {closeButton && (
                                <button type="button" onClick={onClose}>
                                    {closeButton}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}