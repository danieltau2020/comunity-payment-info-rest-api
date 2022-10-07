import sanitize from "mongo-sanitize"

export const cleanBody = (req, res, next) => {
  try {
    req.body = sanitize(req.body)
    req.query = sanitize(req.query)
    req.params = sanitize(req.params)
    next()
  } catch (error) {
    console.log("Sanitize-requests-error", error)
    return res.status(500).json({
      error: true,
      message: "Could not sanitize requests"
    })
  }
}
