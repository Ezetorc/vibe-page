import { languages } from "../../../constants/settings";

export function Languages () {
  return (
    <>
      {Object.entries(languages).map((language, index) => (
        <option key={index} value={language[0]}>
          {language[1]}
        </option>
      ))}
    </>
  )
}
