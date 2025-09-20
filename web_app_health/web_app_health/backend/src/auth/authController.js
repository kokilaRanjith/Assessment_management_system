import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Joi from 'joi'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataDir = path.join(__dirname, '..', '..', 'data')
const usersFile = path.join(dataDir, 'users.json')
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me'

function readUsers() {
if (!fs.existsSync(usersFile)) {
fs.mkdirSync(dataDir, { recursive: true })
fs.writeFileSync(usersFile, JSON.stringify([] , null, 2))
}
return JSON.parse(fs.readFileSync(usersFile, 'utf-8'))
}

function writeUsers(users) {
fs.writeFileSync(usersFile, JSON.stringify(users, null, 2))
}

const signupSchema = Joi.object({
email: Joi.string().email().required(),
password: Joi.string().min(6).required(),
firstName: Joi.string().min(2).max(50).required(),
lastName: Joi.string().min(2).max(50).required(),
phone: Joi.string().pattern(/^[+]?[\d\s\-\(\)]+$/).optional(),
organization: Joi.string().max(100).optional(),
role: Joi.string().valid('admin', 'user', 'manager').default('user')
})

export async function signup(req, res) {
try {
const { error, value } = signupSchema.validate(req.body)
if (error) return res.status(400).json({ success: false, message: error.message })
const { email, password, firstName, lastName, phone, organization, role } = value
const users = readUsers()
if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
return res.status(409).json({ success: false, message: 'Email already registered' })
}
const hashed = await bcrypt.hash(password, 10)
const user = { 
id: Date.now().toString(), 
email, 
password: hashed,
firstName,
lastName,
phone: phone || '',
organization: organization || '',
role,
createdAt: new Date().toISOString()
}
users.push(user)
writeUsers(users)
return res.json({ success: true })
} catch (err) {
console.error('Signup error', err)
return res.status(500).json({ success: false, message: 'Signup failed' })
}
}

const loginSchema = Joi.object({
email: Joi.string().email().required(),
password: Joi.string().required()
})

export async function login(req, res) {
try {
const { error, value } = loginSchema.validate(req.body)
if (error) return res.status(400).json({ success: false, message: error.message })
const { email, password } = value
const users = readUsers()
const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' })
const ok = await bcrypt.compare(password, user.password)
if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' })
const token = jwt.sign({ sub: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
return res.json({ success: true, token, user: { firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role } })
} catch (err) {
console.error('Login error', err)
return res.status(500).json({ success: false, message: 'Login failed' })
}
}
