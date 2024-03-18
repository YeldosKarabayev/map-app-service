const User = require("../models/User")

const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

const getAllUsers = asyncHandler(async (req, res) => {

    const users = await User.find().select('-password').lean()

    if (!users?.length) {
        return res.status(400).json({ message: 'Нет доступных пользователей' })
    }

    res.json(users)
})


const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body

    // Подтверждение данных

    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'Все поля объязательны для заполнения!' })
    }

    // Проверка на наличие дубликатов
    const duplicate = await User.findOne({ username }).lean().exec()

    if(duplicate) {
        return res.status(409).json({ message: 'Пользователь уже существует!'}) 
    }

    // Хеширование пароля
    const hashPwd = await bcrypt.hash(password, 10)

    const userObject = { username, "password": hashPwd, roles }

    // Создать и сохранить нового пользователя
    const user = await User.create(userObject)

    if (user) { // создан
        res.send(201).json({ message: `Новый пользователь ${username} создан!`})
    } else {
        res.status(400).json({ message: 'Недопустимые данные для пользователя!'})
    }
})


const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body
    // Подверждение данных
    if (!id || !username || !Array.isArray(roles) || !roles.length ||
    typeof active !== 'boolean' ) {
        return res.status(400).json({ message: 'Все поля объязательны для заполнения' })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден!' })
    }

    // Наличие на дубликатов
    const duplicate = await User.findOne({ username }).lean().exec()
    // Разраешить обнавления начальных данных пользователья
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(400).json({ message: 'Имя пользователья дублируется' })
    }

    user.username = username
    user.roles = roles
    user.active = active

    if (password) {
        // Хешировние пароля
        user.password = await bcrypt.hash(password, 10)
    }

    const updateUser = await user.save()

    res.json({ message: `${updateUser.username} обнавлен!`})
})


const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'ID пользователья не найден!'})
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден!'})
    }
     
    const result = await user.deleteOne()

    const reply = `Пользователь ${result.username} с ID ${result._id} удален!`

    res.json(reply)
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}