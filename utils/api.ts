const createURL = (path: string) => {
    return window.location.origin + path;
};

export const updateEntry = async (id: any, content: any) => {
    const res = await fetch(
        new Request(createURL(`/api/journal/${id}`), {
            method: "PATCH",
            body: JSON.stringify({ content }),
        })
    );

    if (res.ok) {
        const data = await res.json();
        return data.data;
    }
};

export const createNewEntry = async () => {
    try {
        const res = await fetch(
            new Request(createURL("/api/journal"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            })
        );

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Failed request:", res.status, errorText);
            throw new Error(
                `Request failed with status ${res.status}: ${errorText}`
            );
        }

        const data = await res.json();
        console.log("API Response:", data);

        if (data?.data?.id) {
            return data.data; // Contains { id: "entry_id" }
        } else {
            throw new Error("Response missing 'id' in data");
        }
    } catch (error) {
        console.error("Error in createNewEntry:", error);
        throw error;
    }
};

export const askQuestion = async (question: any) => {
    const res = await fetch(
        new Request(createURL("/api/question"), {
            method: "POST",
            body: JSON.stringify({ question }),
        })
    );

    if (res.ok) {
        const data = await res.json();
        return data.data;
    }
};
