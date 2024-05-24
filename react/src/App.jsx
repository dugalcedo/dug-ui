import Form from "./dug-ui-react/Form.jsx"

function App() {


  return (
    <div className="--layout">
      <h1>Dug UI React</h1>
      <main>
        <Form 
          head={<h2>sign up</h2>}
          fields={{
            username: {
              label: 'username',
              required: 'required'
            },
            password: {
              label: 'password',
              strongPassword: 'must contain at least one of each: lowercase, uppercase, number, symbol'
            },
            password2: {
              label: 'repeat password'
            }
          }}
          mustMatch={[
            {
              fields: ['password', 'password2'],
              message: 'passwords must match'
            }
          ]}
        />
      </main>
    </div>
  )
}

export default App
