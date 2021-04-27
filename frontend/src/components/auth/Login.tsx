import makeStyles from '@material-ui/core/styles/makeStyles'
import React, { useState } from 'react'
import { FormInput } from '../utils/FormInputs'
import { useForm } from 'react-hook-form'
import Button from '@material-ui/core/Button'
import { api } from '../utils/DataProvider'
import { Typography } from '@material-ui/core'
import { useHistory } from 'react-router'

const useStyles = makeStyles({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    position: 'fixed',
  },

  formContainer: {
    padding: '1em',
    display: 'flex',
    flexDirection: 'column',
    margin: 0,
    justifyContent: 'center',
  },

  form: {
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content',
    border: 'solid',
    borderWidth: '2px',
    borderRadius: '10px',
    background: 'linear-gradient(349deg, rgb(240,240,240), rgb(245,245,245))',
    boxShadow: '2px 2px 10px -2px black',
  },

  input: {
    margin: '5px',
  },
})

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers = { Authorization: 'Bearer ' + accessToken }
      console.log('authorized')
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

export const login = (username: string, password: string) =>
  api.post('/auth/login', { username, password })

export const isLoggedIn = () => !!localStorage.getItem('accessToken')

export const Login = () => {
  const classes = useStyles()
  const { control, handleSubmit, errors } = useForm()

  const [badCredentials, setBadCredentials] = useState(false)

  const history = useHistory()

  const onSubmit = (data: { username: string; password: string }) => {
    login(data.username, data.password)
      .then((res) => {
        setBadCredentials(false)
        localStorage.setItem('accessToken', res.data.token)
        localStorage.setItem('username', res.data.username)
        console.log(res)
        history.push('/')
      })
      .catch((err) => {
        if (err.status === 401) {
          setBadCredentials(true)
        } else {
          console.log(err)
        }
        console.log(isLoggedIn())
      })
  }

  return (
    <div className={classes.container}>
      <div className={classes.formContainer}>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            className={classes.input}
            type="text"
            name="username"
            label="Username"
            control={control}
            defaultValue=""
            rules={{ required: true, minLength: 4 }}
            errors={errors}
            helperText={errors.username && '>4 characters'}
          />
          <FormInput
            className={classes.input}
            defaultValue=""
            type="password"
            name="password"
            label="Password"
            control={control}
            rules={{ required: true, minLength: 4 }}
            errors={errors}
            helperText={errors.password && '>4 characters'}
          />
          {badCredentials && <Typography color="error">Bad credentials!</Typography>}

          <Button className={classes.input} type="submit" variant="contained" color="primary">
            Log in
          </Button>
        </form>
      </div>
    </div>
  )
}
