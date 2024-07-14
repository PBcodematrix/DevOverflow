import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { IUser } from "@/database/user.model";

interface Props {
  user: {
    _id: IUser["_id"];
    clerkId: IUser["clerkId"];
    picture: IUser["picture"];
    name: IUser["name"];
    username: IUser["username"];
  };
}

const UserCard = async ({ user }: Props) => {

  return (
    <Link
      href={`/profile/${user.clerkId}`}
      className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"
    >
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <Image
          src={user.picture}
          alt="user profile picture"
          width={100}
          height={100}
          className="rounded-full"
        />

        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">
            {user.name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">
            @{user.username}
          </p>
        </div>

        <div className="mt-5">
            <Badge className="small-regular background-light800_dark300 text-dark200_light900 rounded-md border-none px-4 py-2">
              No tags yet
            </Badge>
        </div>
      </article>
    </Link>
  );
};

export default UserCard;
