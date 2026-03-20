import { useEffect, useState } from "react";
import getAuth from "../../../lib/get-auth";
import { usePathname } from "next/navigation";
import { User } from "better-auth/types";

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isFetched, setIsFetched] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getAuth();
      setUser(user);
      setIsFetched(true);
    };

    fetchUser();
  }, [pathname]);

  return { user, isFetched };
};

export default useAuth;
