import { useEffect, useState } from 'react'
import { Nav } from '../../../components/Nav'
import { SearchBar } from '../../../components/SearchBar'
import { useUser } from '../../../hooks/useUser'
import { Post } from '../../../models/Post'
import { CheckIcon, PencilIcon } from '../../../components/Icons'
import { useValidation } from '../../../hooks/useValidation'
import { useSettings } from '../../../hooks/useSettings'
import { Section } from '../../../components/Section'
import { useParams } from 'react-router'
import { User } from '../../../models/User'
import { PostsDisplay } from '../../../components/PostsDisplay'
import { EditButton } from '../../../components/EditButton'
import { UserService } from '../../../services/UserService'
import { FollowButton } from './FollowButton'
import { PostService } from '../../../services/PostService'

export default function Account () {
  const { username } = useParams<{ username: string }>()
  const [account, setAccount] = useState<User | null>(null)
  const { updateUser, user } = useUser()
  const [posts, setPosts] = useState<Post[]>([])
  const [newName, setNewName] = useState<string | null>(null)
  const [newDescription, setNewDescription] = useState<string | null>(null)
  const [toEdit, setToEdit] = useState<'name' | 'description' | null>(null)
  const { errorMessage, validateName, validateDescription } = useValidation()
  const { setInvalidEditModalConfig, dictionary } = useSettings()
  const accountIsUser: boolean = user?.id === account?.id

  useEffect(() => {
    const fetchAccount = async () => {
      if (username === 'me') {
        setAccount(user)
        return
      }

      if (!username) return

      try {
        const newAccount: User = await UserService.getByUsername(username)

        setAccount(newAccount)
      } catch (error) {
        console.error('Error fetching account:', error)
      }
    }

    fetchAccount()
  }, [username, user])

  if (!account) return <div>{dictionary.loading?.value}</div>

  const handlePostDelete = (postId: number) => {
    if (!posts) return

    const newPosts: Post[] = posts.filter(post => post.id !== postId)

    setPosts(newPosts)
  }

  const handleSearch = async (query: string) => {
    if (query.trim() === '') {
      const userPosts: Post[] = (await account?.getPosts()) || []
      setPosts(userPosts)
      return
    }

    try {
      const newPosts: Post[] = await PostService.search(query)
      setPosts(newPosts)
    } catch (error) {
      console.error('Error fetching search results:', error)
    }
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
                <EditButton onEdit={handleChangeName}>
                  <CheckIcon />
                </EditButton>

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
                {accountIsUser && (
                  <EditButton onEdit={handleChangeName}>
                    <PencilIcon />
                  </EditButton>
                )}

                <h2 className='text-orange-crayola text-left w-fit bg-transparent outline-none font-poppins-regular content-end text-[clamp(20px,7vw,25px)]'>
                  {account.name || dictionary.loading.value}
                </h2>
              </>
            )}
          </div>

          <span className='text-caribbean-current font-poppins-light content-start text-[clamp(10px,4vw,20px)]'>
            {`${dictionary.joined} ${account.getDate()}`}
          </span>
        </div>

        <div
          className={`gap-x-[10px] justify-center w-full h-full grid ${
            accountIsUser ? 'grid-cols-[auto,1fr]' : 'grid-cols-[1fr]'
          } grid-rows-1`}
        >
          {toEdit === 'description' ? (
            <>
              <EditButton onEdit={handleChangeDescription}>
                <CheckIcon />
              </EditButton>

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
              {accountIsUser && (
                <EditButton onEdit={handleChangeDescription}>
                  <PencilIcon />
                </EditButton>
              )}

              <p className='h-[160px] w-[90%] text-white text-[clamp(5px,6vw,20px)] font-poppins-regular break-words whitespace-pre-wrap overflow-hidden overflow-wrap-anywhere'>
                {account.description || (
                  <span className='text-caribbean-current'>
                    {accountIsUser
                      ? dictionary.youDontHaveDescription.value
                      : dictionary.thisUserHasnotDescription.value}
                  </span>
                )}
              </p>
            </>
          )}
        </div>
      </article>

      {!accountIsUser && <FollowButton account={account} />}

      <SearchBar
        onSearch={handleSearch}
        placeholder={`${dictionary.search?.value} ${dictionary.my?.inMinus} ${dictionary.posts?.inMinus}...`}
      />

      <PostsDisplay posts={posts} onPostDelete={handlePostDelete} />

      <Nav />
    </Section>
  )
}
