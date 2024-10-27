"use client";
import { updateEntry } from "@/utils/api";
import { useState } from "react";
import { useAutosave } from "react-autosave";
import Spinner from "./Spinner";

const Editor = ({ entry }: any) => {
    const [value, setValue] = useState(entry.content);
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState(entry.analysis);

    const { mood, summary, color, negative, subject } = analysis || {};
    const AnalysisData = [
        {
            name: "Summary",
            value: summary,
        },
        {
            name: "Subject",
            value: subject,
        },
        {
            name: "Mood",
            value: mood,
        },
        {
            name: "Negative",
            value: negative ? "True" : "False",
        },
    ];

    useAutosave({
        data: value,
        onSave: async (_value) => {
            setIsLoading(true);
            const data = await updateEntry(entry.id, _value);
            setAnalysis(data.analysis);
            setIsLoading(false);
        },
    });
    return (
        <div className="w-full h-screen grid grid-cols-1 md:grid-cols-3 gap-0 relative min-h-screen">
            <div className="absolute left-0 top-0 p-2 flex items-center space-x-2 md:space-x-0">
                {isLoading ? (
                    <Spinner />
                ) : (
                    <div className="w-[16px] h-[16px] rounded-full bg-green-500"></div>
                )}
            </div>

            <div className="col-span-2">
                <textarea
                    className="w-full h-[300px] md:h-full text-xl p-4 md:p-8 resize-none"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>

            <div className="border-t md:border-t-0 md:border-l border-black/5">
                <div
                    className="h-[100px] bg-blue-600 text-white p-4 md:p-8"
                    style={{ backgroundColor: color }}
                >
                    <h2 className="text-xl md:text-2xl bg-white/25 text-black">
                        Analysis
                    </h2>
                </div>
                <div>
                    <ul role="list" className="divide-y divide-gray-200">
                        {AnalysisData.map((item) => (
                            <li
                                key={item.name}
                                className="py-2 md:py-4 px-4 md:px-8 flex items-center justify-between"
                            >
                                <div className="text-lg md:text-xl font-semibold">
                                    {item.name}
                                </div>
                                <div className="text-lg md:text-xl">
                                    {item.value}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Editor;
