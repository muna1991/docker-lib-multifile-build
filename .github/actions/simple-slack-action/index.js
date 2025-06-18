const core = require('@actions/core');
const { WebClient } = require('@slack/web-api');

async function run() {
    try {
        const token = core.getInput('slack_token');
        const channel = core.getInput('channel_id');
        const message = core.getInput('message');

        const slack = new WebClient(token);
        await slack.chat.postMessage({ channel, text: message });

        console.log("✅ Message sent to Slack");
    } catch (error) {
        core.setFailed(`❌ Failed to send Slack message: ${error.message}`);
    }
}

run();
