const core = require('@actions/core');
const AWS = require('aws-sdk');

const run_action = async () => {
	try {
		const applicationName = core.getInput('ssm-application-name', { required: true });

		AWS.config.update({ region: process.env.AWS_DEFAULT_REGION });
		const ssm = new AWS.SSM();

		for (const [variable, value] of Object.entries(process.env)) {
			core.debug(`Putting parameter ${variable}`);

			await ssm
				.putParameter({
					Name: `/${applicationName}/temp/${variable}`,
					Value: value,
				})
				.promise();
		}
	} catch (e) {
		core.setFailed(e.message);
	}
};

run_action();
