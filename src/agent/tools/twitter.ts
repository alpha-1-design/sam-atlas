import { Tool } from '../core/loop';

export interface TwitterClient {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

export interface Tweet {
  id: string;
  text: string;
  author: {
    id: string;
    username: string;
    name: string;
  };
  createdAt: string;
  likes: number;
  retweets: number;
  replies: number;
}

export interface TwitterMention {
  id: string;
  tweet: Tweet;
  type: 'mention' | 'reply' | 'dm' | 'follow';
}

export class TwitterTool implements Tool {
  name = 'twitter';
  description = 'Post tweets, read mentions, engage with followers';
  requiredCapabilities = ['api', 'twitter'];

  private client?: TwitterClient;

  configure(client: TwitterClient): void {
    this.client = client;
  }

  async execute(input: Record<string, any>): Promise<any> {
    if (!this.client) {
      throw new Error('Twitter client not configured');
    }

    const action = input.action;

    switch (action) {
      case 'post':
        return this.postTweet(input.text, input.media);
      case 'reply':
        return this.replyToTweet(input.tweetId, input.text);
      case 'like':
        return this.likeTweet(input.tweetId);
      case 'retweet':
        return this.retweet(input.tweetId);
      case 'get_mentions':
        return this.getMentions(input.limit);
      case 'get_timeline':
        return this.getTimeline(input.limit);
      case 'search':
        return this.searchTweets(input.query, input.limit);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  private async postTweet(text: string, media?: string[]): Promise<any> {
    console.log(`[Twitter] Posting tweet: ${text.substring(0, 50)}...`);
    
    return {
      success: true,
      tweetId: `tweet_${Date.now()}`,
      text,
      createdAt: new Date().toISOString(),
    };
  }

  private async replyToTweet(tweetId: string, text: string): Promise<any> {
    console.log(`[Twitter] Replying to ${tweetId}: ${text.substring(0, 50)}...`);
    
    return {
      success: true,
      replyId: `reply_${Date.now()}`,
      inReplyTo: tweetId,
      text,
    };
  }

  private async likeTweet(tweetId: string): Promise<any> {
    console.log(`[Twitter] Liking tweet ${tweetId}`);
    return { success: true, tweetId };
  }

  private async retweet(tweetId: string): Promise<any> {
    console.log(`[Twitter] Retweeting ${tweetId}`);
    return { success: true, retweetedId: tweetId };
  }

  private async getMentions(limit = 10): Promise<TwitterMention[]> {
    console.log(`[Twitter] Getting ${limit} mentions`);
    
    return [
      {
        id: `mention_${Date.now()}`,
        tweet: {
          id: 'sample_123',
          text: 'Check out @SamAtlas for AI agent tips!',
          author: {
            id: 'user_456',
            username: 'techguru',
            name: 'Tech Guru',
          },
          createdAt: new Date().toISOString(),
          likes: 42,
          retweets: 8,
          replies: 3,
        },
        type: 'mention',
      },
    ];
  }

  private async getTimeline(limit = 20): Promise<Tweet[]> {
    console.log(`[Twitter] Getting timeline (${limit} tweets)`);
    return [];
  }

  private async searchTweets(query: string, limit = 10): Promise<Tweet[]> {
    console.log(`[Twitter] Searching: ${query}`);
    return [];
  }
}

export const twitterTool = new TwitterTool();
