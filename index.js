const core = require('@actions/core');
const AWS = require('aws-sdk');

const run_action = async () => {
	try {
		const applicationName = core.getInput('ssm-application-name', { required: true });

		AWS.config.update({ region: process.env.AWS_DEFAULT_REGION });
		const ssm = new AWS.SSM();

		for (const [variable, value] of Object.entries(process.env)) {
			if (variable.startsWith('AWS_')) {
				core.debug(`Skipping AWS paramter ${variable}`);
			} else if (typeof value !== 'string' || value.length === 0) {
				core.debug(`Skipping empty / non-string variable ${variable}`);
			} else {
				core.debug(`Putting parameter ${variable}`);

				await ssm
					.putParameter({
						Name: `/${applicationName}/temp/${variable}`,
						Value: value,
						Type: 'SecureString',
					})
					.promise();
			}
		}
	} catch (e) {
		core.setFailed(e.message);
	}
};

run_action();
