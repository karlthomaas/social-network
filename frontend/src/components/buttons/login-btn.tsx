import { Button } from "../ui/button";
import Link from "next/link";

export const LoginButton = () => (
    <Link href='/login'>
      <Button size='sm'>Login</Button>
    </Link>
  );