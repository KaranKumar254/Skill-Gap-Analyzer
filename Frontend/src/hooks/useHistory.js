import { useState, useEffect } from "react";

export function useHistory() {
  const [history, setHistory]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/history");
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      setError("Could not load history.");
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id) => {
    try {
      await fetch(`/api/history/${id}`, { method: "DELETE" });
      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch {
      setError("Could not delete entry.");
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  return { history, loading, error, refetch: fetchHistory, deleteEntry };
}