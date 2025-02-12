import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Nav } from '../../../components/Nav'
import { SearchBar } from '../../../components/SearchBar'
import { useUser } from '../../../hooks/useUser'
import { Post } from '../../../models/Post'
import { CheckIcon, PencilIcon } from '../../../components/Icons'
import { useValidation } from '../../../hooks/useValidation'
import { useSettings } from '../../../hooks/useSettings'
import { Section } from '../../../components/Section'
import { User } from '../../../models/User'
import { PostsDisplay } from '../../../components/PostsDisplay'
import { EditButton } from '../../../components/EditButton'
import { UserService } from '../../../services/UserService'
import { FollowButton } from './FollowButton'
import { PostService } from '../../../services/PostService'

export default function Account () {
  const { username } = useParams<{ username: string }>()
  const { errorMessage, validateName, validateDescription } = useValidation()
  const { setVisibleModal, dictionary } = useSettings()
  const { updateUser, user } = useUser()
  const [account, setAccount] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [editState, setEditState] = useState<{
    field: 'name' | 'description' | null
    value: string
  }>({
    field: null,
    value: ''
  })
  const accountIsUser: boolean = user?.id === account?.id

  useEffect(() => {
    const fetchAccount = async () => {
      if (username === 'me') {
        setAccount(user)
      } else if (username) {
        try {
          const newAccount: User | null = await UserService.getByUsername({
            username
          })

          setEditState({
            field: null,
            value: ''
          })
          setPosts([])
          setAccount(newAccount)
        } catch (error) {
          console.error('Error fetching account:', error)
        }
      }
    }

    fetchAccount()
  }, [username, user])

  if (!account) return <div>{dictionary.loading}</div>

  const handlePostDelete = (postId: number) => {
    const newPosts: Post[] = posts.filter(post => post.id !== postId)

    setPosts(newPosts)
  }

  const handleEdit = async () => {
    const { field, value } = editState

    if (!field) return

    const isValid: boolean =
      field === 'name'
        ? validateName({ name: value })
        : validateDescription({ description: value })

    if (isValid) {
      await (field === 'name'
        ? account.changeName({ newName: value })
        : account.changeDescription({ newDescription: value }))

      await updateUser(account.id)

      setEditState({ field: null, value: '' })
    } else {
      setVisibleModal({
        name: 'edit',
        message:
          errorMessage ||
          dictionary[
            `errorDuring${field === 'name' ? 'Name' : 'Description'}Change`
          ]
      })
    }
  }

  const handleSearch = async (query: string) => {
    if (query.trim() === '') {
      const userPosts: Post[] = await account.getPosts()

      setPosts(userPosts)
      return
    }

    try {
      const newPosts: Post[] = await PostService.search({ query })

      setPosts(newPosts)
    } catch (error) {
      console.error('Error fetching search results:', error)
    }
  }

  return (
    <Section>
      <article className='flex flex-col justify-center w-[clamp(300px,100%,700px)] h-[clamp(300px,auto,400px)] p-[20px] rounded-vibe border-vibe border-caribbean-current overflow-hidden'>
        <div className='gap-x-[20px] justify-center grid grid-cols-[1fr,2fr] grid-rows-[1fr,1fr]'>
          <img className='self-center mb-[10px] justify-self-end row-[span_2] rounded-full w-[clamp(70px,50%,90px)] aspect-square bg-orange-crayola' />

          <div className='flex items-end'>
            {editState.field === 'name' ? (
              <>
                <EditButton onEdit={handleEdit}>
                  <CheckIcon />
                </EditButton>
                <input
                  minLength={3}
                  maxLength={20}
                  className='text-orange-crayola bg-transparent outline-none font-poppins-regular text-[clamp(20px,7vw,25px)]'
                  onChange={event =>
                    setEditState({ field: 'name', value: event.target.value })
                  }
                  defaultValue={account.name || dictionary.loading}
                />
              </>
            ) : (
              <>
                {accountIsUser && (
                  <EditButton
                    onEdit={() =>
                      setEditState({ field: 'name', value: account.name })
                    }
                  >
                    <PencilIcon />
                  </EditButton>
                )}
                <h2 className='text-orange-crayola bg-transparent font-poppins-regular text-[clamp(20px,7vw,25px)]'>
                  {account.name || dictionary.loading}
                </h2>
              </>
            )}
          </div>

          <span className='text-caribbean-current font-poppins-light text-[clamp(10px,4vw,20px)]'>
            {`${dictionary.joined} ${account.getDate()}`}
          </span>
        </div>

        <div
          className={`gap-x-[10px] justify-center w-full h-full grid ${
            accountIsUser ? 'grid-cols-[auto,1fr]' : 'grid-cols-[1fr]'
          }`}
        >
          {editState.field === 'description' ? (
            <>
              <EditButton onEdit={handleEdit}>
                <CheckIcon />
              </EditButton>
              <textarea
                minLength={0}
                maxLength={200}
                className='w-[90%] bg-transparent h-[160px] placeholder:text-caribbean-current resize-none outline-none break-words text-white text-[clamp(5px,6vw,20px)] font-poppins-regular'
                onChange={event =>
                  setEditState({
                    field: 'description',
                    value: event.target.value
                  })
                }
                placeholder={dictionary.myNewDescription}
                defaultValue={account.description || ''}
              />
            </>
          ) : (
            <>
              {accountIsUser && (
                <EditButton
                  onEdit={() =>
                    setEditState({
                      field: 'description',
                      value: account.description
                    })
                  }
                >
                  <PencilIcon />
                </EditButton>
              )}
              <p className='h-[160px] w-[90%] text-white text-[clamp(5px,6vw,20px)] font-poppins-regular break-words whitespace-pre-wrap overflow-hidden overflow-wrap-anywhere'>
                {account.description || (
                  <span className='text-caribbean-current'>
                    {accountIsUser
                      ? dictionary.youDontHaveDescription
                      : dictionary.thisUserHasnotDescription}
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
        placeholder={dictionary.searchMyPosts}
      />

      <PostsDisplay posts={posts} onPostDelete={handlePostDelete} />
      <Nav />
    </Section>
  )
}
