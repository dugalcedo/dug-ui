import { useRef, useState, useEffect } from "react"
import validator from 'validator'
import Modal from "./Modal.jsx"

let ID_NO = 0

const pad0 = n => n < 10 ? '0'+n : n
const formatDate = date => `${date.getFullYear()}-${pad0(date.getMonth()+1)}-${pad0(date.getDate())}`

export default function Field(props) {
    const {
        label,
        placeholder,
        name,
        type,
        defaultValue = null,
        options = [], // 'value' or {text: 'Displayed value', value: 'value'}

        // validation
        validation = null,  // {message: "", validator: v => {}} or array of such
        required = false,   // message
        strongPassword = false, // message
        strongPasswordOptions,    // validator options
        email = false,        // message
        range = false,        // [min, max]
        step = 1,               // numbers only
        extraStep = null,
        numberErrorMessage = null,
        rangeMsg = (min, max) => {
            return inputTypeSwitch({
                text() {
                    return `must be between ${min} and ${max} characters long`
                },
                number() {
                    return `must be between ${min} and ${max}`
                },
                date() {
                    if (!min || (min === -Infinity)) {
                        return `must be ${formatDate(new Date(max))} or before`
                    } else if (!max || (max === Infinity)) {
                        return `must be ${formatDate(new Date(min))} or later`
                    } else {
                        return `must be between ${formatDate(new Date(max))} and ${formatDate(new Date(min))}`
                    }
                }
            })
        },

        transform = {},
        errorState = "",

        customOption = false,   // select type only 
    } = props.field

    const {
        onInput = (v) => {}
    } = props

    const id = useRef((()=>{
        const ID = `--field-${ID_NO}`
        ID_NO++
        return ID
    })())

    const [customShown, $customShown] = useState(false)
    const [number, $number] = useState(Number(defaultValue) || (
        range ? (range[0]) : 0
    ))
    const [numberModalShown, $numberModalShown] = useState(false)
    const numberModalInput = useRef(null)
    const [numberModalError, $numberModalError] = useState(null)

    const toggleCustom = e => {
        $customShown(!customShown)
        if (customShown) {
            // not custom
            handleInput(e, defaultValue || (options[0].value||options[0]))
        } else {
            handleInput(e, "")
        }
    }

    const changeNumber = (by, extra) => {
        let newVal = number+(by*(extra ? extraStep : step))
        if (range) newVal = newVal < range[0] ? range[0] : newVal > range[1] ? range[1] : newVal
        handleInput(null, newVal)
        $number(newVal)
    }

    const inputTypeSwitch = (callbacks) => {
        const {
            text = () => {},
            number = () => {},
            date = () => {},
            select = () => {},
            checkbox = () => {}
        } = callbacks
        switch(type) {
            case 'checkbox':
                return checkbox()
            case 'select':
                return select()
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
        console.log(`Validating ${name}:`, v)
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

    const toTransformed = (v, transformer) => {
        try {
            return transformer(v)
        } catch (error) {
            console.warn(`Error transforming ${v}: ${error.message}`)
            return v
        }
    }

    const handleInput = (e, valueOverride) => {
        let errors = null
        let v = valueOverride || e?.target?.value

        v = transform.beforeValidation ? toTransformed(v, transform.beforeValidation) : inputTypeSwitch({
            text() {
                return (v||"").trim()
            },
            number() {
                return Number(v)
            },
            date() {
                return new Date(v)
            },
            select() {
                return v
            },
            checkbox() {
                return v
            }
        })

        errors = validate(v)

        if (transform.afterValidation) v = toTransformed(v, transform.afterValidation)

        inputTypeSwitch({
            text: () => {
                v = (v||"").trim()
            }
        })

        onInput(v, errors)
    }

    let Input
    inputTypeSwitch({
        text() {
            Input = () => (
                <input defaultValue={defaultValue} name={name} type={type||'text'} placeholder={placeholder} onInput={handleInput}/>
            )
        },
        select() {
            Input = () => (customOption ?  (
                <div className="--select-with-custom">
                    <div>
                        custom &nbsp;
                        <input type="checkbox" onChange={toggleCustom} checked={customShown}/>
                    </div>
                    {customShown ? (
                        <input defaultValue={defaultValue} name={name} type={type||'text'} placeholder={placeholder} onInput={handleInput}/>
                    ): (
                        <select defaultValue={defaultValue} name={name} onChange={handleInput}>
                            {options.map(o => (<option key={o.text || o} value={o.value || o}>{o.text || o}</option>))}
                        </select>
                    )}
                </div>
            ):(
                <select defaultValue={defaultValue} name={name} onChange={handleInput}>
                    {options.map(o => (<option key={o.text || o} value={o.value || o}>{o.text || o}</option>))}
                </select>
            ))
        },
        number() {
            Input = () => (
                <div className="--number-input">
                    {extraStep && <button className="--inc" type="button" onClick={()=>changeNumber(-1, true)}>-{extraStep}</button>}
                    <button className="--inc --bigger-button" type="button" onClick={()=>changeNumber(-1)}>-</button>
                    <button type="button" onClick={()=>$numberModalShown(true)}>{number}</button>
                    <button className="--inc --bigger-button" type="button" onClick={()=>changeNumber(1)}>+</button>
                    {extraStep && <button className="--inc" type="button" onClick={()=>changeNumber(1, true)}>+{extraStep}</button>}
                </div>
            )
        },
        date() {
            Input = () => (
                <input name={name} onChange={handleInput} defaultValue={defaultValue} type="date" />
            )
        },
        checkbox() {
            Input = () => (
                <input defaultValue={defaultValue} name={name} type="checkbox" onInput={handleInput}/>
            )
        }
    })

    // DEFAULTS
    useEffect(()=>{
        let v = defaultValue
        inputTypeSwitch({
            select() {
                if (!v) v = (options[0].value||options[0])
            },
            number() {
                v = Number(defaultValue) || (range ? range[0] : 0)
            },
            date() {
                if (!v) v = new Date()
            }
        })
        handleInput(null, v)
    }, [])

    return (
        <>        
            <div className="--field">
                {label && (
                    <label htmlFor={id.current}>
                        <span>{label}</span>
                        <div className="--error" data-error={name}>{errorState}</div>
                    </label>
                )}
                <Input />
            </div>

            {/* ||||||||||| NUMBER MODAL ||||||||||| */}
            <Modal
                shown={numberModalShown}
                head="enter a number"
                confirmButton="confirm"
                closeButton="cancel"
                onClose={()=>$numberModalShown(false)}
                onConfirm={()=>{
                    let input = Number(numberModalInput.current.value.trim())
                    if (isNaN(input)) {
                        $numberModalError(numberErrorMessage || 'must be a number')
                        return
                    }
                    input = input || 0
                    if (range) {
                        if (input < range[0] || input > range[1]) {
                            $numberModalError(numberErrorMessage || `must be between ${range[0]} and ${range[1]}`)
                            return
                        }
                    }
                    $number(input)
                    handleInput(null, input)
                    $numberModalShown(false)
                }}
            >
                <div className="flex jcc">
                    <div>
                        <input type="text" ref={numberModalInput} />
                        {numberModalError && <div className="--error">{numberModalError}</div>}
                    </div>
                </div>
            </Modal>
        </>
    )
}