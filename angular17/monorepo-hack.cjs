#!/usr/bin/env node
//
// Executes a workaround for monorepos. If not in a monorepo, nothing will happen.
//
// Inlines the @fullcalendar/angular symlink. Prevents the symlink from accessing
// its peer dependencies and having two Angular versions, leading to errors.
// This is the fault of Angular custom dependency-resolution logic.
//

const fs = require('fs/promises')

runMonorepoHack('./node_modules/@fullcalendar/angular').catch((error) => {
  console.error(error.message)
  process.exit(1)
})

async function runMonorepoHack(depPath) {
  const symlinkPath = `${depPath}_orig`

  await fs.lstat(symlinkPath).catch(() => {
    return fs.rename(depPath, symlinkPath)
  })

  const sourcePath = await fs.realpath(symlinkPath)

  await fs.rm(depPath, { recursive: true, force: true })
  await fs.cp(sourcePath, depPath, { recursive: true })
}
