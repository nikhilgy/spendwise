import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { supabase, supabaseAdmin } from './database.js';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    done(null, data);
  } catch (err) {
    done(err, null);
  }
});

// Helper to get userId by email from Supabase Auth
async function getUserIdByEmail(email) {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({ email });
  if (error || !data?.users?.length) throw new Error('User not found');
  return data.users[0].id;
}

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const full_name = profile.displayName;
    const avatar_url = profile.photos[0]?.value;
    let user = null;

    // 1. Create user in Supabase Auth (if not exists)
    let userId;
    let authData;
    let authError;
    try {
      const result = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { full_name, avatar_url }
      });
      authData = result.data;
      authError = result.error;
    } catch (e) {
      authError = e;
    }
    if (authError && !authError.message.includes('User already registered')) throw authError;
    if (authData?.user?.id) {
      userId = authData.user.id;
    } else {
      userId = await getUserIdByEmail(email);
    }

    // 2. Insert into users table with correct id (ignore duplicate error)
    try {
      const { error: insertError } = await supabaseAdmin
        .from('users')
        .insert([{ id: userId, email, full_name, avatar_url }]);
      if (insertError && !insertError.message.includes('duplicate key')) throw insertError;
    } catch (e) {
      if (!e.message.includes('duplicate key')) throw e;
    }

    // 3. Fetch user profile from users table
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    user = data;
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

export default passport; 