import mongoose from 'mongoose'

const adSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    productName: {
      type: String,
      required: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    targetAudience: {
      type: String,
      required: true,
    },
    tone: {
      type: String,
      enum: ['professional', 'casual', 'playful', 'formal', 'friendly', 'bold'],
      default: 'professional',
    },
    platform: {
      type: String,
      enum: [
        'facebook', 
        'instagram', 
        'instagram_feed', 
        'instagram_story', 
        'facebook_carousel', 
        'google_display', 
        'linkedin', 
        'twitter', 
        'tiktok'
      ],
      default: 'facebook',
    },
    content: {
      headline: {
        type: String,
        required: true,
      },
      subheadline: String,
      bodyCopy: {
        type: String,
        required: true,
      },
      callToAction: {
        type: String,
        required: true,
      },
      hashtags: [String],
    },
    design: {
      colorScheme: [String],
      visualStyle: String,
      layoutType: String,
      imagePrompt: String,
      imageUrl: String,
    },
    metadata: {
      targetEmotions: [String],
      tokensUsed: Number,
      generatedAt: {
        type: Date,
        default: Date.now,
      },
    },
    status: {
      type: String,
      enum: ['draft', 'generated', 'edited', 'published'],
      default: 'generated',
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Index for faster queries
adSchema.index({ user: 1, createdAt: -1 })
adSchema.index({ status: 1 })

const Ad = mongoose.model('Ad', adSchema)

export default Ad

