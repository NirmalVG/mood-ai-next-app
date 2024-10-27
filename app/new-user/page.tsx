import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "../../utils/db";
import { redirect } from "next/navigation";

const createNewUser = async () => {
  const user = await currentUser();
  if (!user) {
      throw new Error("User not found");
  }

  // Check if a user with the same clerkId or email already exists
  const match = await prisma.user.findFirst({
      where: {
          OR: [
              { clerkId: user.id as string },
              { email: user.emailAddresses[0].emailAddress },
          ],
      },
  });

  // If no matching user is found, create a new one
  if (!match) {
      await prisma.user.create({
          data: {
              clerkId: user.id,
              email: user.emailAddresses[0].emailAddress,
          },
      });
  }

  redirect("/journal");
};

const NewUser = async () => {
    await createNewUser();
    return <div>loading...</div>;
};

export default NewUser;
