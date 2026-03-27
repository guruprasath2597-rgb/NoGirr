/* =============================================
   NoGirr — Database Helper Functions (db.js)
   All Supabase operations centralized here
   ============================================= */

const DB = {

  /* ── AUTH ─────────────────────────────── */

  async signUp(email, password, name, role = 'recipient') {
    const { data, error } = await NOGIRR_DB.auth.signUp({
      email, password,
      options: { data: { name, role } }
    });
    if (error) throw error;
    return data;
  },

  async signIn(email, password) {
    const { data, error } = await NOGIRR_DB.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signInWithGoogle() {
    const { data, error } = await NOGIRR_DB.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/pages/dashboard.html' }
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await NOGIRR_DB.auth.signOut();
    if (error) throw error;
    localStorage.removeItem('nogirrUser');
    window.location.href = '../index.html';
  },

  async getUser() {
    const { data: { user } } = await NOGIRR_DB.auth.getUser();
    return user;
  },

  async getProfile() {
    const user = await this.getUser();
    if (!user) return null;
    const { data, error } = await NOGIRR_DB
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (error) console.warn('Profile fetch error:', error);
    return data;
  },

  async updateProfile(updates) {
    const user = await this.getUser();
    if (!user) throw new Error('Not logged in');
    const { data, error } = await NOGIRR_DB
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /* ── DONATIONS ────────────────────────── */

  async getDonations(filters = {}) {
    let query = NOGIRR_DB
      .from('donations')
      .select('*, profiles(name, rating)')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (filters.type && filters.type !== 'all') query = query.eq('type', filters.type);
    if (filters.is_free === true) query = query.eq('is_free', true);
    if (filters.is_live) query = query.eq('is_live', true);
    if (filters.city) query = query.eq('city', filters.city);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getDonationById(id) {
    const { data, error } = await NOGIRR_DB
      .from('donations')
      .select('*, profiles(name, phone, rating)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async createDonation(donationData) {
    const user = await this.getUser();
    if (!user) throw new Error('Must be logged in to donate');
    const profile = await this.getProfile();
    const { data, error } = await NOGIRR_DB
      .from('donations')
      .insert({
        ...donationData,
        donor_id: user.id,
        donor_name: profile?.name || 'Anonymous',
        status: 'active'
      })
      .select()
      .single();
    if (error) throw error;
    // Increment meals_donated in profile
    await NOGIRR_DB
      .from('profiles')
      .update({ meals_donated: (profile?.meals_donated || 0) + 1 })
      .eq('id', user.id);
    return data;
  },

  async deleteDonation(id) {
    const { error } = await NOGIRR_DB
      .from('donations')
      .update({ status: 'expired' })
      .eq('id', id);
    if (error) throw error;
  },

  async getMyDonations() {
    const user = await this.getUser();
    if (!user) return [];
    const { data, error } = await NOGIRR_DB
      .from('donations')
      .select('*')
      .eq('donor_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  /* ── MEAL LOGS ────────────────────────── */

  async getMealLogs(date) {
    const user = await this.getUser();
    if (!user) return [];
    const targetDate = date || new Date().toISOString().split('T')[0];
    const { data, error } = await NOGIRR_DB
      .from('meal_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('logged_at', targetDate)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async addMealLog(mealData) {
    const user = await this.getUser();
    if (!user) throw new Error('Must be logged in');
    const { data, error } = await NOGIRR_DB
      .from('meal_logs')
      .insert({ ...mealData, user_id: user.id })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteMealLog(id) {
    const { error } = await NOGIRR_DB
      .from('meal_logs')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async getWeeklyCalories() {
    const user = await this.getUser();
    if (!user) return [];
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { data, error } = await NOGIRR_DB
      .from('meal_logs')
      .select('logged_at, calories')
      .eq('user_id', user.id)
      .gte('logged_at', weekAgo.toISOString().split('T')[0])
      .order('logged_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  /* ── COMMUNITY ────────────────────────── */

  async getPosts(limit = 20) {
    const { data, error } = await NOGIRR_DB
      .from('community_posts')
      .select('*, profiles(name)')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  async createPost(content, postType = 'story', imageUrl = null) {
    const user = await this.getUser();
    if (!user) throw new Error('Must be logged in');
    const profile = await this.getProfile();
    const { data, error } = await NOGIRR_DB
      .from('community_posts')
      .insert({
        user_id: user.id,
        user_name: profile?.name || 'Anonymous',
        post_type: postType,
        content,
        image_url: imageUrl
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async likePost(id) {
    const { error } = await NOGIRR_DB.rpc('increment_likes', { post_id: id });
    if (error) {
      // Fallback: manual increment
      const { data: post } = await NOGIRR_DB.from('community_posts').select('likes').eq('id', id).single();
      await NOGIRR_DB.from('community_posts').update({ likes: (post?.likes || 0) + 1 }).eq('id', id);
    }
  },

  async getTopDonors(limit = 5) {
    const { data, error } = await NOGIRR_DB
      .from('profiles')
      .select('id, name, meals_donated, rating')
      .order('meals_donated', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  /* ── REVIEWS ──────────────────────────── */

  async addReview(donorId, donationId, rating, comment) {
    const user = await this.getUser();
    if (!user) throw new Error('Must be logged in');
    const { data, error } = await NOGIRR_DB
      .from('reviews')
      .insert({
        reviewer_id: user.id,
        donor_id: donorId,
        donation_id: donationId,
        rating,
        comment
      })
      .select()
      .single();
    if (error) throw error;
    // Update donor's average rating
    const { data: reviews } = await NOGIRR_DB
      .from('reviews')
      .select('rating')
      .eq('donor_id', donorId);
    if (reviews?.length) {
      const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
      await NOGIRR_DB.from('profiles').update({ rating: avg.toFixed(1) }).eq('id', donorId);
    }
    return data;
  },

  /* ── ADMIN STATS ──────────────────────── */

  async getAdminStats() {
    const [donations, users, posts] = await Promise.all([
      NOGIRR_DB.from('donations').select('id, city, is_free, type', { count: 'exact' }),
      NOGIRR_DB.from('profiles').select('id', { count: 'exact' }),
      NOGIRR_DB.from('community_posts').select('id', { count: 'exact' }),
    ]);
    return {
      totalDonations: donations.count || 0,
      totalUsers: users.count || 0,
      totalPosts: posts.count || 0,
    };
  },

  /* ── AUTH STATE LISTENER ──────────────── */

  onAuthChange(callback) {
    return NOGIRR_DB.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  },

  /* ── REALTIME SUBSCRIPTIONS ───────────── */

  subscribeToDonations(callback) {
    return NOGIRR_DB
      .channel('donations-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'donations' }, callback)
      .subscribe();
  },

  subscribeToPosts(callback) {
    return NOGIRR_DB
      .channel('posts-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_posts' }, callback)
      .subscribe();
  }
};

// Make DB globally available
window.DB = DB;

// Check auth state on every page
(async function () {
  const user = await DB.getUser();
  if (user) {
    const profile = await DB.getProfile();
    window.CURRENT_USER = user;
    window.CURRENT_PROFILE = profile;
    // Update sidebar user info if exists
    const sidebarUser = document.getElementById('sidebarUser');
    if (sidebarUser && profile) {
      sidebarUser.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;padding:16px 20px;border-top:1px solid rgba(255,255,255,0.05)">
          <div class="avatar avatar-sm" style="background:var(--gradient-purple);flex-shrink:0">${(profile.name||'U')[0].toUpperCase()}</div>
          <div style="flex:1;min-width:0">
            <div style="font-weight:700;font-size:0.875rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${profile.name||'User'}</div>
            <div style="font-size:0.72rem;color:var(--text-muted)">${profile.role||'recipient'}</div>
          </div>
          <button onclick="DB.signOut()" style="background:none;border:none;cursor:pointer;color:var(--text-muted);font-size:0.9rem" title="Logout"><i class="fa-solid fa-arrow-right-from-bracket"></i></button>
        </div>`;
    }
  }
})();
