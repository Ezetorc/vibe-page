import { UserService } from './../services/UserService'
import { useState } from 'react'
import { useSettings } from './useSettings'

export function useValidation () {
  const { dictionary } = useSettings()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const validateName = async ({
    name,
    unique = false
  }: {
    name: string | undefined | null
    unique?: boolean
  }): Promise<boolean> => {
    if (!name) {
      setErrorMessage(dictionary.emptyNameError)
      return false
    }

    if (name.length > 20 || name.length < 3) {
      setErrorMessage(dictionary.nameLengthError)
      return false
    }

    if (unique) {
      const nameExists = await UserService.nameAlreadyExists({ name })

      if (!nameExists.value) return true
      
      setErrorMessage(dictionary.nameInUse)
      return false
    }

    setErrorMessage(null)
    return true
  }

  const validateDescription = ({
    description
  }: {
    description: string | undefined | null
  }) => {
    if (description == null || description == undefined) {
      setErrorMessage(dictionary.emptyDescriptionError)
      return false
    }

    if (description.length > 200) {
      setErrorMessage(dictionary.descriptionLengthError)
      return false
    }

    setErrorMessage(null)
    return true
  }

  const validateEmail = async ({ email }: { email: string | undefined }) => {
    if (!email) {
      setErrorMessage(dictionary.emptyEmailError)
      return false
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage(dictionary.invalidEmailError)
      return false
    }

    const emailAlreadyExists = await UserService.emailAlreadyExists({
      email
    })

    if (emailAlreadyExists.value) {
      setErrorMessage(dictionary.emailAlreadyExists)
      return false
    }

    setErrorMessage(null)
    return true
  }

  const validatePassword = ({ password }: { password: string | undefined }) => {
    if (!password) {
      setErrorMessage(dictionary.emptyPasswordError)
      return false
    }

    if (password.length < 6 || password.length > 30) {
      setErrorMessage(dictionary.passwordLengthError)
      return false
    }

    setErrorMessage(null)
    return true
  }

  const validatePasswords = ({
    password,
    confirmedPassword
  }: {
    password: string | undefined
    confirmedPassword: string | undefined
  }) => {
    const validPassword = validatePassword({ password })
    const validConfirmedPassword = validatePassword({
      password: confirmedPassword
    })

    if (!validPassword) {
      return false
    }

    if (!validConfirmedPassword) {
      return false
    }

    if (!confirmedPassword) {
      setErrorMessage(dictionary.confirmPassword)
      return false
    }

    if (password !== confirmedPassword) {
      setErrorMessage(dictionary.passwordsDontMatch)
      return false
    }

    setErrorMessage(null)
    return true
  }

  const validateAgreeWithTerms = ({
    agreeWithTerms
  }: {
    agreeWithTerms: boolean | undefined
  }) => {
    if (!agreeWithTerms) {
      setErrorMessage(dictionary.youMustAgreeWithTerms)
      return false
    }

    setErrorMessage(null)
    return true
  }

  const validatePost = ({ post }: { post: string }) => {
    if (post.length === 0) {
      setErrorMessage(dictionary.emptyPostError)
      return false
    }

    if (post.length > 200) {
      setErrorMessage(dictionary.postLengthError)
      return false
    }

    setErrorMessage(null)
    return true
  }

  const validateComment = ({ comment }: { comment: string }) => {
    if (comment.length === 0) {
      setErrorMessage(dictionary.emptyPostError)
      return false
    }

    if (comment.length > 200) {
      setErrorMessage(dictionary.commentLengthError)
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
    validateDescription,
    validateComment
  }
}
