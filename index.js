const Discord = require('discord.js');
const client = new Discord.Client();
const moment = require("moment-timezone");
const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');
const fs = require('fs');
const config = require('./config.json');

var proxies = null;
var theproxy = 0;
var proxy = null;
var token_args = 0;

client.on('ready', () => {
  console.log("Stealer Started !");
  client.user.setActivity("y cé fé volé son URL")
});

process.on('uncaughtException', function (err) {});
process.on('unhandledRejection', function (err) {});

async function getproxieslol() {
    proxies = fs.readFileSync(process.argv[2], 'utf-8').replace(/\r/g, '').split('\n');
}

getproxieslol();

this.sniperInterval;

class Main {
    async setVanityURL(url, guild) {
        const time = moment.tz(Date.now(), "Europe/Paris").format("HH:mm:ss");
        theproxy++;
        if (theproxy == proxies.length - 1) {
            theproxy = 0;
        }
        proxy = proxies[theproxy];
        if (proxy && proxy.length > 5) {
            proxy = proxy.split(':');
        } else {
            return false;
        }
        const proxyAgent = new HttpsProxyAgent('http://'+proxy[0]+':'+proxy[1]+'');
        return await fetch(`http://discord.com/api/v8/guilds/${guild.id}/vanity-url`, {
            "agent": proxyAgent,
            "credentials": "include",
            "headers": {
                "accept": "*/*",
                "authorization": "Bot " + config.token_switcher[token_args],
                "content-type": "application/json",
            },
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": JSON.stringify({
                "code": url
            }),
            "method": "PATCH",
            "mode": "cors"
        })
        .then(res => res.json()) // expecting a json response
        .then(json => {
            if(json.message == "Invite code is either invalid or taken.") {
                console.log(`[${time}] [`+proxy[0]+`] Invite discord.gg/${url} failed to get.`);
            }else if(json.code) {
                console.log(`[${time}] [`+proxy[0]+`] Invite discord.gg/${url} success SNIPED !!!.`);
                client.channels.cache.get(config.channel_success).send("GG, We have sniped url : " + "discord.gg/" + url + " <3")
                stopSnipe();
            }else if(json.message == "You are being rate limited.") {
                token_args++;
                if (token_args == config.token_switcher.length - 1) {
                    token_args = 0;
                }        
                console.log(`[${time}] [`+proxy[0]+`] RATELIMITED NEXT TOKEN FOR BYPASS !!!`);
            }
            // console.log("DEBUG : " + JSON.stringify(json))
        });
    
    }
}

let handler = new Main();

function startSnipe(url, guild) {
    this.sniperInterval = setInterval(async () => {
        await handler.setVanityURL(url, guild);
    }, 1000);
}

function stopSnipe() {
    return clearInterval(this.sniperInterval);
}

const prefix = "!";

client.on('message', async (message) => {
    let messageArray = message.content.split(" "),
        args = messageArray.slice(1);
    const args1 = message.content.slice(prefix.length).split(/ +/),
          command = args1.shift().toLowerCase();

    if (command === "start-snipe") {
        let url = args[0];
        

        if (!message.guild.features.includes('VANITY_URL')) {
            return message.reply("You don't have feature VANITY_URL");
        };

        message.reply(`Im sniping ${url} now !`);
        console.log(`[INFO] Start sniping the url ${url} !`);
        startSnipe(url, message.guild);
    };

    if (command === "stop-snipe") {
        message.reply(`I stop all snipe !`);
        stopSnipe();
    };
});

client.login(config.bot_manager);
