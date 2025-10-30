import { existsSync, readFileSync } from 'node:fs'
import { mkdir, stat, writeFile } from 'node:fs/promises'
import { basename,dirname, join } from 'node:path'

type Variant = {
  format: 'webp' | 'avif'
  width: number
  quality: number
}

type SourceImage = {
  file: string
  outputName: string
}

const sourceDir = join(process.cwd(), 'src/assets/landingImages/cardImages')
const targetDir = join(process.cwd(), 'public/media/landing')

const variants: Variant[] = [
  { format: 'avif', width: 480, quality: 60 },
  { format: 'avif', width: 768, quality: 60 },
  { format: 'avif', width: 1080, quality: 60 },
  { format: 'webp', width: 480, quality: 78 },
  { format: 'webp', width: 768, quality: 80 },
  { format: 'webp', width: 1080, quality: 82 },
]

const sourceImages: SourceImage[] = [
  { file: 'Landing_img_1.webp', outputName: 'hero-card-1' },
  { file: 'Landing_img_2.webp', outputName: 'hero-card-2' },
  { file: 'Landing_img_3.webp', outputName: 'hero-card-3' },
]

async function ensureDir(path: string) {
  await mkdir(path, { recursive: true })
}

async function fileIsFresh(sourcePath: string, targetPath: string) {
  if (!existsSync(targetPath)) return false
  const [sourceStats, targetStats] = await Promise.all([stat(sourcePath), stat(targetPath)])
  return targetStats.mtimeMs >= sourceStats.mtimeMs
}

async function generateVariant(sharp: SharpModule, source: SourceImage, variant: Variant) {
  const sourcePath = join(sourceDir, source.file)
  const ext = variant.format
  const targetFile = `${source.outputName}-${variant.width}w.${ext}`
  const targetPath = join(targetDir, targetFile)

  if (await fileIsFresh(sourcePath, targetPath)) {
    return
  }

  const inputBuffer = readFileSync(sourcePath)
  let pipeline = sharp(inputBuffer).resize({ width: variant.width, withoutEnlargement: true })

  pipeline =
    variant.format === 'avif'
      ? pipeline.avif({ quality: variant.quality, effort: 4 })
      : pipeline.webp({ quality: variant.quality })

  const outputBuffer = await pipeline.toBuffer()
  await ensureDir(dirname(targetPath))
  await writeFile(targetPath, outputBuffer)

  console.log(`Generated ${basename(targetPath)}`)
}

async function run() {
  await ensureDir(targetDir)

  const sharp = await loadSharp()
  if (!sharp) {
    console.warn('⚠️  Skipping image optimization. Install "sharp" to enable this step.')
    return
  }

  for (const image of sourceImages) {
    for (const variant of variants) {
      await generateVariant(sharp, image, variant)
    }
  }

  console.log('✅ Landing imagery optimized')
}

type SharpModule = typeof import('sharp')

let sharpSingleton: SharpModule | null | undefined

async function loadSharp(): Promise<SharpModule | null> {
  if (sharpSingleton !== undefined) {
    return sharpSingleton
  }

  try {
    const mod = (await import('sharp')) as SharpModule | { default: SharpModule }
    sharpSingleton = 'default' in mod ? mod.default : (mod as SharpModule)
    return sharpSingleton
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code === 'ERR_MODULE_NOT_FOUND') {
      sharpSingleton = null
      return sharpSingleton
    }
    throw error
  }
}

run().catch((error) => {
  console.error('❌ Failed to optimize images:', error)
  process.exit(1)
})
