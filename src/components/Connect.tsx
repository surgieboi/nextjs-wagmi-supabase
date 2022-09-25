import { useAccount, useConnect, useDisconnect } from 'wagmi'

import { useIsMounted } from '../hooks'

export function Connect() {
  const isMounted = useIsMounted()
  const { connector, isConnected } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()
  const { disconnect } = useDisconnect()

  return (
    <div className="flex flex-col items-center justify-center mt-20">

      <h1 className="text-2xl mb-3 font-semibold">
        Save Web3 Wallet Addresses in Supabase
      </h1>

      <div className="flex flex-col sm:flex-row">
        {isConnected && (
          <button className="m-1 p-4 rounded 
                            bg-white text-black border border-1 border-slate-900 
                            hover:bg-black hover:text-white"
            onClick={() => disconnect()}>
            Disconnect from {connector?.name}
          </button>
        )}

        {connectors
          .filter((x) => isMounted && x.ready && x.id !== connector?.id)
          .map((x) => (
            <button className="m-1 p-4 rounded 
                              bg-white text-black border border-1 border-slate-900 
                              hover:bg-black hover:text-white"
              key={x.id} onClick={() => connect({ connector: x })}>
              {x.name}
              {isLoading && x.id === pendingConnector?.id && ' is connecting...'}
            </button>
          ))}
      </div>

      {error && <div className="m-1 py-2 text-sm font-semibold text-red-500">{error.message}</div>}
    </div>
  )
}
