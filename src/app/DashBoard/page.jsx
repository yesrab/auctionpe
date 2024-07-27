import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cookies } from "next/headers";
import * as jose from "jose";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY || "secret";
let history = [
  {
    userID: "1",
    username: "dummy",
    counter: "250",
    toggle: true,
    id: 1,
    expirationTime: "2024-07-27T16:29:26.000Z",
  },
  {
    userID: "2",
    username: "dummy",
    counter: "250",
    toggle: false,
    id: 3,
    expirationTime: "2024-07-27T16:29:26.000Z",
  },
];

export default async function page(req) {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token");
  let data = null;
  let userSessions = [];

  function formatDateTime(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // Convert to 12-hour format and handle midnight (0 -> 12)
    const formattedHours = String(hours).padStart(2, "0");

    return `${day}/${month}/${year} - ${formattedHours}:${minutes}:${seconds} ${ampm}`;
  }

  try {
    data = await jose.jwtVerify(token?.value, new TextEncoder().encode(SECRET_KEY));
    // console.log(data);
    const userId = data.payload.userId;
    userSessions = await prisma.sessionHistory.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
      },
    });

    history = userSessions.map((session) => ({
      userID: session.userId,
      username: session.user.username,
      counter: session.counter,
      toggle: session.toggle,
      id: session.id,
      expirationTime: formatDateTime(session.expirationTime.toISOString()),
    }));
    history.sort((a, b) => {
      return b.id - a.id;
    });
  } catch (e) {
    console.log("token not found");
  }

  return (
    <main className='md:p-24'>
      <Table>
        <TableCaption>A list of your recent Sessions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>User ID</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>Counter</TableHead>
            <TableHead>Toggel</TableHead>
            <TableHead className='font-medium'>Session ID</TableHead>
            <TableHead className='font-medium text-end'>Session expired</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((session) => (
            <TableRow key={session.userID}>
              <TableCell className='font-medium'>{session.userID}</TableCell>
              <TableCell>{session.username}</TableCell>
              <TableCell>{session.counter}</TableCell>
              <TableCell>
                {session.toggle ? (
                  <Badge>{session.toggle.toString()}</Badge>
                ) : (
                  <Badge variant='destructive'>{session.toggle.toString()}</Badge>
                )}
              </TableCell>
              <TableCell>{session.id}</TableCell>
              <TableCell className='text-end'>{session.expirationTime}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>Total Sessions</TableCell>
            <TableCell className='text-right'>{history.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </main>
  );
}
