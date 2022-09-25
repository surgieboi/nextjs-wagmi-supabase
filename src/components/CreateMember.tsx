import { supabase } from "../../utils/supabaseClient";
import { useAccount } from 'wagmi'
import { useEffect, useState } from "react";

export function CreateMember() {
  const { address } = useAccount();
  const [member, setMember] = useState("");
  const behavior = "Loading...";
  const [behaviorText, setBehaviorText] = useState(behavior);
  const [checking, setChecking] = useState(true);

  useEffect(() => { 
    const fetchMember = async () => {
      const { data, error } = await supabase
        .from("member")
        .select('eth_address')
        .eq('eth_address', address)
        setChecking(true)
        setBehaviorText("Add Member")

        if (error) {
          alert("An error occurred while fetching data from Supabase.")
          console.log(error)
        }

        if (data?.length! >= 1) {
          console.log("The current wallet address is already connected to Supabase.")
          console.log(data)
          setBehaviorText("Update Member")
          setMember(address!)
          setChecking(true)
        }

        else {
          setChecking(false)
        }
    }
    fetchMember()
  }, [])

  const newMember = async () => {
    try {
      const { error } = await supabase
        .from("member")
        .insert([
          {
            eth_address: address
          },
        ])
        .single();
        setMember(address!);
        setBehaviorText("Update Member");
      if (error) throw error;
      alert("The current wallet address has been successfully connected to Supabase.");
    } catch (error) {
      alert("An error occurred while inserting data into Supabase.");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <button className="m-1 p-4 rounded bg-slate-900 text-white 
                          hover:bg-slate-700 active:bg-slate-500
                          focus:outline-none focus:ring focus:ring-slate-300
                          disabled:bg-slate-200 disabled:text-slate-500"
          disabled={checking} onClick={() => { newMember(); setChecking(true); }}>
          {behaviorText}
        </button>
      </div>
    </>
  )
}