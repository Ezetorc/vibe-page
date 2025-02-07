import { FormEvent, useEffect, useState } from 'react'
import { Nav } from '../../../components/Nav'
import { SearchBar } from '../../../components/SearchBar'
import { useUser } from '../../../hooks/useUser'
import { Post } from '../../../models/Post'
import { PostDisplay } from '../../../components/PostDisplay'
import { useDebounce } from '../../../hooks/useDebounce'
import { CheckIcon, PencilIcon } from '../../../components/Icons'
import { useValidation } from '../../../hooks/useValidation'
import { useSettings } from '../../../hooks/useSettings'
import { Section } from '../../../components/Section'
import { useParams } from 'react-router'
import { User } from '../../../models/User'

export default function Account () {
  const { username } = useParams<{ username: string }>()
  const [account, setAccount] = useState<User | null>(null)
  const { updateUser, user } = useUser()
  const [posts, setPosts] = useState<Post[]>([])
  const [search, setSearch] = useState<string>('')
  const [newName, setNewName] = useState<string | null>(null)
  const [newDescription, setNewDescription] = useState<string | null>(null)
  const [toEdit, setToEdit] = useState<'name' | 'description' | null>(null)
  const { errorMessage, validateName, validateDescription } = useValidation()
  const { setInvalidEditModalConfig, dictionary } = useSettings()
  const debouncedSearch = useDebounce(search, 200)
  const isAccountLogged: boolean = user?.id === account?.id

  useEffect(() => {
    const fetchAccount = async () => {
      if (username === 'me') {
        setAccount(user)
        return
      }

      if (!username) return

      try {
        const fetchedUser: User = await User.getByUsername(username)
        setAccount(fetchedUser)
      } catch (error) {
        console.error('Error fetching account:', error)
      }
    }

    fetchAccount()
  }, [username, user])

  const handlePostDelete = (postId: number) => {
    if (!posts) return

    const newPosts: Post[] = posts.filter(post => post.id !== postId)
    setPosts(newPosts)
  }

  useEffect(() => {
    const fetchData = async () => {
      if (debouncedSearch.trim() === '') {
        const userPosts: Post[] = (await account?.getPosts()) || []
        setPosts(userPosts)
        return
      }

      try {
        const newPosts: Post[] = await Post.search(debouncedSearch)
        setPosts(newPosts)
      } catch (error) {
        console.error('Error fetching search results:', error)
      }
    }

    fetchData()
  }, [debouncedSearch, account])

  if (!account) return <div>{dictionary.loading?.value}</div>

  const userDate: string = account.getDate()

  const handleSearch = (event: FormEvent<HTMLInputElement>): void => {
    setSearch(event.currentTarget.value)
  }

  const handleChangeName = async (): Promise<void> => {
    const isNewNameValid: boolean = validateName(newName)

    if (isNewNameValid && newName) {
      await account.changeName(newName)
      await updateUser(account.id)

      setToEdit(null)
      setNewName(null)
    } else if (toEdit === 'name') {
      setInvalidEditModalConfig({
        visible: true,
        errorMessage: errorMessage || dictionary.errorDuringNameChange.value
      })
    } else {
      setToEdit('name')
      setNewName(account.name)
    }
  }

  const handleChangeDescription = async (): Promise<void> => {
    const isNewDescriptionValid: boolean = validateDescription(newDescription)

    if (isNewDescriptionValid && newDescription != null) {
      await account.changeDescription(newDescription)
      await updateUser(account.id)

      setToEdit(null)
      setNewDescription(null)
    } else if (toEdit === 'description') {
      setInvalidEditModalConfig({
        visible: true,
        errorMessage:
          errorMessage || dictionary.errorDuringDescriptionChange.value
      })
    } else {
      setToEdit('description')
      setNewDescription(account.description)
    }
  }

  return (
    <Section>
      <article className='flex flex-col justify-center w-[clamp(300px,100%,700px)] h-[clamp(300px,auto,400px)] p-[20px] rounded-vibe border-vibe border-caribbean-current overflow-hidden'>
        <div className='gap-x-[20px] justify-center grid grid-cols-[1fr,2fr] grid-rows-[1fr,1fr]'>
          <img className='self-center mb-[10px] justify-self-end row-[span_2] rounded-full w-[clamp(70px,50%,90px)] aspect-square bg-orange-crayola' />

          <div className='flex items-end'>
            {toEdit === 'name' ? (
              <>
                <button
                  onClick={handleChangeName}
                  className='p-[1%] transition-opacity rounded-vibe mb-[0.5%] mr-[1%]'
                >
                  <CheckIcon />
                </button>

                <input
                  minLength={3}
                  maxLength={20}
                  className='text-orange-crayola text-left w-fit bg-transparent outline-none font-poppins-regular content-end text-[clamp(20px,7vw,25px)]'
                  onChange={event => setNewName(event.target.value)}
                  defaultValue={account.name || dictionary.loading.value}
                />
              </>
            ) : (
              <>
                {isAccountLogged && (
                  <button
                    onClick={handleChangeName}
                    className='p-[1%] transition-opacity rounded-vibe mb-[0.5%] mr-[1%]'
                  >
                    <PencilIcon />
                  </button>
                )}

                <h2 className='text-orange-crayola text-left w-fit bg-transparent outline-none font-poppins-regular content-end text-[clamp(20px,7vw,25px)]'>
                  {account.name || dictionary.loading.value}
                </h2>
              </>
            )}
          </div>

          <span className='text-caribbean-current font-poppins-light content-start text-[clamp(10px,4vw,20px)]'>
            {`${dictionary.joined} ${userDate}`}
          </span>
        </div>

        <div
          className={`gap-x-[10px] justify-center w-full h-full grid ${
            isAccountLogged ? 'grid-cols-[auto,1fr]' : 'grid-cols-[1fr]'
          } grid-rows-1`}
        >
          {toEdit === 'description' ? (
            <>
              <button
                onClick={handleChangeDescription}
                className='p-[1%] mt-[10%] transition-opacity rounded-vibe h-[24px] aspect-square'
              >
                <CheckIcon />
              </button>

              <textarea
                minLength={0}
                maxLength={200}
                className='w-[90%] bg-transparent h-[160px] placeholder:text-caribbean-current resize-none outline-none break-words text-white text-[clamp(5px,6vw,20px)] font-poppins-regular'
                onChange={event => setNewDescription(event.target.value)}
                placeholder={dictionary.myNewDescription.value}
                defaultValue={account.description || ''}
              />
            </>
          ) : (
            <>
              {isAccountLogged && (
                <button
                  onClick={handleChangeDescription}
                  className='p-[1%] mt-[10%] transition-opacity rounded-vibe h-[24px] aspect-square'
                >
                  <PencilIcon />
                </button>
              )}

              <p className='h-[160px] w-[90%] text-white text-[clamp(5px,6vw,20px)] font-poppins-regular break-words whitespace-pre-wrap overflow-hidden overflow-wrap-anywhere'>
                {account.description || (
                  <span className='text-caribbean-current'>
                    {dictionary.youDontHaveDescription.value}
                  </span>
                )}
              </p>
            </>
          )}
        </div>
      </article>

      <SearchBar
        onInput={handleSearch}
        placeholder={`${dictionary.search?.value} ${dictionary.my?.inMinus} ${dictionary.posts?.inMinus}...`}
      />

      <div className='w-full flex flex-col items-center gap-y-[20px]'>
        {posts.length === 0 ? (
          <span>{dictionary.noPostsYet?.value}</span>
        ) : (
          posts.map(post => (
            <PostDisplay
              onDelete={handlePostDelete}
              key={post.id}
              post={post}
            />
          ))
        )}
      </div>

      <Nav />
    </Section>
  )
}
