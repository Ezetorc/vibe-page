import { useState } from 'react'

export function useValidation () {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const validateName = (name: string | undefined) => {
    if (!name) {
      setErrorMessage('Complete name field')
      return false
    }

    if (name.length > 20 || name.length < 6) {
      setErrorMessage('Name must be between 6 and 20 characters long')
      return false
    }

    setErrorMessage(null)
    return true
  }

  const validateEmail = (email: string | undefined) => {
    if (!email) {
      setErrorMessage('Complete email field')
      return false
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Invalid email format.')
      return false
    }

    setErrorMessage(null)
    return true
  }

  const validatePassword = (password: string | undefined) => {
    if (!password) {
      setErrorMessage('Complete password field')
      return false
    }

    if (password.length < 6 || password.length > 30) {
      setErrorMessage('Password must be at least 6 characters long')
      return false
    }

    setErrorMessage(null)
    return true
  }

  const validatePasswords = (
    password: string | undefined,
    confirmedPassword: string | undefined
  ) => {
    if (!password) {
      setErrorMessage('Complete password field')
      return false
    }

    if (!confirmedPassword) {
      setErrorMessage('Confirm password')
      return false
    }

    if (password.length < 6 || password.length > 30) {
      setErrorMessage('Password must be at least 6 characters long')
      return false
    }

    if (password !== confirmedPassword) {
      setErrorMessage('Passwords do not match')
      return false
    }

    setErrorMessage(null)
    return true
  }

  const validateAgreeWithTerms = (agreeWithTerms: boolean | undefined) => {
    if (!agreeWithTerms) {
      setErrorMessage('You must agree with the terms')
      return false
    }

    setErrorMessage(null)
    return true
  }

  return {
    errorMessage,
    validateName,
    validateEmail,
    validatePasswords,
    validateAgreeWithTerms,
    validatePassword
  }
}
