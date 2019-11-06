import { File } from '../../database/index'

const store = async (req, res) => {
  const { originalname: name, filename: path } = req.file

  const file = await File.create({
    name,
    path
  })

  return res.json(file)
}

export default {
  store
}
