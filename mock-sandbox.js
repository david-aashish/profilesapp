const AWS = require('aws-sdk-mock');
const { spawn } = require('child_process');

// Mock SSM
AWS.mock('SSM', 'getParameter', (params, callback) => {
  callback(null, { Parameter: { Value: 'mock-value' } });
});

// Run the sandbox command
const sandbox = spawn('npx', ['ampx', 'sandbox'], {
  env: {
    ...process.env,
    AWS_REGION: 'us-east-1',
    AWS_ACCESS_KEY_ID: 'AKIAIOSFODNN7EXAMPLE',
    AWS_SECRET_ACCESS_KEY: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
  },
  stdio: 'inherit'
});

sandbox.on('close', (code) => {
  console.log(`Sandbox process exited with code ${code}`);
});