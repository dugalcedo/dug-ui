import { modalAtom } from "./store.js"
import { useAtom } from "jotai"
import { useState } from "react"

export default function DugUIContext({children}) {
    const [modal, $modal] = useAtom(modalAtom)

    const [n, $n] = useState(0)

    function close() {
        $modal($ => {
            $.id = null
            return {...$}
        })
    }

    return (
        <>
            {children}
            {modal.id === 'form-number' && (
                <div className="--modal">
                    <div className="--modal-window">
                        <div className="--layout">
                            {modal.head && (
                                <div className="--head">
                                    {modal.head}
                                </div>
                            )}
                            <div className="--body --main">
                                <input type="text" onInput={e => $n(e.target.value)} value={n}/>
                            </div>
                            <div className="--foot">
                                <button onClick={() => {
                                    modal.onConfirm(Number(n)||0)
                                    close()
                                }}>
                                    confirm
                                </button>
                                <button onClick={close}>
                                    cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}