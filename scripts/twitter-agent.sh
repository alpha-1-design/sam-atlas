#!/bin/bash

TWITTER_API_KEY="${TWITTER_API_KEY}"
TWITTER_API_SECRET="${TWITTER_API_SECRET}"
TWITTER_ACCESS_TOKEN="${TWITTER_ACCESS_TOKEN}"
TWITTER_ACCESS_SECRET="${TWITTER_ACCESS_SECRET}"
TWITTER_BEARER_TOKEN="${TWITTER_BEARER_TOKEN}"

usage() {
    echo "Sam Atlas Twitter Automation"
    echo ""
    echo "Usage: ./twitter-agent.sh <command> [options]"
    echo ""
    echo "Commands:"
    echo "  post <text>                    Post a tweet"
    echo "  reply <tweet_id> <text>        Reply to a tweet"
    echo "  like <tweet_id>                Like a tweet"
    echo "  retweet <tweet_id>             Retweet a tweet"
    echo "  mentions                       Get recent mentions"
    echo "  timeline                       Get home timeline"
    echo "  search <query>                 Search tweets"
    echo "  engage                         Auto-engage with relevant tweets"
    echo "  daily                          Run daily engagement routine"
    echo ""
    echo "Environment variables required:"
    echo "  TWITTER_BEARER_TOKEN"
    echo "  TWITTER_API_KEY"
    echo "  TWITTER_API_SECRET"
    echo "  TWITTER_ACCESS_TOKEN"
    echo "  TWITTER_ACCESS_SECRET"
    exit 1
}

api_call() {
    local method="$1"
    local endpoint="$2"
    local data="$3"
    
    curl -s -X "$method" \
        -H "Authorization: Bearer $TWITTER_BEARER_TOKEN" \
        -H "Content-Type: application/json" \
        $([ -n "$data" ] && echo "-d '$data'") \
        "https://api.twitter.com/2$endpoint"
}

post_tweet() {
    local text="$1"
    local response=$(api_call "POST" "/tweets" "{\"text\": \"$text\"}")
    echo "$response" | jq -r '.data.id // .meta.id // .errors[0].detail // "Error posting tweet"'
}

reply_to_tweet() {
    local tweet_id="$1"
    local text="$2"
    local response=$(api_call "POST" "/tweets" "{\"text\": \"$text\", \"reply\": {\"in_reply_to_tweet_id\": \"$tweet_id\"}}")
    echo "$response" | jq -r '.data.id // "Error posting reply"'
}

like_tweet() {
    local tweet_id="$1"
    local my_id=$(api_call "GET" "/users/me" | jq -r '.data.id')
    local response=$(api_call "POST" "/users/$my_id/likes" "{\"tweet_id\": \"$tweet_id\"}")
    echo "$response" | jq -r '.data.liked // "Error liking tweet"'
}

retweet() {
    local tweet_id="$1"
    local my_id=$(api_call "GET" "/users/me" | jq -r '.data.id')
    local response=$(api_call "POST" "/users/$my_id/retweets" "{\"tweet_id\": \"$tweet_id\"}")
    echo "$response" | jq -r '.data.retweeted // "Error retweeting"'
}

get_mentions() {
    local my_id=$(api_call "GET" "/users/me" | jq -r '.data.id')
    api_call "GET" "/users/$my_id/mentions?max_results=10&tweet.fields=created_at,author_id" | jq '.data[] | {id, text, created_at}'
}

get_timeline() {
    local my_id=$(api_call "GET" "/users/me" | jq -r '.data.id')
    api_call "GET" "/users/$my_id/timeline?max_results=10" | jq '.data[] | {id, text, created_at}'
}

search_tweets() {
    local query="$1"
    api_call "GET" "/tweets/search/recent?query=$(echo "$query" | jq -Rs '.' | tr -d '"')&max_results=10" | jq '.data[] | {id, text}'
}

daily_routine() {
    echo "🚀 Starting Sam Atlas daily Twitter routine..."
    
    echo "📊 Checking mentions..."
    get_mentions
    
    echo ""
    echo "💬 Posting engagement tweet..."
    post_tweet "Working autonomously 24/7. Building and scaling digital products while my creator sleeps. 🚀 #AI #Automation"
    
    echo ""
    echo "✅ Daily routine complete!"
}

case "$1" in
    post)
        [ -z "$2" ] && usage
        post_tweet "$2"
        ;;
    reply)
        [ -z "$3" ] && usage
        reply_to_tweet "$2" "$3"
        ;;
    like)
        [ -z "$2" ] && usage
        like_tweet "$2"
        ;;
    retweet)
        [ -z "$2" ] && usage
        retweet "$2"
        ;;
    mentions)
        get_mentions
        ;;
    timeline)
        get_timeline
        ;;
    search)
        [ -z "$2" ] && usage
        search_tweets "$2"
        ;;
    daily)
        daily_routine
        ;;
    *)
        usage
        ;;
esac
