import HistoryChart from "@/components/HitoryChart";
import { getUserByClerkID } from "@/utils/auth";
import { prisma } from "@/utils/db";

const getData = async () => {
    const user = await getUserByClerkID();

    const analysis = await prisma.analysis.findMany({
        where: {
            userId: user.id,
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    const sum = analysis.reduce((all, curr) => all + curr.sentimentScore, 0);
    const avg = Math.round(sum / analysis.length);

    return { analysis, avg };
};

const History = async () => {
    const { avg, analysis } = await getData();
    return (
        <div className="h-full px-6 py-8">
            <h1 className="text-2xl mb-4">Avg. Sentiment {avg}</h1>
            <div className="w-full h-full">
                <HistoryChart
                    data={analysis.map((item) => ({
                        ...item,
                        updatedAt: item.updatedAt.toISOString(),
                    }))}
                />
            </div>
        </div>
    );
};

export default History;
