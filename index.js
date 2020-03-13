// AskBot
// -------
// AskBot is a discord bot powered by node.js
// it basically works like this: you post a questions, and then that questions goes to a special channel,
// so it can be later replied.
// -------
// Libraries used - discord.js
// -------
// I didn't made a command handler because I consider this bot as a small project.
// -------
// NOTICE THAT THE FOLLOWING CODE IS NOT COMMENTED.
// ------
// Copyright (c) 2019-2020 AtieSoftware. All rights reserved.
// Licensed under the MIT License -- see ./LICENCE.TXT

// condition variable is to indicate if the invite link is
// public or private -- if its " " means that it's public
let condition = " ";
const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token, creatorTag, creatorId, botName, botInviteLink, questionsChannel, embedColorHelp, embedColorQuestion, serverInvite } = require('./config.json');

client.on('ready', () => {
	console.log('bot ready!');
	client.user.setActivity(`Prefix is: ${prefix}`);
});


client.on('message', message => {
	if (message.author.bot) return;
	if (message.content.indexOf(prefix) !== 0) return;

	const args = message.content.split(' ').slice(1);
	const command = message.content.toLowerCase();
// const questionChannel = client.channel.find(channel => channel.name === "questionsChannel");
	const questionChannel = message.guild.channels.find(channel => channel.name === questionsChannel);

	function clean(text) {
		if (typeof (text) === 'string') {
			return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8302));
		}
		else {
			return text;
		}
	}

	if (command === `${prefix}help`) {
		const helpEmbed = new Discord.RichEmbed()
			.setTitle(`${botName} Help`)
			.setDescription(`Prefix is: ${prefix}\nUse \`${prefix}help [command]\` to see help about a command (only available "ask" and "eval" for obvious reasons).`)
			.addField('Utility', '`ask`, `eval`', true)
			.addField('Information', '`about`, `invite`, `memory`, `ping`, `server`, `stats`', true)
			.setColor(embedColorHelp);
		message.channel.send(helpEmbed);
	}

	if (message.content.startsWith(prefix + 'eval')) {
		if (message.author.id !== creatorId) return;
		try {
			const code = args.join(' ');
			let evaled = eval(code);

			// eslint-disable-next-line valid-typeof
			if (typeof evaled !== 'text') {
				evaled = require('util').inspect(evaled);
			}
			message.channel.send(clean(evaled), { code:'xl' });
		}
		catch (err) {
			message.channel.send(`**Error:** \`\`\`js\n${clean(err)}\n\`\`\``);
		}
	}

	if (command === `${prefix}help ask`) {
		const helpAskEmbed = new Discord.RichEmbed()
			.setTitle(`${botName} Help - Ask`)
			.setDescription(`With this command you can submit a question if there's a channel called #${questionsChannel}.`)
			.addField('Usage: ', `\`${prefix}ask | <question's title> | <question's description>\``, true)
			.addField('Notice', 'Do not forget to put "|" between the prefix and the title & the title and the description!', true)
			.setFooter('<> = Required')
			.setColor(embedColorHelp);
		message.channel.send(helpAskEmbed);
	}

	if (command === `${prefix}help eval`) {
		if (message.author.id !== creatorId) {
			const helpEvalNoCreatorEmbed = new Discord.RichEmbed()
				.setTitle(`${botName} Help - Eval`)
				.setDescription('Why explain, you cannot use this command.')
				.addField('Usage:', `\`${prefix}eval <code>\``)
				.setColor(embedColorHelp);
			message.channel.send(helpEvalNoCreatorEmbed);
			return;
		}
		else {
			const helpEvalEmbed = new Discord.RichEmbed()
				.setTitle(`${botName} Help - Eval`)
				.setDescription('Evaluates Node.js code without using a console.')
				.addField('Usage:', `\`${prefix}eval <code>\``)
				.setColor(embedColorHelp);
			message.channel.send(helpEvalEmbed);
		}
	}

	if (command === `${prefix}stats`) {
		message.channel.send(`${botName} stats\n\n**Servers:** ${client.guilds.size}\n**Channels:** ${client.channels.size}\n**Users:** ${client.users.size}`);

	}

	if (command === `${prefix}about`) {
		const aboutEmbed = new Discord.RichEmbed()
			.setTitle(`About ${botName}`)
			.setDescription(`This bot allows you to ask questions and that questions will go to #${questionsChannel} so they can be later replied!\n\nMade by ${creatorTag} using JavaScript's Discord.JS library`)
			.setColor(embedColorHelp)
			.setThumbnail(client.user.displayAvatarURL);
		message.channel.send(aboutEmbed);
	}

	if (command === `${prefix}ping`) {
		message.channel.send('Getting latency...');
		message.channel.send(`API Latency: ${Math.round(client.ping)} ms`);
	}

	if (command === `${prefix}memory`) {
		let memoryusage = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
		message.channel.send(`${memoryusage} MB`);
	}

	if (command === `${prefix}invite`) {
		message.channel.send(`**BOT INVITE LINK: ${condition}**\n<${botInviteLink}>`);
	}

	if (command === `${prefix}server`) {
		message.channel.send(`${botName}\'s home: ${serverInvite}`);
	}

	if (message.content.startsWith(`${prefix}ask`)) {
		const askArgs = message.content.split(' | ').slice(1);

		if (!questionChannel) {
			message.channel.send('Cannot submit question because it doesn\'t exist a question channel!');
			return;
		}
		else {
			message.channel.send(`Question posted successfully. Go to ${questionChannel} to see your question!`);
		}


		if (!askArgs[0]) {
			message.channel.send('You must provide a title!');
			return;
		}

		if (!askArgs[1]) {
			message.channel.send('You must provide a description!');
			return;
		}

		const originalauthorTag = message.author.tag;
		const originalauthorAvatar = message.author.displayAvatarURL;

		const title = askArgs[0];
		const description = askArgs[1];


		const questionEmbed = new Discord.RichEmbed()
			.setTitle(`${title}`)
			.setDescription(`${description}`)
			.setThumbnail(originalauthorAvatar)
			.setColor(embedColorQuestion)
			.setFooter(`Asked by ${originalauthorTag}`)
			.setTimestamp();
		questionChannel.send(questionEmbed);
	}
});

process.on('unhandledRejection', error => console.error('Uncaught promise rejection: ', error));

client.on('error', error => { console.log('The websocket connection encountered an error: '), error;});

client.login(token);
