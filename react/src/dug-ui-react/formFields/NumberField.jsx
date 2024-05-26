import { useEffect, useState } from "react"
import { useAtom } from "jotai"
import { modalAtom } from "../store.js"

export default function NumberField(props) {
    const [modal, $modal] = useAtom(modalAtom)

    const {
        name,

        options,

        update
    } = props

    const {
        defaultValue = 0,
        min = -Infinity,
        max = Infinity,
        step = 1,
        extraStep = null
    } = options

    const [n, $n] = useState(0)

    useEffect(()=>{
        let initial = defaultValue < min ? min : defaultValue > max ? max : defaultValue
        $n(initial)
        update(initial)
    }, [])

    function changeNumber(by = 1, extra = false) {
        let newNumber = n + (by * (extra ? extraStep : step))
        newNumber = newNumber < min ? min : newNumber > max ? max : newNumber
        $n(newNumber)
        update(newNumber)
    }

    function openNumberModal() {
        $modal({
            id: 'form-number',
            head: <h2>edit {name}</h2>,
            onConfirm(v) {
                $n(v)
                update(v)
            }
        })
    }

    return (
        <div className="--number-input">
            {extraStep && <button className="--inc" type="button" onClick={()=>changeNumber(-1, true)}>-{extraStep}</button>}
            <button className="--inc" type="button" onClick={()=>changeNumber(-1)}>-</button>
            <button type="button" onClick={openNumberModal}>{n}</button>
            <button className="--inc" type="button" onClick={()=>changeNumber(1)}>+</button>
            {extraStep && <button className="--inc" type="button" onClick={()=>changeNumber(1, true)}>+{extraStep}</button>}
        </div>
    )
}