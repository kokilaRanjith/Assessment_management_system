import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import authRoutes from './src/auth/authRoutes.js'
import { generateReportForSession } from './src/reports/generator.js'
import { dataBySessionId } from './src/data/data.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(bodyParser.json())

app.use('/api/auth', authRoutes)

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' })
})

// Serve generated PDFs statically
const outputDir = path.join(__dirname, 'src', 'reports', 'output')
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
}
app.use('/reports', express.static(outputDir))

// Generate report endpoint
app.all('/api/generate-report', async (req, res) => {
    try {
        const sessionId = (req.method === 'GET' ? req.query.session_id : req.body.session_id)
        if (!sessionId) {
            return res.status(400).json({ success: false, message: 'session_id is required' })
        }
        const data = dataBySessionId[sessionId]
        if (!data) {
            return res.status(404).json({ success: false, message: 'Session not found' })
        }
        const { filePath, publicPath } = await generateReportForSession(data, { outputDir })
        return res.json({ success: true, filePath, url: `/reports/${path.basename(filePath)}` })
    } catch (err) {
        console.error('Failed to generate report', err)
        return res.status(500).json({ success: false, message: 'Failed to generate report' })
    }
})

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`)
}) 