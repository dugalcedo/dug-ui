import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import '../../dug-ui.css'
import DugUIContext from "./dug-ui-react/DugUIContext.jsx"

ReactDOM.createRoot(document.getElementById('root')).render(
    <DugUIContext>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </DugUIContext>
)
