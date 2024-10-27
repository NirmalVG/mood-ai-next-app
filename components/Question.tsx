"use client";
import { askQuestion } from "@/utils/api";
import { useState } from "react";

const Question = () => {
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setLoading(true);
        const answer = await askQuestion(value);
        setResponse(answer);
        setValue("");
        setLoading(false);
    };

    return (
        <div className="w-full max-w-md mx-auto p-4">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col md:flex-row gap-2"
            >
                <input
                    disabled={loading}
                    className="flex-1 border border-gray-300 rounded-md p-2 text-base md:text-lg"
                    value={value}
                    onChange={onChange}
                    type="text"
                    placeholder="Ask a question"
                />
                <button
                    disabled={loading}
                    type="submit"
                    className="bg-blue-400 text-white px-4 py-2 rounded-md text-base md:text-lg"
                >
                    Ask
                </button>
            </form>

            {loading && (
                <div className="mt-2 text-center text-gray-500">Loading...</div>
            )}
            {response && (
                <div className="my-4 text-lg md:text-xl text-gray-700">
                    {response}
                </div>
            )}
        </div>
    );
};

export default Question;
