const getRootHandler = (req, res) => {
  res.end('Response from Express root handler')
}

export { getRootHandler }