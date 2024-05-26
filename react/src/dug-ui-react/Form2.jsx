/*
    inputOptions
    [inputName]: {
        type:   (
                    'text', 'email', 'password', 'textarea',        String metatype
                    'number',                                       Number type
                    'range',                                        Range type
                    'date',                                         Date type
                    'select', 'radio',                              String-single-option type

                )
        label: string
        placeholder: string
    }
*/

import Field from './formFields/Field2.jsx'

import { useState, useEffect } from 'react'

const STRING_TYPES = ['text', 'textarea', 'email', 'password', 'search']
const NUMBER_TYPES = ['number']
import _validator from 'validator'
const validator = {
    isProvided(type = 'text', value) {
        if (STRING_TYPES.includes(type)) {
            return value
        } else if (NUMBER_TYPES.includes(type)) {
            return (value !== "") && !isNan(Number(value))
        }
    },
    isInRange(type = 'text', value, min, max) {
        if (STRING_TYPES.includes(type)) {
            return (value.length >= min && value.length <= max)
        } else if (NUMBER_TYPES.includes(type)) {
            return (value >= min && value <= max)
        }
    },
    isStrongPassword(value, passwordOptions) {
        return _validator.isStrongPassword(value, passwordOptions)
    }
}

const createMinMaxMessage = (min, max, minOnly, maxOnly, both) => {
    if (max === Infinity) {
        return minOnly
    } else if (min === -Infinity) {
        return maxOnly
    } else {
        return both
    }
}

export default function Form(props) {

    const {
        // string or JSX
        head = null,

        // string
        submitButton = "submit",

        // Object where key=inputName and value=inputOptions (see top)
        fields = {},

        handler = async (e, formData) => {},

        debug = false
    } = props

    ////////////////// PROP VALIDATION /////////////
    if (typeof fields !== 'object' || Array.isArray(fields)) {
        console.warn('Form fields must be an object literal where the keys are the input names and the values are the options.')
    }

    /////////////// STATE ///////////////
    const [formData, $formData] = useState({})
    const [errors, $errors] = useState({})

    //////// VALIDATE ////////
    function validateForm() {
        const newErrors = {}
        for (const name in fields) {
            const addError = (msg, nameOverride = name) => {
                if (!newErrors[nameOverride]) newErrors[nameOverride] = []
                newErrors[nameOverride].push(msg)
            }
            const field = fields[name]
            const value = formData[name]
            ///// FIELD PROPERTIES /////
            let { 
                required = false,
                min = -Infinity,
                max = Infinity,
                messages = {},
                strongPassword = false,
                passwordOptions = undefined,
                mustMatch = null,
            } = field
            ///// MESSAGES /////
            const {
                required: requiredMsg = 'required',
                minmax: minmaxMsg = (min, max) => {
                    if (STRING_TYPES.includes(field.type || 'text')) {
                        return createMinMaxMessage(
                            min, max,
                            `must be at least ${min} characters`,
                            `must be ${max} characters or less`,
                            `must be ${min} to ${max} characters long`
                        )
                    } else if (NUMBER_TYPES.includes(field.type || 'text')) {
                        return createMinMaxMessage(
                            min, max,
                            `must be at least ${min}`,
                            `cannot be more than ${max}`,
                            `min: ${min}, max: ${max}`
                        )
                    }
                },
                strongPassword: passwordMsg = "insecure password",
                mustMatch: mustMatchMsg = "fields must match"
            } = messages
            ///// VALIDATORS /////
            // required
            if (required) {
                if (!validator.isProvided(field.type, value)) addError(requiredMsg || (required === true ? 'required' : required))
            }
            // minmax
            if (!validator.isInRange(field.type, value, min, max)) addError(typeof minmaxMsg === 'function' ? minmaxMsg(min, max) : minmaxMsg)
            // strongPassword
            if (strongPassword) {
                if (!validator.isStrongPassword(value, passwordOptions)) addError(strongPassword === true ? passwordMsg : strongPassword)
            }
            // mustMatch
            if (mustMatch) {
                if (!Array.isArray(mustMatch)) mustMatch = [mustMatch]
                let matches = true
                mustMatch.forEach(name2 => {
                    const value2 = formData[name2]
                    if (value2 !== value) matches = false
                })
                if (!matches) addError(mustMatchMsg)
            }
        }
        //// SETTING ERRORS /////
        $errors(newErrors)
        const fail = Object.keys(newErrors).length > 0
        return fail
    }

    ////////////// HANDLER /////////////
    let submitting = false
    async function handleSubmit(e) {
        e.preventDefault()
        if (submitting) return
        submitting = true
        ////
        const fail = validateForm()
        ////
        submitting = false
    }

    ////////// DEBUG /////////
    useEffect(()=>{
        if (debug) {
            console.log("formData:", formData)
            console.log("errors:", errors)
        }
    }, [formData, errors])

    return (
        <form onSubmit={handleSubmit}>
            <div className="--layout">
                {head && (
                    <div className="--head">
                        {head}
                    </div>
                )}
                <div className="--main --body">
                    {Object.entries(fields).map(([inputName, inputOptions]) => {
                        return (
                            <Field 
                                key={inputName} 
                                name={inputName} 
                                options={inputOptions}
                                errors={errors}
                                update={value => {
                                    $formData($ => {
                                        $[inputName] = value
                                        return {...$}
                                    })
                                }}
                            />
                        )
                    })}
                </div>
                <div className="--foot">
                    <button>
                        {submitButton}
                    </button>
                </div>
            </div>
        </form>
    )
}