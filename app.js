const { App, ExpressReceiver } = require("@slack/bolt");
require('dotenv').config();

let sorteados = [];
let valorMaximo = 20;

const escolheMediador = () => {
    const mediadores = ['Maycon', 'Gui', 'Moita', 'Danilão', 'Icaro', 'Klesinha', 'João', 'Gustaff', 'Little Life', 'Cynthia', 'Bruno', 'Amanda', 'Ralf', 'Arthur', 'Ricardo', 'William', 'Danilo Araujo', 'Luan', 'Anderson', 'Bruno Samurai'];
    if (sorteados.length === valorMaximo) {
        sorteados = [];
    }
    let sugestao = Math.floor(Math.random() * valorMaximo);
    while (sorteados.indexOf(mediadores[sugestao]) >= 0) {
        sugestao = Math.ceil(Math.random() * (19));
    }
    sorteados.push(mediadores[sugestao]);
    return mediadores[sugestao];
}
let channelId

const receiver = new ExpressReceiver({ signingSecret: process.env.SLACK_SIGNING_SECRET })

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    receiver
});

// ID of the channel you want to send the message to
if (process.env.PORT) {
    channelId = process.env.CHANNEL_ID_PROD
} else {
    channelId = process.env.CHANNEL_ID_TEST
}

// Call the chat.postMessage method using the WebClient
async function postarMensagem() {
    let mediadorHoje = escolheMediador()
    const data = new Date()
    const dataFormatada = `${data.getDate()}/${(data.getMonth() + 1)}/${data.getFullYear()}`
    console.log(`${dataFormatada} - Mediador de hoje: ${mediadorHoje}`)
    
    await app.client.chat.postMessage({
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
    })
    .then()
    .catch((err) => {console.log(err)})
}

receiver.router.get('/escolhe-mediador', (req, res) => {
    postarMensagem()
    res.send('OK')
})

// Start your app
app.start(process.env.PORT || 3000);
console.log('⚡️ Bolt app is running!');
