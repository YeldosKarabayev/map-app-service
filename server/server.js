
// require('dotenv').config({path: "./config.env"})
// const express = require('express');
// const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt');
// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');
// //const User = require('./models/User');

// const app = express();
// const PORT = process.env.PORT || 5000;
// const secretKey = process.env.SECRET_KEY || 'defaultSecretKey';


// app.use(bodyParser.json());
// app.use(cors())

// const connectDB = async() => {
//   await mongoose.connect('mongodb+srv://karabaeveldos77:Yeldos9006@cluster0.akm2dy2.mongodb.net/?retryWrites=true&w=majority');

//     console.log("MongoDB connected");
// }

// connectDB();

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   email: {
//     type: String,
//     required: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   role: {
//     type: String,
//     enum: ['user', 'admin'], // Определяем возможные роли
//   }
// });

// const User = mongoose.model('User', userSchema);

// let refreshTokens = [];


// app.post("/refresh", (req, res) => {
//   //take the refresh token from the user
//   const refreshToken = req.body.token;

//   //send error if there is no token or it's invalid
//   if (!refreshToken) return res.status(401).json("You are not authenticated!");
//   if (!refreshTokens.includes(refreshToken)) {
//     return res.status(403).json("Refresh token is not valid!");
//   }
//   jwt.verify(refreshToken, "myRefreshSecretKey", (err, user) => {
//     err && console.log(err);
//     refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

//     const newAccessToken = generateAccessToken(user);
//     const newRefreshToken = generateRefreshToken(user);

//     refreshTokens.push(newRefreshToken);

//     res.status(200).json({
//       accessToken: newAccessToken,
//       refreshToken: newRefreshToken,
//     });
//   });

//   //if everything is ok, create new access token, refresh token and send to user
// });


// const generateAccessToken = (user) => {
//   return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "mySecretKey", {
//     expiresIn: "5s",
//   });
// };

// const generateRefreshToken = (user) => {
//   return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "myRefreshSecretKey");
// };


// const createTokensAndSave = async (user) => {
//   const accessToken = generateAccessToken(user);
//   const refreshToken = generateRefreshToken(user);

//   // Сохраняем токены в базе данных
//   // Например, можно добавить их в массив соответствующего пользователя
//   user.tokens.push({ accessToken, refreshToken });
//   await user.save();

//   return { accessToken, refreshToken };
// };


// // Регистрация пользователя
// app.post('/register', async (req, res) => {
//   try {
//     const { name, email, password, role} = req.body;

//     if (!name || !email || !password || !role ) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       tokens: []
//     });

//     const tokens = await createTokensAndSave(newUser);

//     res.status(201).json({ newUser, tokens });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });




// // Авторизация пользователя
// app.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (!passwordMatch) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     // Создание JWT токена с информацией о пользователе, включая его роль
//     const token = jwt.sign({ userId: user.id, name: user.name, email: user.email, role: user.role }, secretKey, {
//       expiresIn: '1h', // Время жизни токена (можно изменить)
//     });



//     res.status(200).json({ message: 'Login successful', token, user });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }

// });


// const verify = (req, res, next) => {  

//   const authHeader = req.headers.authorization;
//   if(authHeader) {
//     const token = authHeader.split(" ")[1];

//     jwt.verify(token, secretKey, (err, user) => {
//       if(err) {
//         return res.status(403).json("Token is not valid!");
//       }

//       req.user = user;
//     })
//   } else {
//     res.status(401).json("Вы не авторизованы!");
//   }
// };


// app.post('/logout', (req, res) => {
//   // Удаление сессии или данных аутентификации, например, удаление сессии в Express с использованием express-session
//   req.session.destroy((err) => {
//     if (err) {
//       return res.status(500).json({ message: 'Error logging out' });
//     }
//     res.status(200).json({ message: 'Successfully logged out' });
//   });
// });


// app.post('/protected-route', verify, (req, res) => {
//   // Получаем информацию о пользователе из токена
//   const { userId, name, email, role } = req.user;

//   // Проверяем роль пользователя
//   if (role !== 'admin') {
//     return res.status(403).json({ message: 'У вас нет прав доступа к этому ресурсу' });
//   }

//   // Если пользователь админ, продолжаем выполнение
//   // Отправляем данные пользователя или выполняем нужные действия
//   res.json({ userId, name, email, role });
// });



// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });





require("dotenv").config()

const express = require('express')
const app = express()
const path = require('path')
//const { logger } = require('./client/middleware/logger')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500

//app.use(logger)

console.log(process.env.NODE_ENV)

connectDB()

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))

app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
      res.sendFile(path.join(__dirname,'client', 'views', '404.html'))
  } else if (req.accepts('json')) {
      res.json({ message: '404 Not Found' })
  } else {
      res.type('txt').send('404 Not Found')
  }
})

mongoose.connection.once('open', () => {
  console.log('База данных подключен!')
  app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`))
})

mongoose.connection.on('error', err => {
  console.log(err)
})










