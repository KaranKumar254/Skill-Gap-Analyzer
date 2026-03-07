import { useState } from "react";

export function useAnalyze() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const analyze = async (resumeText, jobDescription) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Server error");
      }

      const data = await res.json();
      return data;
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { analyze, loading, error, setError };
}