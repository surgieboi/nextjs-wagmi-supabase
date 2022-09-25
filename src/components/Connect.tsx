import { useAccount, useConnect, useDisconnect } from 'wagmi'

import { useIsMounted } from '../hooks'

export function Connect() {
  const isMounted = useIsMounted()
  const { connector, isConnected } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()
  const { disconnect } = useDisconnect()

  return (
    <div className="w-full lg:w-3/4
                    flex flex-col 
                    items-center justify-center 
                    mt-10 mx-auto px-6">

      <div className="w-full
                      flex flex-col
                      items-center justify-center">
        <h1 className="mb-2 
                    text-3xl font-semibold text-center">
          Save Web3 Addresses and Metadata in Supabase
        </h1>
        <p className="mb-3">
          Connect using a wallet provider below:
        </p>
      </div>
      

      <div className="w-full
                      flex flex-col sm:flex-row">
        {isConnected && (
          <button className="w-full
                            m-1 p-4 
                            rounded 
                            bg-white text-black border border-1 border-slate-900 
                            hover:bg-black hover:text-white"
            onClick={() => disconnect()}>
            Disconnect from {connector?.name}
          </button>
        )}

        {connectors
          .filter((x) => isMounted && x.ready && x.id !== connector?.id)
          .map((x) => (
            <button className="w-full 
                              m-1 p-4 
                              rounded 
                              bg-white text-black border border-1 border-slate-900 
                              hover:bg-black hover:text-white"
              key={x.id} onClick={() => connect({ connector: x })}>
              {x.name}
              {isLoading && x.id === pendingConnector?.id && ' is connecting...'}
            </button>
          ))}
      </div>

      {error && <div className="m-1 py-2 
                              text-sm font-semibold text-red-500">
        {error.message}
      </div>
      }
    </div>
  )
}
