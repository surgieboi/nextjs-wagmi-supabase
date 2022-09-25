import * as React from 'react'
import { useAccount } from 'wagmi'

import { Account, Connect, CreateMember } from '../components'
import { useIsMounted } from '../hooks'

function Page() {
  const isMounted = useIsMounted()
  const { isConnected } = useAccount()

  return (
    <>
      <Connect />

      {isMounted && isConnected && (
        <>
          <Account />
          <CreateMember />
        </>
      )}
    </>
  )
}

export default Page
