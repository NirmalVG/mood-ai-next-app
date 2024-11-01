import { getUserByClerkID } from "@/utils/auth";
import { prisma } from "../../../utils/db";
import NewEntryCard from "@/components/NewEntryCard";
import EntryCard from "@/components/EntryCard";
import Link from "next/link";
import { analyze } from "@/utils/ai";
import Question from "@/components/Question";

const getEntries = async () => {
    const user = await getUserByClerkID();
    const entries = await prisma.journalEntry.findMany({
        where: {
            userId: user.id,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return entries;
};

const JournalPage = async () => {
    const entries = await getEntries();
    return (
        <div className="px-4 md:px-6 py-8 bg-zinc-100/50 h-full">
            <h1 className="text-2xl md:text-4xl mb-6 md:mb-12">Journal</h1>
            <div className="my-4 md:my-8">
                <Question />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <NewEntryCard />
                {entries.map((entry) => (
                    <Link href={`/journal/${entry.id}`} key={entry.id}>
                        <EntryCard entry={entry} />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default JournalPage;
