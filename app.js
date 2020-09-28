/**
 * Annoy the fuck out of someone with this fun TF2 bot!
 */

// Import the discord.js and fs modules
const Discord = require('discord.js');
const fs = require('fs');

// Create an instance of a Discord client
const client = new Discord.Client();

// Declare responses as a global variable
var responses;

// Check for ready
client.on('ready', () => {
    // Ready message
    console.log('I never really was on your side.');

    fs.readFile('responses.txt', (err, data) => {
        // Check for file errors
        if (err) {
            console.log('Unable to open responses file');
        }
        // Split by newlines
        responses = data.toString().split('\n');
        // Remove blank elements
        responses = responses.filter(i => i);
        return responses;
    })
});

// Message event listener
client.on('message', message => {
    // Check author
    if (!message.webhookID && message.member.roles.cache.some((role) => role.name === 'spy tf2')) {
        webhookHandler(message)
        .catch((err) => {
            console.log('Unable to webhook properly:')
            console.error(err);
        })
    }
});

function puncFix(message) {
    var punctuation = ['!', '?', '.'];
    var periodFlag = true;
    var outMsg;

    // Trim whitespace from beginning and end
    message = message.trim();
    
    // Add period if there isn't punctuation already
    punctuation.forEach((i) => {
        if (message.slice(-1) == i) {
            periodFlag = false;
        }
    })
    if (periodFlag) {
        outMsg = message + '. ';
    }
    else {
        outMsg = message + ' ';
    }
    return outMsg;
}

async function webhookHandler(message) {
// Wack-ass way to pick a random item from a list but JavaScript is JavaScript :)
var response = responses[Math.floor(Math.random() * responses.length)];

    message.delete().catch(err => {
        console.log('Message could not be deleted:')
        console.error(err);
    });
    
    var hooks = await message.channel.fetchWebhooks();
    var hookLen = hooks.array().length

    if (hookLen < 1) {
        message.channel.createWebhook('Spy TF2', {
            avatar: client.user.avatarURL
        })
        .then(() => {
            console.log('Webhook created!')
        })
        .catch(err =>{
            console.log('Unable to create webhook:');
            console.error(err);
        });
    }
    else if (hookLen > 1){
        hooks.forEach((i) => {
            if (i != hooks.first()) {
                i.delete();
            }
        });
    }

    var hooks = await message.channel.fetchWebhooks();
    var hook = hooks.first();
    
    // Fix punctuation and trailing spaces
        var outMsg = puncFix(message.content);

    // Send message with webhook
    hook.send(outMsg + response, {
        username: message.member.nickname,
        avatarURL: message.author.avatarURL()
    })
    .catch(err => {
        console.log('Couldn\'t send message with webhook:');
        console.error(err);
    });
}

// log in with token from file
fs.readFile('token.txt', (err, data) => {
    // Check for file errors
    if (err) {
        console.log('Unable to read token file');
    }

    client.login(data.toString()).catch(err => {
        console.log('Error: Unable to log in to the Discord servers. Are you using the right token?');
    });
})
