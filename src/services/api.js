import supabase from './supabase'

export const getMovies = async () => {
  const { data, error } = await supabase.from('movies_kk').select('*')
  if (error) throw error
  return data
}

export const getGalleryImages = async () => {
  const { data, error } = await supabase.storage
    .from('photograph')
    .list(undefined, { sortBy: { column: 'created_at', order: 'desc' } })
  if (error) throw error

  const files = data.filter(f => !f.name.toLowerCase().endsWith('.mov'))

  return files.map(file => {
    const url = supabase.storage.from('photograph').getPublicUrl(file.name)
      .data.publicUrl
    const isLivePhoto = file.name.toLowerCase().endsWith('.heic')
    const movName = file.name.replace(/\.heic$/i, '.MOV')
    const videoUrl = isLivePhoto
      ? supabase.storage.from('photograph').getPublicUrl(movName).data.publicUrl
      : undefined
    return { url, isLivePhoto, videoUrl }
  })
}
