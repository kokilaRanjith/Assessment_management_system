import { useState, useEffect } from "react"
import { login, signup, setAuthToken, generateReport } from "./api"

// Advanced UI Components
function LoadingSpinner({ size = "md", color = "blue" }) {
const sizes = {
sm: "w-4 h-4",
md: "w-8 h-8", 
lg: "w-12 h-12"
}
const colors = {
blue: "border-blue-600",
green: "border-green-600",
red: "border-red-600"
}
return (
<div className={`${sizes[size]} ${colors[color]} border-4 border-t-transparent rounded-full animate-spin`}></div>
)
}

function ProgressBar({ progress, label, color = "blue" }) {
const colors = {
blue: "bg-blue-600",
green: "bg-green-600",
red: "bg-red-600"
}
return (
<div className="w-full">
<div className="flex justify-between text-sm text-gray-600 mb-1">
<span>{label}</span>
<span>{progress}%</span>
</div>
<div className="w-full bg-gray-200 rounded-full h-2">
<div 
className={`h-2 rounded-full transition-all duration-500 ${colors[color]}`}
style={{ width: `${progress}%` }}
></div>
</div>
</div>
)
}

function StatCard({ title, value, change, trend, icon, color = "blue" }) {
const colors = {
blue: "from-blue-500 to-blue-600",
green: "from-green-500 to-green-600",
red: "from-red-500 to-red-600",
purple: "from-purple-500 to-purple-600"
}
return (
<div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
<div className="flex items-center justify-between mb-4">
<div className={`p-3 rounded-lg bg-gradient-to-r ${colors[color]} text-white`}>
<span className="text-2xl">{icon}</span>
</div>
{trend && (
<div className={`flex items-center text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
<span className="mr-1">{trend > 0 ? '' : ''}</span>
{Math.abs(trend)}%
</div>
)}
</div>
<h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
<p className="text-gray-600 text-sm">{title}</p>
{change && (
<p className="text-xs text-gray-500 mt-2">{change}</p>
)}
</div>
)
}

function Notification({ type, title, message, onClose, duration = 5000 }) {
const [isVisible, setIsVisible] = useState(true)

useEffect(() => {
if (duration > 0) {
const timer = setTimeout(() => setIsVisible(false), duration)
return () => clearTimeout(timer)
}
}, [duration])

if (!isVisible) return null

const styles = {
success: "bg-green-50 border-green-200 text-green-800",
error: "bg-red-50 border-red-200 text-red-800",
info: "bg-blue-50 border-blue-200 text-blue-800",
warning: "bg-yellow-50 border-yellow-200 text-yellow-800"
}

const icons = {
success: "",
error: "", 
info: "ℹ",
warning: ""
}

return (
<div className={`fixed top-4 right-4 z-50 max-w-sm w-full border rounded-lg p-4 shadow-lg transform transition-all duration-300 ${styles[type]} ${
isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
}`}>
<div className="flex items-start">
<span className="text-xl mr-3">{icons[type]}</span>
<div className="flex-1">
<h4 className="font-semibold">{title}</h4>
<p className="text-sm mt-1">{message}</p>
</div>
<button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600">

</button>
</div>
</div>
)
}

function Input({ label, type = "text", value, onChange, placeholder, icon, required = false, error = null }) {
return (
<div className="space-y-2">
<label className="block text-sm font-medium text-gray-700">
{label} {required && <span className="text-red-500">*</span>}
</label>
<div className="relative">
{icon && (
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<span className="text-gray-400">{icon}</span>
</div>
)}
<input
type={type}
value={value}
onChange={e => onChange(e.target.value)}
placeholder={placeholder}
required={required}
className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
icon ? "pl-10" : ""
} ${error ? "border-red-300 bg-red-50" : "border-gray-300"} ${
value ? "bg-white" : "bg-gray-50"
} hover:border-gray-400`}
/>
</div>
{error && <p className="text-red-500 text-sm">{error}</p>}
</div>
)
}

function Button({ children, onClick, variant = "primary", loading = false, disabled = false, className = "", size = "md" }) {
const baseClasses = "rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
const sizes = {
sm: "px-4 py-2 text-sm",
md: "px-6 py-3",
lg: "px-8 py-4 text-lg"
}
const variants = {
primary: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl",
secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300",
danger: "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl",
success: "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
}

return (
<button
onClick={onClick}
disabled={disabled || loading}
className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
disabled || loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"
}`}
>
{loading ? (
<div className="flex items-center justify-center">
<LoadingSpinner size="sm" />
<span className="ml-2">Processing...</span>
</div>
) : (
children
)}
</button>
)
}

function Card({ children, className = "", hover = true }) {
return (
<div className={`bg-white rounded-xl shadow-lg border border-gray-100 p-6 ${className} ${
hover ? "hover:shadow-xl transition-all duration-300" : ""
}`}>
{children}
</div>
)
}

function Alert({ type, children, onClose }) {
const styles = {
success: "bg-green-50 border-green-200 text-green-800",
error: "bg-red-50 border-red-200 text-red-800",
info: "bg-blue-50 border-blue-200 text-blue-800",
warning: "bg-yellow-50 border-yellow-200 text-yellow-800"
}

return (
<div className={`border rounded-lg p-4 mb-6 ${styles[type]} flex items-center justify-between`}>
<div className="flex items-center">
<span className="text-lg mr-2">
{type === "success" && ""}
{type === "error" && ""}
{type === "info" && "ℹ"}
{type === "warning" && ""}
</span>
{children}
</div>
{onClose && (
<button onClick={onClose} className="text-gray-400 hover:text-gray-600">

</button>
)}
</div>
)
}

function SessionSelector({ sessionId, onChange }) {
const sessions = [
{ 
id: "session_001", 
name: "Health & Fitness Assessment", 
type: "as_hr_02",
description: "Comprehensive health and fitness evaluation",
icon: "",
color: "blue"
},
{ 
id: "session_002", 
name: "Cardiac Assessment", 
type: "as_card_01",
description: "Specialized cardiac health analysis",
icon: "",
color: "red"
}
]

return (
<div className="space-y-4">
<label className="block text-sm font-medium text-gray-700">Select Assessment Session</label>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
{sessions.map(session => (
<div
key={session.id}
onClick={() => onChange(session.id)}
className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
sessionId === session.id
? "border-blue-500 bg-blue-50"
: "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
}`}
>
<div className="flex items-center">
<span className="text-2xl mr-3">{session.icon}</span>
<div>
<h3 className="font-semibold text-gray-900">{session.name}</h3>
<p className="text-sm text-gray-600">{session.description}</p>
<p className="text-xs text-gray-500 mt-1">ID: {session.id}</p>
</div>
</div>
</div>
))}
</div>
</div>
)
}

