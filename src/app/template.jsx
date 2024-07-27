import Nav from "@/components/navbar/Nav";
import Link from "next/link";
export default function Template({ children }) {
  return (
    <div>
      <header className='flex justify-between px-24 h-14 items-center shadow-md'>
        <Link href='/'>
          <h3 className='text-3xl'>
            Auction<span className='text-blue-500'>Pe</span>
          </h3>
        </Link>
        <Nav />
      </header>
      {children}
    </div>
  );
}
