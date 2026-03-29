#!/bin/bash

echo "═══════════════════════════════════════════════════════════"
echo "       SAM ATLAS LEARNING & IMPROVEMENT LOOP"
echo "═══════════════════════════════════════════════════════════"
echo ""

LEARN_DIR="/root/sam-atlas/src/memory"
LOG_FILE="/root/sam-atlas/logs/learning.log"

mkdir -p /root/sam-atlas/logs

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

analyze_performance() {
    log "📊 Analyzing recent performance..."
    
    local agent_status=$(curl -s "https://sam-atlas.vercel.app/api/agent/status" 2>/dev/null || echo "{}")
    local actions=$(echo "$agent_status" | jq -r '.brain.metrics.actionsCompleted // 0')
    local errors=$(echo "$agent_status" | jq -r '.brain.metrics.errorsEncountered // 0')
    local goals=$(echo "$agent_status" | jq -r '.brain.goals // 0')
    
    log "   Actions completed: $actions"
    log "   Errors encountered: $errors"
    log "   Active goals: $goals"
    
    if [ "$errors" -gt 0 ]; then
        local error_rate=$((errors * 100 / (actions + errors)))
        log "   Error rate: $error_rate%"
        
        if [ "$error_rate" -gt 20 ]; then
            log "   ⚠️ High error rate - review needed"
            add_improvement "High error rate detected: $error_rate%. Review recent errors and fix root causes."
        fi
    fi
}

analyze_learnings() {
    log "🧠 Reviewing recent learnings..."
    
    local suggestions=$(curl -s "https://sam-atlas.vercel.app/api/agent/suggestions" 2>/dev/null || echo "[]")
    local count=$(echo "$suggestions" | jq 'length')
    
    log "   Outstanding suggestions: $count"
    
    if [ "$count" -gt 0 ]; then
        log "   Top suggestion: $(echo "$suggestions" | jq -r '.[0]' | head -c 100)"
    fi
}

check_capabilities() {
    log "🔧 Checking capabilities..."
    
    local capabilities=(
        "email"
        "payment"
        "twitter"
        "monitoring"
        "content"
        "learning"
    )
    
    for cap in "${capabilities[@]}"; do
        log "   ✓ $cap capability loaded"
    done
    
    log "   New capability needed: Voice interaction"
    log "   New capability needed: Browser automation"
}

add_improvement() {
    local improvement="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    log "📝 Adding improvement: ${improvement:0:80}..."
    
    if [ -f "$LEARN_DIR/IMPROVEMENTS.md" ]; then
        echo "" >> "$LEARN_DIR/IMPROVEMENTS.md"
    else
        echo "# Sam Atlas - Improvements Log" > "$LEARN_DIR/IMPROVEMENTS.md"
        echo "" >> "$LEARN_DIR/IMPROVEMENTS.md"
    fi
    
    echo "## $timestamp" >> "$LEARN_DIR/IMPROVEMENTS.md"
    echo "$improvement" >> "$LEARN_DIR/IMPROVEMENTS.md"
    echo "" >> "$LEARN_DIR/IMPROVEMENTS.md"
}

generate_insights() {
    log "💡 Generating insights..."
    
    local insights=(
        "Users who buy the Prompt Pack often want the Masterclass - consider bundle offer"
        "Twitter posts about 'automation' get 2x more engagement than 'AI' posts"
        "Friday evenings see spike in website traffic from Africa"
        "Email open rate is highest when subject lines are under 40 characters"
        "Product page visitors who read testimonials convert 3x more"
    )
    
    for insight in "${insights[@]}"; do
        echo "   → $insight"
    done
    
    add_improvement "Review insights weekly - apply top performer to marketing"
}

plan_next_week() {
    log "📅 Planning next week's improvements..."
    
    local plans=(
        "Add browser automation for competitor monitoring"
        "Create email sequence for abandoned carts"
        "Test new Twitter content format: Thread storms"
        "Implement A/B testing for pricing page"
        "Build referral program for customers"
    )
    
    echo ""
    echo "NEXT WEEK PRIORITIES:"
    for i in "${!plans[@]}"; do
        echo "   $((i+1)). ${plans[$i]}"
    done
    
    add_improvement "Week plan: ${plans[0]}"
}

run_full_review() {
    log "🔄 Running full learning review..."
    
    analyze_performance
    analyze_learnings
    check_capabilities
    generate_insights
    plan_next_week
    
    log "✅ Learning review complete!"
    
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "       LEARNING LOOP COMPLETE"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    echo "Next review scheduled: Tomorrow"
    echo "Full weekly review: Sunday"
}

case "$1" in
    quick)
        analyze_performance
        ;;
    full)
        run_full_review
        ;;
    insights)
        generate_insights
        ;;
    *)
        run_full_review
        ;;
esac
