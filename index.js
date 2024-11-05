const fs = require('fs');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const schedule = require('node-schedule');
const archiver = require('archiver');

const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });

let backupDirectory;
const configPath = path.join(__dirname, 'config.json');

function loadConfig() {
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    backupDirectory = config.backupDirectory;
  } else {
    promptForBackupDirectory();
  }
}

function promptForBackupDirectory() {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  readline.question("Enter the desired backup directory: ", (dir) => {
    backupDirectory = dir;
    readline.question("Do you want to save this configuration? (yes/no): ", (answer) => {
      if (answer.trim().toLowerCase() === 'yes') {
        fs.writeFileSync(configPath, JSON.stringify({ backupDirectory }), 'utf8');
      }
      readline.close();
    });
  });
}

loadConfig();

function createBackupZip() {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(backupDirectory)) {
      return reject(new Error('Backup directory does not exist'));
    }

    const archiveName = `backup_${new Date().toISOString().replace(/[:.]/g, '-')}.zip`;
    const outputFilePath = path.join(__dirname, archiveName);

    const output = fs.createWriteStream(outputFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`Backup zip created: ${outputFilePath} (${archive.pointer()} total bytes)`);
      resolve(outputFilePath);
    });

    archive.on('error', err => reject(err));

    archive.pipe(output);
    archive.directory(backupDirectory, false);
    archive.finalize();
  });
}

bot.onText(/\/start/, (msg) => {
  const welcomeMessage = `
  *Welcome to the KING of Backup Bot!* 🎉
  
  Here's what you can do:
  
  🚀 *Basic Commands:*
  - \`/backup\` - Create a manual backup instantly.
  - \`/set_backup_dir [path]\` - Set your backup directory.
  - \`/schedule_backup [interval] [type]\` - Schedule automatic backups.
    - Example: \`/schedule_backup 1 hour\`
  
  🔄 *Configuration Commands:*
  - \`/reset_config\` - Reset your backup settings.
  
  Happy Backing Up! 😊
  `;
  
  bot.sendMessage(msg.chat.id, welcomeMessage, { parse_mode: 'Markdown' });
});

bot.onText(/\/backup/, async (msg) => {
  try {
    const backupZip = await createBackupZip();

    bot.sendMessage(msg.chat.id, `Backup created.`);
    
    const document = fs.createReadStream(backupZip);
    const options = {
      filename: path.basename(backupZip),
      contentType: 'application/zip', 
    };

    bot.sendDocument(msg.chat.id, document, {}, options)
      .then(() => console.log('Backup sent to user.'))
      .catch(err => console.error('Error sending document:', err));
  } catch (error) {
    bot.sendMessage(msg.chat.id, `Error creating backup: ${error.message}`);
    console.error('Error creating backup zip:', error);
  }
});

bot.onText(/\/reset_config/, (msg) => {
  if (fs.existsSync(configPath)) {
    fs.unlinkSync(configPath);
    bot.sendMessage(msg.chat.id, `Configuration reset. The bot is restarting to apply new settings.`)
      .then(() => {
        console.log('Configuration file deleted. Restarting bot...');
        process.exit(0);
      });
  } else {
    bot.sendMessage(msg.chat.id, `No existing configuration to reset.`);
  }
});

bot.onText(/\/schedule_backup (\d+) (minute|hour|day|month)/, (msg, match) => {
  const interval = parseInt(match[1]);
  const intervalType = match[2];

  let rule;
  switch (intervalType) {
    case 'minute':
      rule = new schedule.RecurrenceRule();
      rule.minute = new schedule.Range(0, 59, interval);
      break;
    case 'hour':
      rule = new schedule.RecurrenceRule();
      rule.hour = new schedule.Range(0, 23, interval);
      rule.minute = 0;
      break;
    case 'day':
      rule = new schedule.RecurrenceRule();
      rule.dayOfWeek = new schedule.Range(0, 6, interval);
      rule.hour = 0;
      rule.minute = 0;
      break;
    case 'month':
      schedule.scheduleJob(Date.now() + interval * 30 * 24 * 60 * 60 * 1000, async () => {
        try {
          const backupZip = await createBackupZip();
          const document = fs.createReadStream(backupZip);
          const options = {
            filename: path.basename(backupZip),
            contentType: 'application/zip',
          };
          await bot.sendDocument(msg.chat.id, document, {}, options);
          console.log('Scheduled backup sent to user.');
        } catch (error) {
          console.error('Error during scheduled backup:', error);
        }
      });
      return;
  }

  if (rule) {
    schedule.scheduleJob(rule, async () => {
      try {
        const backupZip = await createBackupZip();
        const document = fs.createReadStream(backupZip);
        const options = {
          filename: path.basename(backupZip),
          contentType: 'application/zip',
        };
        await bot.sendDocument(msg.chat.id, document, {}, options);
        console.log('Scheduled backup sent to user.');
      } catch (error) {
        console.error('Error during scheduled backup:', error);
      }
    });
  }

  bot.sendMessage(msg.chat.id, `Auto backup scheduled every ${interval} ${intervalType}(s).`);
});


//Credit :
//Follow & Star my repository :) https://github.com/SurekingDevone/GrowTeleBackup
