import { useRef, useState, useEffect } from "react"
import validator from 'validator'

let ID_NO = 0

export default function Field(props) {
    const {
        label,
        placeholder,
        name,
        type,
        defaultValue = null,

        // validation
        validation = null,  // {message: "", validator: v => {}} or array of such
        required = false,   // message
        strongPassword = false, // message
        strongPasswordOptions,    // validator options
        email = false,        // message
        range = false,        // [min, max]
        rangeMsg = (min, max) => `must be between ${min} and ${max} characters long`,

        transform = {},
        errorState = ""
    } = props.field

    const {
        onInput = (v) => {}
    } = props

    const id = useRef((()=>{
        const ID = `--field-${ID_NO}`
        ID_NO++
        return ID
    })())

    const inputTypeSwitch = (callbacks) => {
        const {
            text = () => {},
            number = () => {},
            date = () => {}
        } = callbacks
        switch(type) {
            case 'date':
                return date()
            case 'number':
            case 'range':
                return number()
            case 'text':
            case 'email':
            case 'password':
            case 'textarea':
            default:
                return text()
        }
    }

    const validate = v => {
        let errors = null
        const pushError = (msg) => {
            if (!errors) errors = []
            errors.push(msg)
        }

        // required
        if (required) {
            let missing = inputTypeSwitch({
                text: () => !v,
                number: () => isNaN(v),
                date: () => isNaN(v.getTime())
            })
            if (missing) pushError(required)
        }

        // range
        if (range) {
            const [min, max] = range
            let missing = inputTypeSwitch({
                text: () => v.length < min || v.length > max,
                number: () => v < min || v > max,
                date: () => v.getTime() < min || v.getTime() > max
            })
            if (missing) pushError(rangeMsg(min, max))
        }

        // email
        if (email) {
            let missing = inputTypeSwitch({
                text: () => !validator.iseEmail(v)
            })
            if (missing) pushError(email)
        }

        // safe password
        if (strongPassword) {
            let missing = inputTypeSwitch({
                text: () => !validator.isStrongPassword(v, strongPasswordOptions)
            })
            if (missing) pushError(strongPassword)
        }

        // custom
        if (validation) {
            for (let i = 0; i < validation.length || 1; i++) {
                let _validation = validation[i]||validation
                let missing = _validation.validator(v)
                if (missing) pushError(_validation.message)
            }
        }

        return errors
    }

    const handleInput = (e, valueOverride) => {
        let errors = null
        let v = valueOverride || e?.target?.value

        v = transform.beforeValidation ? transform.beforeValidation(v) : inputTypeSwitch({
            text() {
                return (v||"").trim()
            },
            number() {
                return Number(v)
            },
            date() {
                return new Date(v)
            }
        })

        errors = validate(v)

        if (transform.afterValidation) v = transform.afterValidation(v)

        onInput(v, errors)
    }

    let Input
    switch(type) {
        case 'text':
        default:
            Input = () => (
                <input defaultValue={defaultValue} name={name} type="text" placeholder={placeholder} onInput={handleInput}/>
            )
    }

    useEffect(()=>{
        handleInput(defaultValue)
    }, [])

    return (
        <div className="--field">
            {label && (
                <label htmlFor={id.current}>
                    <span>{label}</span>
                    <div className="--error" data-error={name}>{errorState}</div>
                </label>
            )}
            <Input />
        </div>
    )
}