import { UserService } from './../services/UserService';
import { useState } from 'react'
import { useSettings } from './useSettings'

export function useValidation () {
  const { dictionary } = useSettings()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const validateName = (name: string | undefined | null) => {
    if (!name) {
      setErrorMessage(dictionary.emptyNameError?.value)
      return false
    }

    if (name.length > 20 || name.length < 3) {
      setErrorMessage(dictionary.nameLengthError?.value)
      return false
    }

    setErrorMessage(null)
    return true
  }

  const validateDescription = (description: string | undefined | null) => {
    if (description == null || description == undefined) {
      setErrorMessage(dictionary.emptyDescriptionError?.value)
      return false
    }

    if (description.length > 200) {
      setErrorMessage(dictionary.descriptionLengthError?.value)
      return false
    }

    setErrorMessage(null)
    return true
  }

  const validateEmail = async (email: string | undefined) => {
    if (!email) {
      setErrorMessage(dictionary.emptyEmailError?.value)
      return false
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage(dictionary.invalidEmailError?.value)
      return false
    }

    const emailAlreadyExists: boolean = await UserService.emailAlreadyExists(email)

    if (emailAlreadyExists) {
      setErrorMessage(dictionary.emailAlreadyExists?.value)
      return false
    }

    setErrorMessage(null)
    return true
  }

  const validatePassword = (password: string | undefined) => {
    if (!password) {
      setErrorMessage(dictionary.emptyPasswordError?.value)
      return false
    }

    if (password.length < 6 || password.length > 30) {
      setErrorMessage(dictionary.passwordLengthError?.value)
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
      setErrorMessage(dictionary.emptyPasswordError?.value)
      return false
    }

    if (!confirmedPassword) {
      setErrorMessage(dictionary.confirmPassword?.value)
      return false
    }

    if (password.length < 6 || password.length > 30) {
      setErrorMessage(dictionary.passwordLengthError?.value)
      return false
    }

    if (password !== confirmedPassword) {
      setErrorMessage(dictionary.passwordsDontMatch?.value)
      return false
    }

    setErrorMessage(null)
    return true
  }

  const validateAgreeWithTerms = (agreeWithTerms: boolean | undefined) => {
    if (!agreeWithTerms) {
      setErrorMessage(dictionary.youMustAgreeWithTerms?.value)
      return false
    }

    setErrorMessage(null)
    return true
  }

  const validatePost = (post: string) => {
    if (post.length === 0) {
      setErrorMessage(dictionary.emptyPostError?.value)
      return false
    }

    if (post.length > 200) {
      setErrorMessage(dictionary.postLengthError?.value)
      return false
    }

    setErrorMessage(null)
    return true
  }

  return {
    errorMessage,
    setErrorMessage,
    validateName,
    validateEmail,
    validatePasswords,
    validateAgreeWithTerms,
    validatePassword,
    validatePost,
    validateDescription
  }
}
