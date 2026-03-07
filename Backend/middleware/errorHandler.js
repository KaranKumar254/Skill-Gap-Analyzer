const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.message);

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: messages.join(". ") });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error",
  });
};

export default errorHandler;