import { LoadSpinner } from '../../../components/LoadSpinner'
import { UsersDisplay } from '../../../components/UsersDisplay'
import { useUsers } from '../hooks/useUsers'

export function SearchUsers (props: { searchQuery: string | undefined }) {
  const { users, ref, hasMore } = useUsers(props.searchQuery)

  return (
    <>
      <UsersDisplay users={users} />
      {hasMore && <LoadSpinner reference={ref} />}
    </>
  )
}