function Dashboard({ user, onLogout, onNavigateToGenerate }) {
const [stats, setStats] = useState({
totalReports: 0,
recentReports: 0,
successRate: 100,
avgGenerationTime: 2.3
})

const [recentReports, setRecentReports] = useState([])

useEffect(() => {
// Simulate loading stats
setTimeout(() => {
setStats({
totalReports: 47,
recentReports: 12,
successRate: 98.5,
avgGenerationTime: 1.8
})
}, 1000)
}, [])

return (
<div className="space-y-8">
{/* Welcome Section */}
<div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
<div className="flex items-center justify-between">
<div>
<h1 className="text-3xl font-bold mb-2">Welcome back, {user.firstName}! </h1>
<p className="text-blue-100">Ready to generate some amazing assessment reports?</p>
</div>
<div className="text-right">
<p className="text-sm text-blue-200">Last login</p>
<p className="font-semibold">{new Date().toLocaleDateString()}</p>
</div>
</div>
</div>

{/* Stats Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
<StatCard
title="Total Reports"
value={stats.totalReports}
change="+12 this week"
trend={15}
icon=""
color="blue"
/>
<StatCard
title="Recent Reports"
value={stats.recentReports}
change="Last 7 days"
icon=""
color="green"
/>
<StatCard
title="Success Rate"
value={`${stats.successRate}%`}
change="Excellent performance"
trend={2}
icon=""
color="green"
/>
<StatCard
title="Avg. Generation"
value={`${stats.avgGenerationTime}s`}
change="Lightning fast!"
trend={-12}
icon=""
color="purple"
/>
</div>

{/* Quick Actions */}
<Card>
<h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
<button 
onClick={onNavigateToGenerate}
className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
>
<div className="text-center">
<span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">📊</span>
<h3 className="font-semibold text-gray-900">Generate Report</h3>
<p className="text-sm text-gray-600">Create new assessment report</p>
</div>
</button>
<button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200 group">
<div className="text-center">
<span className="text-3xl mb-2 block group-hover:scale-110 transition-transform"></span>
<h3 className="font-semibold text-gray-900">View Analytics</h3>
<p className="text-sm text-gray-600">Check report statistics</p>
</div>
</button>
<button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 group">
<div className="text-center">
<span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">⚙️</span>
<h3 className="font-semibold text-gray-900">Settings</h3>
<p className="text-sm text-gray-600">Configure preferences</p>
</div>
</button>
</div>
</Card>
</div>
)
}

