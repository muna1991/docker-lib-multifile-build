const core = require('@actions/core');
const { WebClient } = require('@slack/web-api');

const token = core.getInput('slack_token');
const channel = core.getInput('channel_id');
const repository = core.getInput('repository');
const imageTag = core.getInput('image_tag');
const environment = core.getInput('environment');
const region = core.getInput('region');

const slack = new WebClient(token);

(async () => {
    try {
        await slack.chat.postMessage({
            channel: channel,
            text: `✅ Image Ready for Push`,
            attachments: [
                {
                    color: "#36a64f",
                    text: `Repository: ${repository}\nTag: ${imageTag}\nEnvironment: ${environment}\nRegion: ${region}\n\nDocker image *${repository}:${imageTag}* is ready for push. Approve or Reject this deployment.`,
                    fallback: 'Unable to approve or reject deployment',
                    callback_id: 'approval_action',
                    actions: [
                        {
                            name: 'approve',
                            text: 'Approve ✅',
                            type: 'button',
                            style: 'primary',
                            value: `approve:${repository}:${environment}:${region}:${imageTag}`
                        },
                        {
                            name: 'reject',
                            text: 'Reject ❌',
                            type: 'button',
                            style: 'danger',
                            value: `reject:${repository}:${environment}:${region}:${imageTag}`
                        }
                    ]
                }
            ]
        });

        console.log("✅ Slack approval message sent successfully");
    } catch (error) {
        console.error("❌ Error sending Slack message:", error);
        process.exit(1);
    }
})();
