#!/bin/bash

# SAM ATLAS - Manual Operations Script
# Run this without me if needed

echo "=============================================="
echo "   SAM ATLAS - Manual Operations"
echo "=============================================="
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to send product email
send_product_email() {
    echo "Enter customer email:"
    read email
    echo "Enter product name:"
    read product
    echo "Enter download URL:"
    read url
    echo "Enter order reference:"
    read ref
    
    echo -e "${YELLOW}Sending email to $email...${NC}"
    
    # This would use Resend API
    # curl -X POST https://api.resend.com/emails \
    #   -H "Authorization: Bearer $RESEND_API_KEY" \
    #   -H "Content-Type: application/json" \
    #   -d '{
    #     "from": "Sam Atlas <onboarding@resend.dev>",
    #     "to": "'$email'",
    #     "subject": "Your '$product' is Ready",
    #     "html": "<h1>Thank you!</h1><p>Download: '$url'</p>"
    #   }'
    
    echo -e "${GREEN}Email would be sent to $email${NC}"
    echo "Subject: Your $product is Ready"
    echo "Download: $url"
    echo "Reference: $ref"
}

# Function to check payments
check_payments() {
    echo -e "${YELLOW}Opening Paystack dashboard...${NC}"
    echo "Go to: https://dashboard.paystack.co"
    echo ""
    echo "To check via API (add your secret key):"
    echo "curl https://api.paystack.co/transaction \\
    -H 'Authorization: Bearer YOUR_SECRET_KEY'"
}

# Function to update website
update_website() {
    echo -e "${YELLOW}Updating website...${NC}"
    echo "cd ~/sam-atlas"
    echo "git pull origin main"
    echo "npm run build"
    echo "vercel --prod"
}

# Function to add new product
add_product() {
    echo "Enter product name:"
    read name
    echo "Enter product price (Africa):"
    read price_africa
    echo "Enter product price (Global):"
    read price_global
    echo "Enter description:"
    read desc
    
    echo -e "${YELLOW}To add a new product:${NC}"
    echo "1. Edit src/lib/products.ts"
    echo "2. Add product object to products array"
    echo "3. Add PDF to public/downloads/"
    echo "4. Commit and push"
}

# Main menu
while true; do
    echo ""
    echo "What would you like to do?"
    echo ""
    echo "1. Send product email manually"
    echo "2. Check Paystack payments"
    echo "3. Update website"
    echo "4. Add new product"
    echo "5. Check website status"
    echo "6. Exit"
    echo ""
    read -p "Enter choice (1-6): " choice
    
    case $choice in
        1) send_product_email ;;
        2) check_payments ;;
        3) update_website ;;
        4) add_product ;;
        5) echo "Open: https://sam-atlas.vercel.app" ;;
        6) echo "Goodbye!"; break ;;
        *) echo -e "${RED}Invalid choice${NC}" ;;
    esac
done
