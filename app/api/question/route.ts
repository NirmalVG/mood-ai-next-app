import { getUserByClerkID } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { qa } from "@/utils/ai";
import { NextResponse } from "next/server";

export const POST = async (request: any) => {
    const { question } = await request.json();
    const user = await getUserByClerkID();

    const entries = await prisma.journalEntry.findMany({
        where: {
            userId: user.id,
        },
        select: {
            id: true,
            content: true,
            createdAt: true,
        },
    });

    const contentEntries = entries.map(entry => entry.content);
    const answer = await qa(question, contentEntries);

    return NextResponse.json({ data: answer });
};
