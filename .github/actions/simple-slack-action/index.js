const core = require('@actions/core');
const { WebClient } = require('@slack/web-api');

async function run() {
    try {
        const token = core.getInput('slack_token');
        const channel = core.getInput('channel_id');
        const message = core.getInput('message');

        const slack = new WebClient(token);

        const result = await slack.chat.postMessage({
            channel: channel,
            text: message
        });

        core.info(`✅ Message sent to Slack (ts: ${result.ts})`);
    } catch (error) {
        core.setFailed(`❌ Slack message failed: ${error.message}`);
    }
}

run();
