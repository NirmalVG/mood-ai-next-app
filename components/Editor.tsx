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
        <div className="w-full h-full grid grid-cols-3 gap-0 relative">
            <div className="absolute left-0 top-0 p-2">
                {isLoading ? (
                    <Spinner />
                ) : (
                    <div className="w-[16px] h-[16px] rounded-full bg-green-500"></div>
                )}
                <div className="col-span-2">
                    <textarea
                        className="w-full h-full text-xl p-8"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </div>
            </div>

            <div className="border-l border-black/5">
                <div className="h-[100px] bg-blue-600 text-white p-8" style={{ backgroundColor: color }}>
                    <h2 className="text-2xl bg-white/25 text-black">Analysis</h2>
                </div>
                <div>
                    <ul role="list" className="divide-y divide-gray-200">
                        {AnalysisData.map((item) => {
                            return (
                                <li
                                    key={item.name}
                                     className="py-4 px-8 flex items-center justify-between"
                                >
                                    <div className="text-xl font-semibold">
                                        {item.name}
                                    </div>
                                    <div className="text-xl">{item.value}</div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Editor;
