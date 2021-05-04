import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { CssBaseline } from '@material-ui/core'

const darkTheme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          margin: 0,
          padding: 0,
          background: '#363537',
          color: '#FAFAFA',
        },
        html: {
          height: '100vh'
        },
      }
    }
  },

  palette: {
    type: 'dark',
    primary: {
      main: 'rgb(149,56,44)'
    }
  }
})

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <>
        <CssBaseline/>
        <App/>
      </>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
