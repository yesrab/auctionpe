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

  let data = null;
  try {
    data = await jose.jwtVerify(user?.value, new TextEncoder().encode(SECRET_KEY));
  } catch (e) {
    console.log("token not found");
  }
  return (
    <main className='flex flex-col'>
      <div className='flex flex-col items-center '>
        {!!user ? (
          <h1 className='text-3xl px-2 text-justify'>Hello {data.payload.username}</h1>
        ) : (
          <h1 className='text-3xl px-2 text-justify my-3'>
            Login to see all the actions you can perform
          </h1>
        )}
        {!!user ? (
          <>
            <h2 className='text-3xl px-2 text-justify'>Your session status</h2>
            <span>
              Session ID :
              <p className='font-medium'>{data?.payload?.sessionId || "check dasboard"}</p>
            </span>
            <CountdownTimer expirationTime={data?.payload?.expirationTime || 0} />
          </>
        ) : null}
        <div className='p-3'>
          <CallToAction />
        </div>
      </div>
    </main>
  );
}
