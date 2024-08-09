import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    podcasts: defineTable({
        user:v.id('users'),
        podcastTitle: v.string(),
        podcastDescription: v.string(),
        audioUrl: v.optional(v.string()),
        audioStorageId: v.optional(v.id('_storage')),
        imageUrl: v.optional(v.string()),
        imageStorageId: v.optional(v.id('_storage')),
        author:v.string(),
        authorId:v.string(),
        authorImageUrl:v.string(),
        voicePrompt:v.string(),
        imagePrompt : v.string(),
        audioDuration:v.number(),
        voiceType: v.string(),
        views: v.number(),
        
    })
    .searchIndex("search_author",{searchField:'author'})
    .searchIndex("search_title",{searchField:'podcastTitle'})
    .searchIndex("search_body",{searchField:'podcastDescription'}),
    users: defineTable({
        email: v.string(),
        imageUrl: v.string(),
        name: v.string(),
        clerkId: v.string(),
        stripeCustomerId: v.optional(v.string()), 
      }),
      
      subscriptions: defineTable({
        userId: v.id('users'),
        stripeSubscriptionId: v.string(),
        status: v.string(),
        
      })
      
})