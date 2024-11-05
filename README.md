# GrowTeleBackup
A Telegram bot to automate and manage backups efficiently. With KING of Backup Bot, you can manually create backups, schedule automatic backups, and manage your backup configurations seamlessly.


## Showcase
![image](https://github.com/user-attachments/assets/87d469c8-8ee7-48d3-9a3c-8b50a1e562bd)


## Features 🚀

- **Manual Backup:** Trigger an instant backup with a simple command.
- **Automatic Backup Scheduling:** Schedule backups at your preferred intervals (minute, hour, day, or month).
- **Custom Backup Directory:** Set and save your desired backup directory.
- **Configuration Management:** Easily reset your configuration when needed.

## Getting Started 🔧

Follow these instructions to get the bot up and running on your local machine.

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Telegram](https://telegram.org/) account
- [Telegram Bot Token](https://core.telegram.org/bots#botfather)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/king-of-backup-bot.git / download from our releases to get latest.
   cd king-of-backup-bot
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up your bot token:**

   Replace the placeholder token in the script with your own Telegram bot token from [BotFather](https://core.telegram.org/bots#botfather):

   ```javascript
   const token = 'YOUR_TELEGRAM_BOT_TOKEN';
   ```

4. **Run the bot:**

   ```bash
   node index.js
   ```

## Usage 📖

### Commands

| Command                         | Description                                          |
|----------------------------------|------------------------------------------------------|
| `/start`                         | Welcome message with available commands.             |
| `/backup`                        | Create an instant backup.                            |
| `/set_backup_dir [path]`         | Set your desired backup directory.                   |
| `/schedule_backup [interval] [type]` | Schedule automatic backups. Example: `/schedule_backup 1 hour` |
| `/reset_config`                  | Reset your backup settings to default.               |

### Scheduling Backup

You can schedule automatic backups using the `/schedule_backup` command with the following intervals:

- **minute**: Repeats every specified number of minutes.
- **hour**: Repeats every specified number of hours.
- **day**: Repeats every specified number of days.
- **month**: Repeats every specified number of months.

Example:
```bash
/schedule_backup 1 hour
```

## Configuration 🛠️

The bot stores its configuration in `config.json`. You can manually edit this file or reset the configuration using the `/reset_config` command.

## Contributing 🤝

Contributions are welcome! Feel free to open issues or submit pull requests.

## License 📄

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments 🎉

Special thanks to the developers of the [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) and [node-schedule](https://github.com/node-schedule/node-schedule) libraries, which made this project possible.

---

Feel free to customize the sections based on your specific preferences or additional features.
