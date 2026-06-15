import cron from 'node-cron'
import { connectDB } from '@/lib/db/mongodb'
import User from '@/lib/db/models/User'

export function initSubscriptionCron() {
  // Run daily at midnight
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('Running daily subscription expiry check...')
      await connectDB()
      
      const now = new Date()
      
      const result = await User.updateMany(
        { 
          subscriptionActive: true, 
          subscriptionExpiry: { $lt: now } 
        },
        { 
          $set: { subscriptionActive: false } 
        }
      )
      
      console.log(`Deactivated ${result.modifiedCount} expired subscriptions.`)
    } catch (error) {
      console.error('Error running subscription expiry cron:', error)
    }
  })
}
