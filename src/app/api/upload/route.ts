import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { v4 as uuidv4 } from 'uuid'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_FILES = 6
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')

// Ensure upload directory exists
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }
}

export async function POST(request: Request) {
  try {
    await ensureUploadDir()

    const formData = await request.formData()
    const files = formData.getAll('files')

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json({ error: `Maximum ${MAX_FILES} files allowed` }, { status: 400 })
    }

    const urls: string[] = []
    const errors: string[] = []

    for (const fileEntry of files) {
      if (!(fileEntry instanceof File)) {
        errors.push('Invalid file entry')
        continue
      }

      // Validate file type
      if (!ALLOWED_TYPES.includes(fileEntry.type)) {
        errors.push(`"${fileEntry.name}" is not a supported file type. Use JPG, PNG, or WEBP.`)
        continue
      }

      // Validate file size
      if (fileEntry.size > MAX_FILE_SIZE) {
        errors.push(`"${fileEntry.name}" exceeds 5MB limit.`)
        continue
      }

      // Generate safe filename
      const ext = fileEntry.name.split('.').pop()?.toLowerCase() || 'jpg'
      const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg'
      const filename = `${uuidv4()}.${safeExt}`
      const filepath = join(UPLOAD_DIR, filename)

      // Write file
      const bytes = await fileEntry.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filepath, buffer)

      urls.push(`/uploads/${filename}`)
    }

    return NextResponse.json({
      urls,
      errors: errors.length > 0 ? errors : undefined,
      uploaded: urls.length,
      failed: errors.length,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
