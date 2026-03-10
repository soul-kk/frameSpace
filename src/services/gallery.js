import supabase from './supabase'

export const getGalleryImages = async () => {
  const { data, error } = await supabase.storage.from('photograph').list()
  if (error) throw error
  return data.map(
    file =>
      supabase.storage.from('photograph').getPublicUrl(file.name).data.publicUrl
  )
}
