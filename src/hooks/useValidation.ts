import { UserService } from './../services/UserService'
import { useState } from 'react'
import { useSettings } from './useSettings'
import { useSession } from './useSession'

export function useValidation () {
  const { dictionary, openModal } = useSettings()
  const { loggedUser } = useSession()
  const [error, setError] = useState<string | null>(null)

  const validateName = async ({
    name,
    unique = false
  }: {
    name: string | undefined | null
    unique?: boolean
  }): Promise<boolean> => {
    if (!name) {
      setError(dictionary.emptyNameError)
      return false
    }

    if (name.length > 20 || name.length < 3) {
      setError(dictionary.nameLengthError)
      return false
    }

    if (unique) {
      const nameExists = await UserService.nameExists({ name })

      if (nameExists === null) {
        openModal('connection')
      } else if (!nameExists) {
        return true
      }

      setError(dictionary.nameInUse)
      return false
    }

    setError(null)
    return true
  }

  const validateDescription = ({
    description
  }: {
    description: string | undefined | null
  }) => {
    if (description == null || description == undefined) {
      setError(dictionary.emptyDescriptionError)
      return false
    }

    if (description.length > 200) {
      setError(dictionary.descriptionLengthError)
      return false
    }

    if (description.trim() === loggedUser?.description?.trim()) {
      setError(dictionary.youAlreadyHaveThisDescription)
      return false
    }

    setError(null)
    return true
  }

  const validateEmail = async ({
    email,
    unique = false
  }: {
    email: string | undefined
    unique?: boolean
  }) => {
    if (!email) {
      setError(dictionary.emptyEmailError)
      return false
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(dictionary.invalidEmailError)
      return false
    }

    if (unique) {
      const emailExists = await UserService.emailExists({ email })

      if (emailExists === null) {
        openModal('connection')
      } else if (!emailExists) {
        return true
      }

      setError(dictionary.emailInUse)
      return false
    }

    setError(null)
    return true
  }

  const validatePassword = ({ password }: { password: string | undefined }) => {
    if (!password) {
      setError(dictionary.emptyPasswordError)
      return false
    }

    if (password.length < 6 || password.length > 30) {
      setError(dictionary.passwordLengthError)
      return false
    }

    setError(null)
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

    if (!validPassword || !validConfirmedPassword) {
      return false
    }

    if (!confirmedPassword) {
      setError(dictionary.confirmPassword)
      return false
    }

    if (password !== confirmedPassword) {
      setError(dictionary.passwordsDontMatch)
      return false
    }

    setError(null)
    return true
  }

  const validateAgreeWithTerms = ({
    agreeWithTerms
  }: {
    agreeWithTerms: boolean | undefined
  }) => {
    if (!agreeWithTerms) {
      setError(dictionary.youMustAgreeWithTerms)
      return false
    }

    setError(null)
    return true
  }

  const validatePost = ({ postContent }: { postContent: string }) => {
    if (postContent.length === 0) {
      setError(dictionary.emptyPostError)
      return false
    }

    if (postContent.length > 200) {
      setError(dictionary.postLengthError)
      return false
    }

    setError(null)
    return true
  }

  const validateComment = ({ commentContent }: { commentContent: string }) => {
    if (commentContent.length === 0) {
      setError(dictionary.emptyPostError)
      return false
    }

    if (commentContent.length > 200) {
      setError(dictionary.commentLengthError)
      return false
    }

    setError(null)
    return true
  }

  const isValid = async (params: {
    name?: string
    email?: string
    password?: string
    confirmedPassword?: string
    agreeWithTerms?: boolean
    nameUnique?: boolean
    emailUnique?: boolean
  }): Promise<boolean> => {
    if (
      params.password !== undefined ||
      params.confirmedPassword !== undefined
    ) {
      if (params.confirmedPassword) {
        const result = validatePasswords({
          password: params.password,
          confirmedPassword: params.confirmedPassword
        })

        if (!result) return false
      } else {
        const result = validatePassword({ password: params.password })

        if (!result) return false
      }
    }

    if (params.agreeWithTerms !== undefined) {
      const result = validateAgreeWithTerms({
        agreeWithTerms: params.agreeWithTerms
      })
      if (!result) return false
    }

    if (params.name !== undefined) {
      const result = await validateName({
        name: params.name,
        unique: params.nameUnique ?? false
      })
      if (!result) return false
    }

    if (params.email !== undefined) {
      const result = await validateEmail({
        email: params.email,
        unique: params.emailUnique ?? false
      })
      if (!result) return false
    }

    return true
  }

  return {
    error,
    setError,
    validateName,
    validateEmail,
    validatePasswords,
    validateAgreeWithTerms,
    validatePassword,
    validatePost,
    validateDescription,
    validateComment,
    isValid
  }
}
