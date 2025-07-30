import { supabase } from '../config/supabase'

export const userService = {
  // Check if username is available
  checkUsernameAvailability: async (username, excludeUserId = null) => {
    try {
      console.log('🔍 Checking username availability:', username)
      
      let query = supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
      
      if (excludeUserId) {
        query = query.neq('id', excludeUserId)
      }
      
      const { data, error } = await query.single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error
      }

      const isAvailable = !data
      console.log('✅ Username availability:', isAvailable)
      return isAvailable
    } catch (error) {
      console.error('❌ Check username availability error:', error)
      throw error
    }
  },

  // Update user profile
  updateProfile: async (userId, profileData) => {
    try {
      console.log('👤 Updating profile for user:', userId)
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          username: profileData.username,
          full_name: profileData.full_name,
          bio: profileData.bio,
          avatar_url: profileData.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('Bu kullanıcı adı zaten kullanılıyor')
        }
        throw error
      }

      console.log('✅ Profile updated successfully:', data)
      return data
    } catch (error) {
      console.error('❌ Update profile error:', error)
      throw error
    }
  },

  // Get user profile
  getProfile: async (userId) => {
    try {
      console.log('👤 Getting profile for user:', userId)
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error

      console.log('✅ Profile fetched successfully:', data)
      return data
    } catch (error) {
      console.error('❌ Get profile error:', error)
      throw error
    }
  }
}

export default userService 