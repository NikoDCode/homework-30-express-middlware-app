const getUsersHandler = (req, res) => {
  res.end('Response from Express users handler')
}

const postUsersHandler = (req, res) => {
  res.end('Response from Express post users handler')
}

const getUserByIdHandler = (req, res) => {
  res.end(`Response from Express get user by ID handler: ${req.params.userId}`)
}

const putUserByIdHandler = (req, res) => {
  res.end(`Response from Express put user by ID handler: ${req.params.userId}`)
}

const deleteUserByIdHandler = (req, res) => {
  res.end(`Response from Express delete user by ID handler: ${req.params.userId}`)
}

export {
  getUsersHandler,
  postUsersHandler,
  getUserByIdHandler,
  putUserByIdHandler,
  deleteUserByIdHandler
}