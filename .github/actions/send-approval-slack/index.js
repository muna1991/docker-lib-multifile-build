const core = require('@actions/core');
const { WebClient } = require('@slack/web-api');

async function run() {
    try {
        // Get inputs defined in action.yaml
        const token = core.getInput('slack_token');
        const channel = core.getInput('channel_id');
        const repository = core.getInput('repository');
        const imageTag = core.getInput('image_tag');
        const environment = core.getInput('environment');
        const region = core.getInput('region');

        const slack = new WebClient(token);

        // Construct button values for approval and rejection
        const approveValue = `approve:${repository}:${environment}:${region}:${imageTag}`;
        const rejectValue = `reject:${repository}:${environment}:${region}:${imageTag}`;

        // Post the Slack message with interactive buttons
        await slack.chat.postMessage({
            channel: channel,
            text: `✅ Image Ready for Push`,
            attachments: [
                {
                    color: '#36a64f',
                    text:
                        `Repository: ${repository}\n` +
                        `Tag: ${imageTag}\n` +
                        `Environment: ${environment}\n` +
                        `Region: ${region}\n\n` +
                        `Docker image ${repository}:${imageTag} is ready for push. Approve or Reject this deployment.`,
                    fallback: 'Unable to approve or reject deployment',
                    callback_id: 'approval_action',
                    actions: [
                        {
                            name: 'approve',
                            text: 'Approve ✅',
                            type: 'button',
                            value: approveValue,
                            style: 'primary',
                        },
                        {
                            name: 'reject',
                            text: 'Reject ❌',
                            type: 'button',
                            value: rejectValue,
                            style: 'danger',
                        },
                    ],
                },
            ],
        });

        console.log('✅ Slack approval message sent successfully');
    } catch (error) {
        core.setFailed(`❌ Error sending Slack message: ${error.message}`);
    }
}

run();
