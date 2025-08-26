
import mongoose from 'mongoose';

export async function connectDB ( uri )
{
  console.log('connecting to MongoDB...');
  console.log( uri );
  if (!uri) throw new Error('MONGODB_URI is missing');
  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    // Add tuning opts if needed
  });

  const { connection } = mongoose;
  connection.on('connected', () => console.log('MongoDB connected:', connection.name));
  connection.on('error', (err) => console.error('MongoDB error:', err));
  connection.on('disconnected', () => console.warn('MongoDB disconnected'));
  return connection;
}
