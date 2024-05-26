const toTrimmed = str => str.trim().replaceAll(/\s+/gm, ' ')

import { useEffect } from "react"

export default function StringField(props) {

    const {
        name,
        options,
        update,
        id
    } = props

    const {
        placeholder = "",
        defaultValue = "",
        type = "text",

        // sanitizers
        trim = true,
        to_Case = null,      // 'lower' | 'upper'
        underscores = false
    } = options

    function sanitize(input) {
        // trim
        if (trim) input = toTrimmed(input)

        // case
        if (to_Case) input = input[`to${to_Case[0].toUpperCase()+to_Case.slice(1)}Case`]()

        // underscores
        if (underscores) input = input.replaceAll(' ','_')

        return input
    }

    function handleInput(e) {
        let input = e.target.value
        input = sanitize(input)
        update(input)
    }

    // Default value
    useEffect(()=>{
        update(defaultValue)
    },[])

    return (
        <>
            <input
                id={id}
                type={type}
                placeholder={placeholder} 
                defaultValue={defaultValue}
                onInput={handleInput}
            />
        </>
    )
}