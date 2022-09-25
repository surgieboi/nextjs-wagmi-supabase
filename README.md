# Connecting Web3 Wallets to Supabase using Wagmi

This proof-of-concept uses [Wagmi](https://wagmi.sh/) to connect and save Web3 wallet addresses to [Supabase](https://supabase.com/) using a connected wallet's address within a [Next.js](https://nextjs.org/) application.

### Deploy on Vercel

Before deploying, read `Get Started` and ensure that you have created the necessary environment variables.

<a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsurgieboi%2Fnextjs-wagmi-supabase&env=NEXT_PUBLIC_ALCHEMY_API_KEY,NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY"><img src="https://vercel.com/button" alt="Deploy with Vercel"/></a>

# Getting Started

1. `git clone https://github.com/surgieboi/nextjs-wagmi-supabase.git`
2. `npm install`
3. Rename the `.env.example` file to `.env`
3. Create an account on [Alchemy](https://www.alchemy.com/); once logged-in, copy and paste your API Key within your `.env` file 
4. Create an account on Supabase; once logged-in, copy and paste your Anon Key and URL within your `.env` file 
5. `npm run dev`
6. Visit [http://localhost:3000](http://localhost:3000)

Additionally, you will need to complete the following Supabase configurations:

1. Create an organization
2. Create a project
3. Proceed to Table Editor
4. Create a table called, `member`
5. Add a column to the table titled `eth_address` and assign it a `text` type value
6. Update `eth_address` to be the Primary Key by checking the `Primary` checkbox
7. Delete the default `id` column
8. Save the table

Remember, in order to connect a Web3 wallet you will need a wallet extension added to your browser. This proof-of-concept is pre-configured with the following:

- [Coinbase Wallet](https://www.coinbase.com/wallet)
- [MetaMask](https://metamask.io/)
- [WalletConnect](https://walletconnect.com/)
- Injected: which will default to either Coinbase Wallet or MetaMask, and is used more specifically for wallets connected to Brave browsers.

# Connecting to Supabase

### supabaseClient.js

Within `/utils` we connect our application to Supabase using `supabaseClient.js`, which then allows us to import `supabase` throughout our components and pages using the following import statement, `import { supabase } from "../../utils/supabaseClient";`.

Note, in order for your application to connect to Supabase, ensure that you've properly updated your `.env` file with your accounts `Anon Key` and `API URL`.

### CreateMember Component

Within `/components` we use the `CreateMember` function and `async` calls to `insert` and `select` data from Supabase. Additionally, we use `useEffect` and `useState` to update our application and check whether or not a wallet address has already been connected and saved to our database.

# Dependencies

- Next.js
- Supabase
- [Tailwind](https://tailwindui.com/)
- Wagmi

# Contributing

This proof-of-concept uses as an MIT license and is free to use. Moreover, you can create issues and pull requests, as this repository will be maintained and updated as it supports various Web3 MVPs.

For additional information or if you have any questions, feel free to email me at [sergio.m.villasenor@gmail.com](mailto:sergio.m.villasenor@gmail.com) or connect with me on Twitter, [@surgieboi](https://twitter.com/surgieboi).

