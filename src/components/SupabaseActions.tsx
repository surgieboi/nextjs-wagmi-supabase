import * as React from 'react'
import { useEffect, useState } from "react"
import { useDebounce } from 'use-debounce'
import { supabase } from "../../utils/supabaseClient"
import { parseEther, verifyMessage } from 'ethers/lib/utils'
import { 
  useAccount, 
  useSignMessage,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction
} from 'wagmi'

export function SupabaseActions() {

  const { address } = useAccount()
  const [member, setMember] = useState("")
  const behavior = "Loading..."
  const [behaviorText, setBehaviorText] = useState(behavior)
  const [checking, setChecking] = useState(true);

  const [to, setTo] = useState("")
  const [value, setValue] = useState("")
  const [debouncedTo] = useDebounce(to, 500)
  const [debouncedValue] = useDebounce(value, 500)
  const { config } = usePrepareSendTransaction({
    request: {
      to: debouncedTo,
      value: debouncedValue ? parseEther(debouncedValue) : undefined,
    },
  })
  const { data:dataB, sendTransaction } = useSendTransaction(config)
  const { isLoading:isLoadingB, isSuccess } = useWaitForTransaction({
    hash: dataB?.hash,
  })
 
  const [textMessage, setTextMessage] = useState("")
  const [signature, setSignature] = useState(false)
  const recoveredAddress = React.useRef<string>()
  const { data:dataA, error, isLoading:isLoadingA, signMessage } = useSignMessage({
    onSuccess(data, variables) {
      const address = verifyMessage(variables.message, data)
      recoveredAddress.current = address
      setSignature(true)
    },
  })
  
  useEffect(() => { 
    const fetchMember = async () => {
      const { data, error } = await supabase
        .from("wallets")
        .select('wallet_address')
        .eq('wallet_address', address)
        setChecking(true)
        setBehaviorText("Add Wallet")

        if (error) {
          console.log("An error occurred while fetching a wallet address from Supabase.")
          console.log(error)
        }

        if (data?.length! >= 1) {
          console.log("The current wallet address is already saved in Supabase.")
          console.log(data)
          setBehaviorText("Update Wallet")
          setMember(address!)
          setChecking(true)
        }

        else {
          setChecking(false)
        }
    }
    fetchMember()

    if (!setSignature) {
      console.log("Waiting for signing response.")
    }

    if (signature) {
      console.log("Signing response data has arrived.")
      newSigning();
    }

    if (isSuccess) {
      newTransaction()
    }
  }, [signature, setSignature])

  const newMember = async () => {
    try {
      const { error } = await supabase
        .from("wallets")
        .insert([
          {
            wallet_address: address
          },
        ])
        .single();
        setMember(address!);
        setBehaviorText("Update Wallet");
      if (error) throw error;
      console.log("The current wallet address has been saved saved in Supabase.");
    } catch (error) {
      console.log("An error occurred while inserting the current wallet's address into Supabase.");
    }
  };

  const newSigning = async () => {
    try {
      const { error } = await supabase
        .from("signings")
        .insert([
          {
            address: recoveredAddress.current,
            signature: dataA
          },
        ])
        .single()
        setTextMessage('')
      if (error) throw error;
      console.log("A signing has been successfully inserted into Supabase.");
    } catch (error) {
      console.log("An error occurred while inserting signing data into Supabase.");
    }
  };

  const newTransaction = async () => {
    try {
      const { error } = await supabase
        .from("transactions")
        .insert([
          {
            tx_hash: dataB?.hash,
            from: address,
            to: to,
            amount: value
          },
        ])
        .single()
      if (error) throw error;
      console.log("A transaction has been successfully inserted into Supabase.");
    } catch (error) {
      console.log("An error occurred while inserting a new transaction into Supabase.");
    }
  };

  return (
    <>

      <div className="w-full lg:w-3/4
                    flex flex-col 
                    items-center justify-center 
                    mx-auto px-6">
        <button className="w-full
                          m-1 p-4 
                          rounded 
                          bg-slate-900 text-white 
                          hover:bg-slate-800 active:bg-slate-800
                          focus:outline-none focus:ring focus:ring-slate-300
                          disabled:bg-slate-200 disabled:text-slate-500"
          disabled={checking} onClick={() => { newMember(); setChecking(true); }}>
          {behaviorText}
        </button>
      </div>

      <div className="w-full lg:w-3/4
                    flex flex-col 
                    items-center justify-center 
                    mx-auto px-6">
        <hr className="w-full my-6"></hr>
      </div>

      <div className="w-full lg:w-3/4
                    flex flex-col
                    md:flex-row
                    items-start justify-center 
                    mx-auto px-6">
        <div className="w-full md:w-1/2 my-3 pr-2">
          <form
            className="flex flex-col w-full"
            onSubmit={(event) => {
              event.preventDefault()
              const formData = new FormData(event.target)
              const message = formData.get('message')
              signMessage({ message })
              setSignature(false)
            }}
          >
            <p className="text-xl font-semibold">Sign Message</p>
            <label htmlFor="message">Enter a message to be signed:</label>
            <textarea
              id="message"
              name="message"
              value={textMessage} 
              onChange={(e)=>{setTextMessage(e.target.value)}}
              placeholder="Type a message to sign..."
              className="w-full 
                    my-3 p-4 
                    rounded border border-slate-300 
                    focus:outline-0
                    focus:border-slate-900"
            />
            <button className="w-full
                          mb-3 p-4 
                          rounded 
                          bg-slate-900 text-white 
                          hover:bg-slate-800 active:bg-slate-800
                          focus:outline-none focus:ring focus:ring-slate-300
                          disabled:bg-slate-200 disabled:text-slate-500"
              disabled={isLoadingA || !member || !textMessage}>
              {isLoadingA ? 'Checking Wallet...' : 'Sign Message'}
            </button>

            {dataA && (
              <div>
                <div className="text-ellipsis overflow-hidden">
                  <span className="mr-1 
                              font-bold">
                    Recovered Address:
                  </span>
                  {recoveredAddress.current}
                </div>
                <div className="text-ellipsis 
                                overflow-hidden">
                  <span className="mr-1 
                                font-bold">
                    Signature:
                  </span>
                  {dataA}
                </div>
              </div>
            )}

            {error && 
              <div className="m-1 py-2 
                              text-sm font-semibold text-red-500">
              {error.message}
            </div>
            }
          </form>
        </div>
        <div className="w-full md:w-1/2 my-3 pl-2">
          <p className="text-xl font-semibold">Send Transaction</p>
          <label>Enter an address and amount to send:</label>

          <form
            className="flex flex-col w-full"
            onSubmit={(e) => {
              e.preventDefault()
              sendTransaction?.()
            }}
          >
            <label className="mt-3
                              block 
                              text-sm font-medium text-slate-900">Recipient's Address</label>
            <input
              aria-label="Recipient"
              onChange={(e) => setTo(e.target.value)}
              placeholder="0xA0Cf…251e"
              value={to}
              className="mt-1 p-4 
                        rounded border border-slate-300 
                        focus:outline-0
                        focus:border-slate-900"
            />
            <label className="mt-3
                              block 
                              text-sm font-medium text-slate-900">Amount (Ether)</label>
            <input
              type="number"
              aria-label="Amount (Ether)"
              onChange={(e) => setValue(e.target.value)}
              placeholder="0.05"
              value={value}
              className="mt-1 mb-3 p-4 
                        rounded border border-slate-300 
                        focus:outline-0
                        focus:border-slate-900"
            />
            <button className="w-full
                          mb-3 p-4 
                          rounded 
                          bg-slate-900 text-white 
                          hover:bg-slate-800 active:bg-slate-800
                          focus:outline-none focus:ring focus:ring-slate-300
                          disabled:bg-slate-200 disabled:text-slate-500"
              disabled={isLoadingB || !sendTransaction || !to || !value || !member}>
              {isLoadingB ? 'Sending...' : 'Send'}
            </button>
            {isSuccess && (
              <div className="text-ellipsis 
                              overflow-hidden">
                Successfully sent {value} ether to {to}
                <div>
                  <a href={`https://etherscan.io/tx/${dataB?.hash}`} target="_blank">View on Etherscan</a>
                </div>
              </div>
            )}
          </form>

        </div>
      </div>

    </>
  )
}