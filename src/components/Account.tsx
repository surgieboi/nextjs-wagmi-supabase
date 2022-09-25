import { useAccount, useEnsName } from 'wagmi'

export function Account() {
  const { address } = useAccount()
  const { data: ensNameData } = useEnsName({ address })

  return (
    <div className="flex flex-col items-center justify-center m-1 py-2 sm:flex-row">
      <span className="font-bold mr-1">Wallet Address:</span>
      {ensNameData ?? address}
      {ensNameData ? ` (${address})` : null}
    </div>
  )
}
