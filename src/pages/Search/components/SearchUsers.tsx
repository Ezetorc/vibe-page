import { LoadSpinner } from '../../../components/LoadSpinner'
import { UsersDisplay } from './UsersDisplay'
import { useLoggedUser } from '../../../hooks/useLoggedUser'
import { useSettings } from '../../../hooks/useSettings'
import { useUsers } from '../hooks/useUsers'

export function SearchUsers (props: { searchQuery: string | undefined }) {
  const { loggedUser } = useLoggedUser()
  const { dictionary } = useSettings()
  const { users, ref, hasMore, success } = useUsers(props.searchQuery)
  const filteredUsers = users.filter(
    paginationUser => paginationUser.id !== loggedUser?.id
  )
  const isEmpty = filteredUsers.length === 0

  return (
    <>
      {success ? (
        isEmpty ? (
          <span className='text-caribbean-current '>
            {dictionary.noUsers}
          </span>
        ) : (
          <UsersDisplay users={filteredUsers} />
        )
      ) : (
        <LoadSpinner />
      )}
      {hasMore && <LoadSpinner reference={ref} />}
    </>
  )
}
