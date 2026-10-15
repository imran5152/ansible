import mongoose from 'mongoose';

export const moods = ['Love', 'Heartbreak', 'Healing', 'Nature', 'Hope', 'Life', 'Friendship'];

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, lowercase: true, trim: true, unique: true, maxlength: 255 },
  passwordHash: { type: String, required: true, select: false },
  bio: { type: String, default: '', maxlength: 500 },
}, { timestamps: true });

const poemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  content: { type: String, required: true, trim: true, maxlength: 50000 },
  author: { type: String, trim: true, default: '', maxlength: 100 },
  mood: { type: String, enum: moods, default: 'Love' },
}, { timestamps: true });
poemSchema.index({ userId: 1, updatedAt: -1 });

export const User = mongoose.model('User', userSchema);
export const Poem = mongoose.model('Poem', poemSchema);
export const publicUser = user => ({ id: String(user._id), name: user.name, email: user.email, bio: user.bio || '' });
export const publicPoem = poem => ({
  id: String(poem._id), title: poem.title, content: poem.content,
  author: poem.author, mood: poem.mood, createdAt: poem.createdAt, updatedAt: poem.updatedAt,
});
