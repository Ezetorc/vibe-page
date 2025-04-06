import { LANGUAGES } from '../../../constants/LANGUAGES'

export function Languages () {
  return (
    <>
      {Object.entries(LANGUAGES).map((language, index) => (
        <option key={index} value={language[0]}>
          {language[1]}
        </option>
      ))}
    </>
  )
}
