import path from 'path'
import fs from 'fs'
import { JSONPath } from 'jsonpath-plus'
import { fileURLToPath } from 'url'
import { assessmentsConfig, classifications, theme } from './config/assessments.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function resolveValue(json, jsonPath) {
    try {
        const result = JSONPath({ path: jsonPath, json })
        if (Array.isArray(result)) {
            if (result.length === 0) return undefined
            // Flatten single primitive from arrays like exercises[?].setList[0].time -> may return array
            return result[0]
        }
        return result
    } catch (_) {
        return undefined
    }
}

function classifyValue(type, value) {
    if (value == null) return undefined
    const rules = classifications[type]
    if (!rules) return undefined
    const num = Number(value)
    if (Number.isNaN(num)) return undefined
    for (const r of rules) {
        const minOk = r.min === undefined || num >= r.min
        const maxOk = r.max === undefined || num < r.max
        if (minOk && maxOk) return r.label
    }
    return undefined
}

function htmlEscape(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function renderHtml(config, data) {
    const styles = `
		* { box-sizing: border-box; }
		body { font-family: Arial, sans-serif; color: ${theme.brand.text}; margin: 24px; }
		h1 { color: ${theme.brand.primary}; margin-bottom: 8px; }
		h2 { margin-top: 24px; border-bottom: 2px solid ${theme.brand.primary}; padding-bottom: 4px; }
		.grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
		.card { border: 1px solid #e5e7eb; padding: 12px; border-radius: 8px; }
		.label { font-weight: bold; }
		.value { float: right; color: #111827; }
		.badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; background: #e5f6ff; color: ${theme.brand.primary}; font-size: 12px; margin-left: 8px; }
	`

    let html = ''
    html += `<html><head><meta charset="utf-8"/><style>${styles}</style></head><body>`
    html += `<h1>${htmlEscape(config.name)}</h1>`
    html += `<div style="margin-bottom:8px;color:#6b7280">Assessment ID: ${htmlEscape(data.assessment_id)} | Session: ${htmlEscape(data.session_id)}</div>`
    for (const section of config.sections) {
        html += `<h2>${htmlEscape(section.title)}</h2>`
        html += `<div class="grid">`
        for (const field of section.fields) {
            const raw = resolveValue(data, field.jsonPath)
            const val = raw == null ? '-' : raw
            const cls = field.classify ? classifyValue(field.classify, val) : undefined
            html += `<div class="card"><div class="label">${htmlEscape(field.label)}</div><div class="value">${htmlEscape(val)}${field.unit ? ' ' + htmlEscape(field.unit) : ''}${cls ? `<span class="badge">${htmlEscape(cls)}</span>` : ''}</div></div>`
        }
        html += `</div>`
    }
    html += `</body></html>`
    return html
}

export async function generateReportForSession(sessionData, { outputDir }) {
    const assessmentId = sessionData.assessment_id
    const config = assessmentsConfig[assessmentId]
    if (!config) throw new Error(`No config for assessment_id ${assessmentId}`)
    const html = renderHtml(config, sessionData)

    // Lazy-load puppeteer to avoid startup overhead when not needed
    const puppeteer = (await import('puppeteer')).default
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    try {
        const page = await browser.newPage()
        await page.setContent(html, { waitUntil: 'networkidle0' })
        const filename = `${sessionData.session_id}_${assessmentId}.pdf`
        const filePath = path.join(outputDir, filename)
        await page.pdf({ path: filePath, format: 'A4', printBackground: true })
        return { filePath, publicPath: filename }
    } finally {
        await browser.close()
    }
} 