import Form from "./dug-ui-react/Form2.jsx"
import ThemeToggle from "./dug-ui-react/ThemeToggle.jsx"

function App() {


  return (
    <div className="--layout">
      <h1>Dug UI React</h1>
      <main>

        <ThemeToggle />
        <Form 
          debug={true}
          head={<h2>sign up</h2>}

          fields={{
            username: {
              label: "username",
              placeholder: "username",
              required: true,
              min: 5
            },
            password: {
              type: 'password',
              placeholder: 'password',
              mustMatch: 'password2',
              required: true,
              strongPassword: true
            },
            password2: {
              type: 'password',
              mustMatch: 'password',
              label: 'repeat password',
              placeholder: 'repeat password'
            }
          }}

        />

      </main>
      
    </div>
  )
}

export default App
