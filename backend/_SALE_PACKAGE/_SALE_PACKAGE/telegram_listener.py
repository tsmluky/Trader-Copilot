import os
import asyncio
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

# Bot Token from environment
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /start command"""
    await update.message.reply_text(
        "Welcome to TraderCopilot Bot!\n\n"
        "Commands:\n"
        "/myid - Get your Chat ID\n"
        "/start - Show this help"
    )

async def myid_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /myid command - Returns the user's chat ID"""
    chat_id = update.effective_chat.id
    user = update.effective_user
    
    response = (
        f"🆔 **Your Telegram Details**\n\n"
        f"**Chat ID:** `{chat_id}`\n"
        f"**User ID:** `{user.id}`\n"
        f"**Username:** @{user.username or 'N/A'}\n"
        f"**Name:** {user.first_name} {user.last_name or ''}\n\n"
        f"Copy your Chat ID and paste it in TraderCopilot Settings to enable notifications!"
    )
    
    await update.message.reply_text(response, parse_mode='Markdown')

async def main():
    """Start the bot"""
    if not BOT_TOKEN:
        print("[TELEGRAM BOT] ❌ No TELEGRAM_BOT_TOKEN found in environment")
        return
    
    print(f"[TELEGRAM BOT] 🚀 Starting Telegram Bot...")
    
    application = Application.builder().token(BOT_TOKEN).build()
    
    # Register command handlers
    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(CommandHandler("myid", myid_command))
    
    print("[TELEGRAM BOT] ✅ Bot is running. Press Ctrl+C to stop.")
    
    # Start polling
    await application.run_polling()

if __name__ == "__main__":
    asyncio.run(main())
