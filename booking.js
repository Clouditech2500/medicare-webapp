// Remove these lines:
// import { Amplify } from 'aws-amplify';
// import { generateClient } from 'aws-amplify/api';
// import { createTodo } from './src/graphql/mutations.js';
// import config from './amplifyconfiguration.json';

// Replace with:
const { Amplify } = window.aws_amplify_core;
const { generateClient } = window.aws_amplify_api;

// Your config data (copy from amplifyconfiguration.json)
const config = {
  "aws_project_region": "us-east-1",
  "aws_appsync_graphqlEndpoint": "https://bo3osctiv5e2bpywqzdnkxfbra.appsync-api.us-east-1.amazonaws.com/graphql",
  "aws_appsync_region": "us-east-1",
  "aws_appsync_authenticationType": "API_KEY",
  "aws_appsync_apiKey": "da2-e6iy6b4mi5eodmfxatmdbi5aeq"
};

// Your mutation (copy from mutations.js)
const createTodo = `
  mutation CreateTodo(
    $input: CreateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    createTodo(input: $input, condition: $condition) {
      id
      name
      description
      firstName
      lastName
      email
      phone
      appointmentDate
      appointmentTime
      doctor
      reason
      status
      createdAt
      updatedAt
      __typename
    }
  }
`;
