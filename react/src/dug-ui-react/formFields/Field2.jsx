import { useRef } from "react"
import StringField from "./StringField.jsx"
import NumberField from "./NumberField.jsx"

class IdGenerator {
    #current = 0
    get newId() {
        const id = `--field-${this.#current}`
        this.#current++
        return id
    }
}

const idGen = new IdGenerator()

export default function FormField(props) {

    const id = useRef(idGen.newId)

    const {
        // function which is passed a sanitized value on change or input
        update,

        // string
        name,

        // input options
        options,

        // error messages
        errors
    } = props


    ////////// PROP VALIDATION /////////

    return (
        <div className={`--field${errors[name]?' --error-border':''}`}>
            <label htmlFor={id.current}>
                <span>{options.label || name}</span>
                <div className="--error">
                    {errors[name] && errors[name].map(msg => <div key={msg}>{msg}</div>)}
                </div>
            </label>
            <div className="--input">
                {(()=>{
                    switch(options.type) {
                        case 'number':
                            return <NumberField name={name} options={options} update={update} id={id.current} />
                        case 'text':
                        case 'email':
                        case 'password':
                        default:
                            return <StringField options={options} name={name} update={update} id={id.current}/>
                    }
                })()}
            </div>
        </div>
    )
}