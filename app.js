const { App } = require("@slack/bolt");
const cron = require('node-cron');
require('dotenv').config();

const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN,
});

let sorteados = [];
let valorMaximo = 21;

const escolheMediador = () => {
    const mediadores = ['Maycon', 'Gui', 'Moita', 'Danilão', 'Icaro', 'Klesinha', 'João', 'Gustaff', 'Little Life', 'Cynthia', 'Bruno', 'Amanda', 'Ralf', 'Arthur', 'Ricardo', 'William', 'Matheus', 'Danilo Araujo', 'Luan', 'Anderson', 'Bruno Samurai'];
    if (sorteados.length == valorMaximo) {
        sorteados = [];
    }
    let sugestao = Math.floor(Math.random() * valorMaximo);
    while (sorteados.indexOf(mediadores[sugestao]) >= 0) {
        sugestao = Math.ceil(Math.random() * (20 - 0) + 0);
    }
    sorteados.push(mediadores[sugestao]);
    return mediadores[sugestao];
}
let channelId
let mediadorHoje
// ID of the channel you want to send the message to
if (process.env.PORT) {
    channelId = process.env.CHANNEL_ID_PROD
} else {
    channelId = process.env.CHANNEL_ID_TEST
}

cron.schedule('15 8 * * 1-5', async () => {
    console.log('App rodando todos os dias as 08:35');
    mediadorHoje = escolheMediador()
    const data = new Date()
    const dataFormatada = `${data.getDate()}/${(data.getMonth() + 1)}/${data.getFullYear()}`
    console.log(`${dataFormatada} - Mediador de hoje: ${mediadorHoje}`)
    // Call the chat.postMessage method using the WebClient
    const result = await app.client.chat.postMessage({
        channel: channelId,
        text: "Daily",
        "blocks": [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "Bora pra Daily! 😍",
                    "emoji": true
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `*Mediador: *<@${mediadorHoje}>`
                }
            },
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "Entrar na Daily",
                            "emoji": true
                        },
                        "style": "primary",
                        "url": "https://meet.google.com/unx-wwvt-mah"
                    }
                ]
            },
            {
                "type": "divider"
            },
        ]
    }, (err, res) => {
        if (err) return console.log(err);
        console.log(res);
    });
}, { schedule: true, timezone: 'America/Sao_Paulo' })

// Start your app
app.start(process.env.PORT || 3000);
console.log('⚡️ Bolt app is running!');
