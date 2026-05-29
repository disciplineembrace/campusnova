import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_FILES = 6
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

// Ensure upload directory exists on first request
let dirEnsured = false

async function ensureUploadDir() {
  if (!dirEnsured) {
    await mkdir(UPLOAD_DIR, { recursive: true })
    dirEnsured = true
  }
}

export async function POST(request: Request) {
  try {
    await ensureUploadDir()

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json({ error: `Maximum ${MAX_FILES} images allowed` }, { status: 400 })
    }

    const urls: string[] = []
    const errors: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`"${file.name}" is not a valid image type. Only JPG, PNG, WEBP allowed.`)
        continue
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`"${file.name}" exceeds 5MB limit.`)
        continue
      }

      // Validate file name for path traversal
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const ext = sanitizedName.split('.').pop()?.toLowerCase() || 'jpg'

      // Only allow safe extensions
      if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
        errors.push(`"${file.name}" has unsupported extension.`)
        continue
      }

      // Generate unique filename
      const uniqueName = `${randomUUID()}-${Date.now()}.${ext}`
      const filePath = path.join(UPLOAD_DIR, uniqueName)

      // Write file to disk
      const buffer = Buffer.from(await file.arrayBuffer())
      await writeFile(filePath, buffer)

      // Return public URL
      urls.push(`/uploads/${uniqueName}`)
    }

    if (urls.length === 0 && errors.length > 0) {
      return NextResponse.json({ error: errors.join(' ') }, { status: 400 })
    }

    return NextResponse.json({
      urls,
      errors: errors.length > 0 ? errors : undefined,
      uploaded: urls.length,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}
