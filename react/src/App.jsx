import Form from "./dug-ui-react/Form2.jsx"
import ThemeToggle from "./dug-ui-react/ThemeToggle.jsx"


function App() {


  return (
    <div className="--layout">
      <h1>Dug UI React</h1>
      <main>

        <ThemeToggle />
        <Form 
          // debug={true}
          head={<h2>sign up</h2>}

          fields={{
            username: {
              label: "username",
              placeholder: "username",
              required: true,
              min: 5
            },
            email: {
              label: 'email',
              placeholder: 'email',
              required: true,
              email: true
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
            },
            age: {
              type: 'number',
              label: 'age',
              min: 16,
              max: 130,
              extraStep: 5
            }
          }}

        />

      </main>
      
    </div>
  )
}

export default App
