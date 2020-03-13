# AskBot
A Discord Bot to ask questions

# How can I activate the bot?
1. Download it
2. Run in the root folder using a terminal "npm install discord.js" (you will need npm)
3. Go to `config.json` and insert the token in "token": " " <- here
   - To get the token you need a Discord Account, then head to https://discordapp.com/developers/applications/me, then create an application, and create a bot inside the application. Finally, copy and paste the token. **Remember that you musn't reveal the token because other people can modify your bot.**
4. Put in the terminal "node index.js"
5. Enjoy! Default prefix is `a!`

# How to use it inside Discord
1. Create a channel called #questions-queue
2. Use to post a question `a!ask | title | description`