export default function App() {
const [view, setView] = useState("login")
const [currentStep, setCurrentStep] = useState("auth")

// Login state
const [loginEmail, setLoginEmail] = useState("")
const [loginPassword, setLoginPassword] = useState("")

// Signup state
const [signupData, setSignupData] = useState({
email: "",
password: "",
confirmPassword: "",
firstName: "",
lastName: "",
phone: "",
organization: "",
role: "user"
})

const [token, setToken] = useState(localStorage.getItem("token") || "")
const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"))
const [sessionId, setSessionId] = useState("session_001")
const [reportUrl, setReportUrl] = useState("")
const [msg, setMsg] = useState("")
const [msgType, setMsgType] = useState("info")
const [loading, setLoading] = useState(false)
const [notifications, setNotifications] = useState([])
const [generationProgress, setGenerationProgress] = useState(0)

useEffect(() => {
if (token) {
setAuthToken(token)
}
}, [token])

function addNotification(type, title, message) {
const id = Date.now()
setNotifications(prev => [...prev, { id, type, title, message }])
}

function removeNotification(id) {
setNotifications(prev => prev.filter(n => n.id !== id))
}

function onLogout() {
setToken("")
setUser(null)
localStorage.removeItem("token")
localStorage.removeItem("user")
setAuthToken("")
setView("login")
setMsg("")
setReportUrl("")
setCurrentStep("auth")
setSignupData({
email: "",
password: "",
confirmPassword: "",
firstName: "",
lastName: "",
phone: "",
organization: "",
role: "user"
})
addNotification("info", "Logged Out", "You have been successfully logged out.")
}

function navigateToGenerate() {
setCurrentStep("generate")
setMsg("")
setReportUrl("")
}

function updateSignupData(field, value) {
setSignupData(prev => ({ ...prev, [field]: value }))
}

async function doSignup() {
setMsg("")
setLoading(true)
try {
if (signupData.password !== signupData.confirmPassword) {
setMsg("Passwords do not match")
setMsgType("error")
return
}

const { confirmPassword, ...userData } = signupData
await signup(userData)
setMsg("Account created successfully! Please login.")
setMsgType("success")
setView("login")
setSignupData({
email: "",
password: "",
confirmPassword: "",
firstName: "",
lastName: "",
phone: "",
organization: "",
role: "user"
})
addNotification("success", "Account Created", "Your account has been created successfully!")
} catch (e) {
setMsg(e?.response?.data?.message || "Signup failed")
setMsgType("error")
addNotification("error", "Signup Failed", e?.response?.data?.message || "Please try again.")
} finally {
setLoading(false)
}
}

async function doLogin() {
setMsg("")
setLoading(true)
try {
const data = await login(loginEmail, loginPassword)
setToken(data.token)
setUser(data.user)
localStorage.setItem("token", data.token)
localStorage.setItem("user", JSON.stringify(data.user))
setAuthToken(data.token)
setView("dashboard")
setCurrentStep("dashboard")
setMsg("")
setMsgType("success")
addNotification("success", "Welcome Back!", `Welcome back, ${data.user.firstName}!`)
} catch (e) {
setMsg(e?.response?.data?.message || "Login failed")
setMsgType("error")
addNotification("error", "Login Failed", "Invalid credentials. Please try again.")
} finally {
setLoading(false)
}
}

async function doGenerate() {
setMsg("")
setReportUrl("")
setLoading(true)
setGenerationProgress(0)

// Simulate progress
const progressInterval = setInterval(() => {
setGenerationProgress(prev => {
if (prev >= 90) {
clearInterval(progressInterval)
return 90
}
return prev + 10
})
}, 200)

try {
const res = await generateReport(sessionId)
clearInterval(progressInterval)
setGenerationProgress(100)

if (res.success) {
setReportUrl(`http://localhost:4000${res.url}`)
setMsg("Report generated successfully! Click the link below to view.")
setMsgType("success")
addNotification("success", "Report Generated", "Your PDF report is ready for download!")
} else {
setMsg("Failed to generate report")
setMsgType("error")
addNotification("error", "Generation Failed", "Unable to generate report. Please try again.")
}
} catch (e) {
clearInterval(progressInterval)
setMsg(e?.response?.data?.message || "Failed to generate report")
setMsgType("error")
addNotification("error", "Generation Failed", e?.response?.data?.message || "Please try again.")
} finally {
setLoading(false)
setTimeout(() => setGenerationProgress(0), 1000)
}
}

const roleOptions = [
{ value: "user", label: "User" },
{ value: "manager", label: "Manager" },
{ value: "admin", label: "Administrator" }
]

return (
<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
{/* Notifications */}
{notifications.map(notification => (
<Notification
key={notification.id}
type={notification.type}
title={notification.title}
message={notification.message}
onClose={() => removeNotification(notification.id)}
/>
))}

{/* Header */}
<header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="flex justify-between items-center h-16">
<div className="flex items-center">
<div className="flex-shrink-0">
<h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
Assessment Management Pro
</h1>
</div>
</div>
{token && user && (
<div className="flex items-center space-x-4">
<div className="text-right">
<p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
<p className="text-xs text-gray-500">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
</div>
<Button variant="secondary" onClick={onLogout} size="sm">
Logout
</Button>
</div>
)}
</div>
</div>
</header>

{/* Main Content */}
<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
{msg && (
<Alert type={msgType} onClose={() => setMsg("")}>
{msg}
</Alert>
)}

{!token ? (
<div className="max-w-md mx-auto">
<Card>
<div className="text-center mb-8">
<h2 className="text-3xl font-bold text-gray-900 mb-2">
{view === "login" ? "Welcome Back" : "Create Account"}
</h2>
<p className="text-gray-600">
{view === "login" 
? "Sign in to generate assessment reports" 
: "Join us to access the assessment system"
}
</p>
</div>

<div className="flex mb-8 bg-gray-100 rounded-lg p-1">
<button
onClick={() => setView("login")}
className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
view === "login"
? "bg-white text-blue-600 shadow-sm"
: "text-gray-600 hover:text-gray-900"
}`}
>
Login
</button>
<button
onClick={() => setView("signup")}
className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
view === "signup"
? "bg-white text-blue-600 shadow-sm"
: "text-gray-600 hover:text-gray-900"
}`}
>
Sign Up
</button>
</div>

{view === "login" ? (
<div className="space-y-6">
<Input
label="Email Address"
type="email"
value={loginEmail}
onChange={setLoginEmail}
placeholder="Enter your email"
icon="📧"
required
/>
<Input
label="Password"
type="password"
value={loginPassword}
onChange={setLoginPassword}
placeholder="Enter your password"
icon=""
required
/>
<Button
onClick={doLogin}
loading={loading}
className="w-full"
>
Sign In
</Button>
</div>
) : (
<div className="space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<Input
label="First Name"
value={signupData.firstName}
onChange={(value) => updateSignupData("firstName", value)}
placeholder="Enter your first name"
icon=""
required
/>
<Input
label="Last Name"
value={signupData.lastName}
onChange={(value) => updateSignupData("lastName", value)}
placeholder="Enter your last name"
icon=""
required
/>
</div>

<Input
label="Email Address"
type="email"
value={signupData.email}
onChange={(value) => updateSignupData("email", value)}
placeholder="Enter your email"
icon="📧"
required
/>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<Input
label="Password"
type="password"
value={signupData.password}
onChange={(value) => updateSignupData("password", value)}
placeholder="Create a password"
icon=""
required
/>
<Input
label="Confirm Password"
type="password"
value={signupData.confirmPassword}
onChange={(value) => updateSignupData("confirmPassword", value)}
placeholder="Confirm your password"
icon=""
required
/>
</div>

<Input
label="Phone Number"
type="tel"
value={signupData.phone}
onChange={(value) => updateSignupData("phone", value)}
placeholder="Enter your phone number (optional)"
icon=""
/>

<Input
label="Organization"
value={signupData.organization}
onChange={(value) => updateSignupData("organization", value)}
placeholder="Enter your organization (optional)"
icon=""
/>

<div className="space-y-2">
<label className="block text-sm font-medium text-gray-700">
Role <span className="text-red-500">*</span>
</label>
<select
value={signupData.role}
onChange={e => updateSignupData("role", e.target.value)}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
>
{roleOptions.map(option => (
<option key={option.value} value={option.value}>
{option.label}
</option>
))}
</select>
</div>

<Button
onClick={doSignup}
loading={loading}
className="w-full"
>
Create Account
</Button>
</div>
)}
</Card>
</div>
) : currentStep === "dashboard" ? (
<Dashboard user={user} onLogout={onLogout} onNavigateToGenerate={navigateToGenerate} />
) : (
<div className="max-w-4xl mx-auto">
<Card>
<div className="flex items-center justify-between mb-8">
<Button 
variant="secondary" 
onClick={() => setCurrentStep("dashboard")}
className="flex items-center"
>
<span className="mr-2">←</span>
Back to Dashboard
</Button>
<div className="text-center flex-1">
<h2 className="text-3xl font-bold text-gray-900 mb-2">Generate Report</h2>
<p className="text-gray-600">
Select an assessment session to generate a detailed PDF report
</p>
</div>
<div className="w-32"></div> {/* Spacer for centering */}
</div>

<div className="space-y-8">
<SessionSelector sessionId={sessionId} onChange={setSessionId} />

{generationProgress > 0 && (
<ProgressBar 
progress={generationProgress} 
label="Generating PDF Report" 
color="blue" 
/>
)}

<Button
onClick={doGenerate}
loading={loading}
className="w-full"
size="lg"
>
 Generate PDF Report
</Button>

{reportUrl && (
<div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
<div className="flex items-center justify-between">
<div className="flex items-center">
<span className="text-green-600 text-2xl mr-3"></span>
<div>
<h3 className="text-green-800 font-semibold text-lg">Report Ready!</h3>
<p className="text-green-700 text-sm">Your assessment report has been generated successfully</p>
</div>
</div>
<a
href={reportUrl}
target="_blank"
rel="noreferrer"
className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 hover:scale-105"
>
Download PDF
<svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
</svg>
</a>
</div>
</div>
)}
</div>
</Card>

{/* Features Section */}
<div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
<Card hover>
<div className="text-center">
<div className="text-4xl mb-4">⚡</div>
<h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
<p className="text-sm text-gray-600">Generate professional PDF reports in seconds with our optimized engine</p>
</div>
</Card>
<Card hover>
<div className="text-center">
<div className="text-4xl mb-4"></div>
<h3 className="font-semibold text-gray-900 mb-2">Precision Data</h3>
<p className="text-sm text-gray-600">Based on real assessment data with configurable mappings and validation</p>
</div>
</Card>
<Card hover>
<div className="text-center">
<div className="text-4xl mb-4"></div>
<h3 className="font-semibold text-gray-900 mb-2">Zero-Code Config</h3>
<p className="text-sm text-gray-600">Add new assessment types and modify reports without touching code</p>
</div>
</Card>
</div>
</div>
)}
</main>

{/* Footer */}
<footer className="bg-white border-t border-gray-100 mt-16">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
<div className="text-center text-gray-600">
<p>&copy; 2024 Assessment Management Pro. Built with React & Node.js</p>
<p className="text-sm mt-2">Enterprise-grade assessment reporting solution</p>
</div>
</div>
</footer>
</div>
)
}
