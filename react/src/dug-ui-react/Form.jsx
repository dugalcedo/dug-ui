import { useRef, useState, useEffect } from "react"
import Field from "./Field.jsx"

export default function Form(props) {

    const {
        handler = async (e, data) => {},
        preventMultipleSubmits = true,
        head,
        foot,

        fields = {
            username: {
                label: 'username',
                name: 'username',
                placeholder: 'username',
                type: 'text'
            }
        },

        mustMatch = [], /*
            for example {[
                fields: ['password', 'password2'],
                message: 'passwords must match'
            ]}
        */

        submit = 'submit',

        validation = data => data,
    } = props

    const submitting = useRef(false)
    const data = useRef(Object.keys(fields).reduce((acc, cv) => {
        acc[cv] = { errors: null }
        return acc
    }, {}))

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (preventMultipleSubmits && submitting.current) return
        submitting.current = true

        // reset errors in DOM
        const form = e.target
        const errorDivs = form.querySelectorAll(':scope .--error')
        errorDivs.forEach(div => div.innerHTML = "")

        // check errors
        let foundErrors = false
        let formData = {}
        Object.entries(data.current).forEach(([name, { value, errors }]) => {
            if (errors) {
                foundErrors = true
                const div = form.querySelector(`:scope .--error[data-error="${name}"]`)
                errors.forEach(msg => div.innerHTML += `<div class="--error">${msg}</div>`)
            }
            formData[name] = value
        })
        mustMatch.forEach(({ fields, message }) => {
            const allMatch = fields.every(name1 => {
                return fields.every(name2 => {
                    return data.current[name1].value === data.current[name2].value
                })
            })
            if (!allMatch) {
                foundErrors = true
                fields.forEach(name => {
                    const div = form.querySelector(`:scope .--error[data-error="${name}"]`)
                    div.innerHTML += `<div class="--error">${message}</div>`
                })
            }
        })

        if (!foundErrors) await handler(e, formData)
        submitting.current = false
    }

    return (
        <form onSubmit={handleSubmit}>
            {head && (
                <div className="--head">
                    {head}
                </div>
            )}
            <div className="--body">
                {Object.entries(fields).map(([name, field]) => {
                    return <Field key={name} field={{...field, name}} onInput={(value, errors) => {
                        data.current[name] = { value, errors }
                    }} />
                })}
            </div>
            <div className="--foot">
                {foot ? foot : (
                    <button type="submit">
                        {submit}
                    </button>
                )}
            </div>
        </form>
    )
}