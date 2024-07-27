import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import * as jose from "jose";
import { CallToAction } from "@/components/callToAction/CallToAction";
// import CountdownTimer from "@/components/callToAction/CountDown";
const SECRET_KEY = process.env.SECRET_KEY || "secret";

import dynamic from "next/dynamic";
const CountdownTimer = dynamic(() => import("@/components/callToAction/CountDown"), { ssr: false });
export default async function Home() {
  const cookieStore = cookies();
  const user = cookieStore.get("auth_token");
  // console.log(user);
  let data = null;
  try {
    data = await jose.jwtVerify(user.value, new TextEncoder().encode(SECRET_KEY));
    console.log(data.payload);
  } catch (e) {
    console.error("error", e);
  }
  return (
    <main className='flex flex-col'>
      {!!user ? (
        <div className='flex flex-col items-center '>
          <h1 className='text-3xl px-2 text-justify'>Hello {data.payload.username}</h1>
          <h2>Your session status</h2>
          <CountdownTimer expirationTime={data.payload.expirationTime || 0} />
          <div className='p-3'>
            <CallToAction />
          </div>
        </div>
      ) : (
        <div>
          <h1 className='text-center text-5xl my-3'>Please Login to see all the action</h1>
        </div>
      )}
    </main>
  );
}
