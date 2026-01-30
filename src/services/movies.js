import supabase from './supabase'

export const getMovies = async () => {
  const { data, error } = await supabase.from('movies_kk').select('*')
  if (error) throw error
  return data
}
