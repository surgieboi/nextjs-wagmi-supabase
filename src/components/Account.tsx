import { useAccount, useEnsName } from 'wagmi'

export function Account() {
  const { address } = useAccount()
  const { data: ensNameData } = useEnsName({ address })

  return (
    <div className="flex flex-col items-center justify-center 
                  sm:flex-row 
                  m-1 py-2">
      <span className="mr-1 
                      font-bold">
        Wallet Address:
      </span>
      {ensNameData ?? address}
      {ensNameData ? ` (${address})` : null}
    </div>
  )
}
