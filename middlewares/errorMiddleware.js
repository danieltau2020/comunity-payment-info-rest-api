export const notFound = (req, res, next) => {
  const error = new Error("Resource not found")
  next(error)
}

export const errorHandler = async (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode

  res.status(statusCode).json({
    message: req.message ? req.message : err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  })
}
