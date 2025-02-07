import { Dictionaries } from '../models/Dictionaries.ts'
import { Language } from '../models/Language.ts'
import { Word } from '../models/Word.ts'
import Papa from 'papaparse'

export async function getDictionaries (): Promise<Dictionaries> {
  const response: Response = await fetch('src/constants/dictionary.csv')
  const text: string = await response.text()
  const { data } = Papa.parse<string[]>(text, { skipEmptyLines: true })
  const languages: Language[] = data[0].slice(1) as Language[]
  const dictionaries: Partial<Dictionaries> = {}

  languages.forEach(language => {
    dictionaries[language] = {}
  })

  for (let i = 1; i < data.length; i++) {
    const values: string[] = data[i]
    const key: string = values[0]

    languages.forEach((language, languageIndex) => {
      dictionaries[language]![key] = new Word(values[languageIndex + 1] || '')
    })
  }

  return dictionaries as Dictionaries
}
