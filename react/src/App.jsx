import Form from "./dug-ui-react/Form.jsx"
import ThemeToggle from "./dug-ui-react/ThemeToggle.jsx"

function App() {


  return (
    <div className="--layout">
      <h1>Dug UI React</h1>
      <main>

        <ThemeToggle />
        <Form 

          head={<h2>sign up</h2>}

          fields={{
            username: {
              label: 'username',
              required: 'required',
              transform: {
                beforeValidation(v) {
                  return v.toLowerCase()
                }
              }
            },
            password: {
              label: 'password',
              strongPassword: 'must contain at least one of each: lowercase, uppercase, number, symbol',
              type: 'password'
            },
            password2: {
              label: 'repeat password',
              type: 'password'
            },
            color: {
              label: 'color',
              type: 'select',
              options: [
                'red',
                'blue',
                'green',
                {
                  text: 'very dark gray',
                  value: '#222222'
                }
              ]
            },
            gender: {
              label: 'gender',
              type: 'select',
              customOption: true,
              options: [
                'male',
                'female',
                'non-binary'
              ]
            },
            age: {
              label: 'age',
              type: 'number',
              range: [16, 125],
            }
          }}

          mustMatch={[
            {
              fields: ['password', 'password2'],
              message: 'passwords must match'
            }
          ]}

          handler={(e, data) => {
            console.log(data)
          }}
        />

      </main>
      
    </div>
  )
}

export default App
