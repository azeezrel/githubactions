import React, { useState, useEffect, useMemo } from "react";


const EXAM_DEFAULT_DURATION = 60 * 60; // 60 minutes

// shuffle helper
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ---------------- Topics ----------------
const TOPIC_1 = {
  topicId: "topic-1",
  topicName: "Author and maintain workflows",
  questions: [
    {
      id: "t1-q1",
      question:
        "How should you print a debug message in your workflow?",
      options: [
        { key: "A", text: "echo ::debug::Set variable myVariable to true"},
        { key: "B", text: "echo Set variable MyVariable to true >> $DEBUG_MESSAGE" },
        { key: "C", text: "echo ::add-mask::Set variable myVariable to true Reliability and Safety" },
        { key: "D", text: "echo debug_message=Set variable myVariable to true >> &GITHUB_OUTPUTInclusiveness" }
      ],
      answer: "A"
    },
    {
      id: "t1-q2",
      question: "As a developer, you are designing a workflow and need to communicate with the runner machine to set environment variables, output values used by other actions, add debug messages to the output logs, and other tasks. Which of the following options should you use?",
      options: [
        { key: "A", text: " composite run step" },
        { key: "B", text: " enable debug logging" },
        { key: "C", text: "self-hosted runners" },
        { key: "D", text: "environment variables." },
        { key: "E", text: "workflow command" }
      ],
      answer: "E"
    },
    {
      id: "t1-q3",
      question:
        "When should you use the GITHUB_TOKEN in a workflow?",
      options: [
        { key: "A", text: "when you want to make authenticated calls to the GitHub API" },
        { key: "B", text: "when you want to connect to the runner via SSH" },
        { key: "C", text: "when you want to access repository-level secrets" },
        { key: "D", text: "when you want to call an action from the marketplace" }
      ],
      answer: "A"
    },
    {
      id: "t1-q4",
      question:
        "In which of the following scenarios should you use self-hosted runners? (Each correct answer presents a complete solution. Choose two.)",
      options: [
        { key: "A", text: " when the workflow jobs must be run on Windows 10" },
        { key: "B", text: "when jobs must run for longer than 6 hours" },
        { key: "C", text: "when a workflow job needs to install software from the local network." },
        { key: "D", text: "when GitHub Actions minutes must be used for the workflow runs" }
        { key: "E", text: ". when you want to use macOS runners" }
      ],
      answer: ["B", "C"]
    }
  ]
};

const TOPIC_2 = {
  topicId: "topic-2",
  topicName: "GitHub Copilot Plans and Features",
  questions: [
    {
      id: "t2-q1",
      question: "As a developer, you need to leverage Redis in your workflow. What is the best way to use Redis on a self-hosted Linux runner without affecting future workflow runs?",
      options: [
        { key: "A", text: "Install Redis on the hosted runner image and place it in a runner group. Specify label: in your job to target the runner group." },
        { key: "B", text: "Set up Redis on a separate machine and reference that instance from your job" },
        { key: "C", text: "Specify container: and services: in your job definition to leverage a Redis service container." },
        { key: "D", text: "Add a run step to your workflow, which dynamically installs and configures Redis as part of your job.." }
      ],
      answer: "C"
    },
    {
      id: "t2-q2",
      question: "You installed specific software on a Linux self-hosted runner. You have users with workflows that need to be able to select the runner based on the identified custom software. Which steps should you perform to prepare the runner and your users to run these workflows? (Each correct answer presents part of the solution. Choose two.)",
      options: [
        { key: "A", text: "Configure the webhook and network to enable GitHub to trigger workflow." },
        { key: "B", text: "Create the group custom-software-on-linux and move the runner into the group." },
        { key: "C", text: "Inform users to identify the runner with the labels custom-software and linux." },
        { key: "D", text: "Add the label linux to the runner." },
        { key: "D", text: " Inform users to identify the runner based on the group." },
        { key: "D", text: "Add the label custom-software to the runner." }
              ],
      answer: ["C", "F"]
    },
    {
      id: "t2-q3",
      question: "Which of the following steps correctly demonstrates how to establish an organization-wide policy for GitHub Copilot Business to restrict its use to certain repositories?",
      options: [
        { key: "A", text: "Create a copilot.policy file in each repository" },
        { key: "B", text: "Create a copilot.policy in the .github repository" },
        { key: "C", text: "Configure the policies in the organization settings" },
        { key: "D", text: "Apply policies through the GitHub Actions configuration" }
      ],
      answer: "C"
    },
    {
      id: "t2-q4",
      question: "You need to trigger a workflow using the GitHub API for activity that happens outside of GitHub. Which workflow event do you use?",
      options: [
        { key: "A", text: "View code suggestions for a specific user" },
        { key: "B", text: "List all GitHub Copilot seat assignments for an organization" },
        { key: "C", text: "Get a summary of GitHub Copilot usage for organization members" },
        { key: "D", text: "List of all unsubscribed GitHub Copilot members within an organization" }
      ],
      answer: ["B", "C"]
    },
    {
      id: "t2-q5",
      question: "What is the best way to share feedback about GitHub Copilot Chat when using it on GitHub Mobile?",
      options: [
        { key: "A", text: "workflow_run" },
        { key: "B", text: "deployment" },
        { key: "C", text: " check_suite." },
        { key: "D", text: "repository_dispatch" }
      ],
      answer: "D"
    },
    {
      id: "t2-q6",
      question: "In which locations can actions be referenced by workflows? (Each correct answer presents a complete solution. Choose three.)",
      options: [
        { key: "A", text: "an .action extension file in the repository" },
        { key: "B", text: "a published Docker container image on Docker Hub" },
        { key: "C", text: "a public NPM registry" },
        { key: "D", text: "the runs-on: keyword of a workflow file" }
        { key: "C", text: "the repository’s Secrets settings page" },
        { key: "C", text: "a separate public repository" },
        { key: "C", text: "the same repository as the workflow" }
      ],
      answer: ["B", "C", "C"]
    },
    {
      id: "t2-q7",
      question: "Scheduled workflows run on the:",
      options: [
        { key: "A", text: "specified commit and branch from the workflow YAML file." },
        { key: "B", text: "latest commit from the branch named schedule" },
        { key: "C", text: "latest commit and branch on which the workflow was triggered." },
        { key: "D", text: "latest commit from the branch named main." },
        { key: "E", text: "latest commit on the default or base branch." }
      ],
      answer: ["E"]
    },
    {
      id: "t2-q8",
      question: "Custom environment variables can be defined at multiple levels within a workflow file including: (Each answer presents a complete solution. Choose three.)",
      options: [
        { key: "A", text: "top level." },
        { key: "B", text: "step level." },
        { key: "C", text: "default level." },
        { key: "D", text: "runner level." }
         { key: "E", text: "job level." },
          { key: "F", text: "stage level." },
      ],
      answer: ["A", "B", "E"]
    },
   {
  id: "t2-q9",
  question: "You are a DevOps engineer working on deployment workflows. You need to execute the deploy job only if the current branch name is feature-branch. Which code snippet will help you to implement the conditional execution of the job?",
  options: [
    {
      key: "A",
      text: `jobs:
  deploy:
    if: github.ref_name == 'feature-branch'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3`
    },
    {
      key: "B",
      text: `jobs:
  deploy:
    if: github.branch.name == 'feature-branch'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3`
    },
    {
      key: "C",
      text: `jobs:
  deploy:
    if: github.ref.name == 'feature-branch'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3`
    },
    {
      key: "D",
      text: `jobs:
  deploy:
    if: github.branch_name == 'feature-branch'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3`
    }
  ],
  answer: ["A"]
},
{
  id: "t2-q12",
  question: "What are the mandatory requirements for publishing GitHub Actions to the GitHub Marketplace? (Each correct answer presents part of the solution. Choose two.)",
  options: [
    { key: "A", text: "The action can be either in a public or private repository." },
    { key: "B", text: "The action’s metadata file must be in the root directory of the repository." },
    { key: "C", text: "The action’s name cannot match a user or organization on GitHub unless the user or organization owner is publishing the action." },
    { key: "D", text: "The name should match with one of the existing GitHub Marketplace categories." },
    { key: "E", text: "Each repository can contain a collection of actions as long as they are under the same Marketplace category." }
  ],
  answer: ["B", "C"]
},
    {
  id: "t2-q13",
  question: "Which of the following is the proper syntax to specify a custom environment variable named MY_VARIABLE with the value my-value?",
  options: [
    { key: "A", text: `var:\n  MY_VARIABLE = my-value` },
    { key: "B", text: `environment:\n  MY_VARIABLE = my-value` },
    { key: "C", text: `var:\n  MY_VARIABLE: my-value` },
    { key: "D", text: `env:\n  MY_VARIABLE = my-value` },
    { key: "E", text: `environment:\n  MY_VARIABLE: my-value` },
    { key: "F", text: `env:\n  MY_VARIABLE: my-value` }
  ],
  answer: ["F"]
},
    {
  id: "t2-q14",
  question: "Which step is using the dbserver environment variable correctly?",
  options: [
    {
      key: "A",
      text: `steps:\n  - name: Hello world\n    run: echo $dbserver\n    variables:\n      dbserver: orgserver1`
    },
    {
      key: "B",
      text: `steps:\n  - name: Hello world\n    run: echo $dbserver\n    env:\n      - name: dbserver\n        value: orgserver1`
    },
    {
      key: "C",
      text: `steps:\n  - name: Hello world\n    run: echo $dbserver\n    environment:\n      dbserver: orgserver1`
    },
    {
      key: "D",
      text: `steps:\n  - name: Hello world\n    run: echo $dbserver\n    env:\n      dbserver: orgserver1`
    }
  ],
  answer: ["D"]
},
   {
  id: "t2-q15",
  question: "In which scenarios could the GITHUB_TOKEN be used? (Each correct answer presents a complete solution. Choose two.)",
  options: [
    { key: "A", text: "to create a repository secret" },
    { key: "B", text: "to add a member to an organization" },
    { key: "C", text: "to read from the file system on the runner" },
    { key: "D", text: "to publish to GitHub Packages" },
    { key: "E", text: "to create issues in the repo" },
    { key: "F", text: "to leverage a self-hosted runner" }
  ],
  answer: ["D", "E"]
},
    {
  id: "t2-q16",
  question: "As a developer, which of the following snippets will enable you to run the commands npm ci and npm run build as part of a workflow?",
  options: [
    {
      key: "A",
      text: `- run: |\n    npm ci\n    npm run build`
    },
    {
      key: "B",
      text: `- shell:\n    npm ci\n    npm run build`
    },
    {
      key: "C",
      text: `- run: |\n    npm ci\n    npm run build\n  shell: nodejs`
    },
    {
      key: "D",
      text: `- run:\n    npm ci\n    npm run build`
    },
    {
      key: "E",
      text: `- shell: |\n    npm ci\n    npm run build`
    }
  ],
  answer: ["A"]
},

  {
  id: "t2-q18",
  question: "Which workflow event is used to manually trigger a workflow run?",
  options: [
    { key: "A", text: "status" },
    { key: "B", text: "workflow_dispatch" },
    { key: "C", text: "workflow_run" },
    { key: "D", text: "create" }
  ],
  answer: ["B"]
},
    {
  id: "t2-q19",
  question: "Where should workflow files be stored to be triggered by events in a repository?",
  options: [
    { key: "A", text: "anywhere" },
    { key: "B", text: "Nowhere; they must be attached to an action in the GitHub user interface." },
    { key: "C", text: ".github/workflows/" },
    { key: "D", text: ".workflows/" },
    { key: "E", text: ".github/actions/" }
  ],
  answer: ["C"]
},
    {
  id: "t2-q20",
  question: "Your organization is managing secrets using GitHub encrypted secrets, including a secret named SuperSecret. As a developer, you need to create a version of that secret that contains a different value for use in a workflow that is scoped to a specific repository named MyRepo. How should you store the secret to access your specific version within your workflow?",
  options: [
    { key: "A", text: "Create MyRepo_SuperSecret in GitHub encrypted secrets to specify the scope to MyRepo." },
    { key: "B", text: "Create a duplicate entry for SuperSecret in the encrypted secret store and specify MyRepo as the scope." },
    { key: "C", text: "Create a file with the SuperSecret information in the .github/secrets folder in MyRepo." },
    { key: "D", text: "Create and access SuperSecret from the secrets store in MyRepo." }
  ],
  answer: ["D"]
},
  
  {
  id: "t2-q22",
  question: "Which default GitHub environment variable indicates the owner and repository name?",
  options: [
    { key: "A", text: "GITHUB_REPOSITORY" },
    { key: "B", text: "GITHUB_WORKFLOW_REPO" },
    { key: "C", text: "ENV_REPOSITORY" },
    { key: "D", text: "REPOSITORY_NAME" }
  ],
  answer: ["A"]
},

    {
  id: "t2-q23",
  question: "You are a DevOps engineer in ABC Corp. You need to schedule your deployment workflow twice a week at 7:45 UTC every Wednesday and Saturday. What is the appropriate YAML structure?",
  options: [
    { key: "A", text: `on:\n  cron: '45 7 * * 3,6'` },
    { key: "B", text: `on:\n  cron:\n    - schedule: '45 7 * * 3,6'` },
    { key: "C", text: `on:\n  schedule:\n    - cron: '45 7 * * 3,6'` },
    { key: "D", text: `on:\n  schedule: '45 7 * * 3,6'` }
  ],
  answer: ["C"]
},
{
  id: "t2-q20",
  question: "You need to create new workflows to deploy to an unfamiliar cloud provider. What is the fastest and safest way to begin?",
  options: [
    { key: "A", text: "Create a custom action to wrap the cloud provider's CLI." },
    { key: "B", text: "Search GitHub Marketplace for verified actions published by the cloud provider." },
    { key: "C", text: "Use the actions/jenkins-plugin action to utilize an existing Jenkins plugin for the cloud provider." },
    { key: "D", text: "Search GitHub Marketplace for actions created by GitHub." },
    { key: "E", text: "Download the CLI for the cloud provider and review the associated documentation." }
  ],
  answer: "B"
}
  ]
};

const TOPIC_3 ={
  topicId: "topic-3",
  topicName: "Consume Workflow",
  questions: [
    {
  id: "t2-q25",
  question: "Which scopes are available to define custom environment variables within a workflow file? (Choose three.)",
  options: [
    { key: "A", text: "the entire workflow, by using env at the top level of the workflow file" },
    { key: "B", text: "all jobs being run on a single Actions runner, by using runner.env at the top of the workflow file" },
    { key: "C", text: "the entire stage, by using env at the top of the defined build stage" },
    { key: "D", text: "within the run attribute of a job step" },
    { key: "E", text: "the contents of a job within a workflow, by using jobs.env" },
    { key: "F", text: "a specific step within a job, by using jobs..steps[*].env" }
  ],
  answer: ["A", "D", "F"]

},
    {
  id: "t2-q26",
  question: "Which of the following commands will set the $FOO environment variable within a script, so that it may be used in subsequent workflow job steps?",
  options: [
    { key: "A", text: 'run: echo "::set-env name=FOO::bar"' },
    { key: "B", text: 'run: echo "FOO=bar" >> $GITHUB_ENV' },
    { key: "C", text: 'run: echo ${{ $FOO=bar }}' },
    { key: "D", text: 'run: export FOO=bar' }
  ],
  answer: "B"
},
    {
  id: "t2-q27",
  question: "Which of the following scenarios requires a developer to explicitly use the GITHUB_TOKEN or github.token secret within a workflow? (Choose two.)",
  options: [
    { key: "A", text: "passing the GITHUB_TOKEN secret to an action that requires a token as an input" },
    { key: "B", text: "making an authenticated GitHub API request" },
    { key: "C", text: "checking out source code with the actions/checkout@v3 action" },
    { key: "D", text: "assigning non-default permissions to the GITHUB_TOKEN" }
  ],
  answer: ["A", "B"]
},

    {
  id: "t2-q28",
  question: "By default, which workflows can use an action stored in internal repository? (Each answer presents a complete solution. Choose two.)",
  options: [
    { key: "A", text: "selected public repositories outside of the enterprise" },
    { key: "B", text: "internal repositories owned by the same organization as the enterprise" },
    { key: "C", text: "public repositories owned by the same organization as the enterprise" },
    { key: "D", text: "private repositories owned by an organization of the enterprise" }
  ],
  answer: ["B", "C"]
},
    {
  id: "t2-q29",
  question: "Which default environment variable specifies the branch or tag that triggered a workflow?",
  options: [
    { key: "A", text: "GITHUB_REF" },
    { key: "B", text: "GITHUB_BRANCH" },
    { key: "C", text: "ENV_BRANCH" },
    { key: "D", text: "GITHUB_TAG" }
  ],
  answer: "A"
},
    {
  id: "t2-q30",
  question: "As a developer, you need to add the correct syntax to allow the following workflow file to be triggered by multiple types of events. Which two code blocks should you add starting at line 5? (Each correct answer presents a complete solution. Choose two.)",
  options: [
    { key: "A", text: "on: [push, pull_request]" },
    { key: "B", text: "on:\n  branches:\n    - 'main'\n    - 'dev'" },
    { key: "C", text: "on:\n  schedule:\n    - cron: '*/15 * * * *'\n  initiate:\n    - 'main'" },
    { key: "D", text: "on: [push, commit]" },
    { key: "E", text: "on:\n  push:\n    branches:\n      - main\n  release:\n    types:\n      - created" },
    { key: "F", text: "on:\n  env:\n    - 'prod'\n    - 'qa'\n    - 'test'" }
  ],
  answer: ["A", "E"]
},
    {
  id: "t2-q31",
  question: "You need to make a script to retrieve workflow run logs via the API. Which is the correct API to download a workflow run log?",
  options: [
    { key: "A", text: "POST /repos/:owner/:repo/actions/runs/:run_id/logs" },
    { key: "B", text: "GET /repos/:owner/:repo/actions/runs/:run_id/logs" },
    { key: "C", text: "POST /repos/:owner/:repo/actions/runs/:run_id" },
    { key: "D", text: "GET /repos/:owner/:repo/actions/artifacts/logs" }
  ],
  answer: "B"
},
   {
  id: "t2-q33",
  question: "While awaiting approval, how many days can a workflow be in the “Waiting” state before it automatically fails?",
  options: [
    { key: "A", text: "30 days" },
    { key: "B", text: "60 days" },
    { key: "C", text: "14 days" },
    { key: "D", text: "7 days" }
  ],
  answer: "B"
},
    {
  id: "t2-q34",
  question: "What is the proper syntax to reference the system-provided run number variable?",
  options: [
    { key: "A", text: "${{var.GITHUB_RUN_NUMBER}}" },
    { key: "B", text: "${{env.GITHUB_RUN_NUMBER}}" },
    { key: "C", text: "$GITHUB_RUN_NUMBER" },
    { key: "D", text: "${{GITHUB_RUN_NUMBER}}" },
    { key: "E", text: "$github.run_number" }
  ],
  answer: "D"
},
   {
  id: "t2-q35",
  question: "How can a workflow deploy mitigate the risk of multiple workflow runs that are deploying to a single cloud environment simultaneously? (Each correct answer presents part of the solution. Choose two.)",
  options: [
    { key: "A", text: "Reference the mutex in the task performing the deployment." },
    { key: "B", text: "Set the concurrency in the deploymentjob to 1." },
    { key: "C", text: "Specify a target environment in the deploymentjob." },
    { key: "D", text: "Specify a concurrency scope in the workflow." },
    { key: "E", text: "Configure the mutex setting in the environment." },
    { key: "F", text: "Pass the mutex into the deployment job." }
  ],
  answer: ["C", "D"]
},
    {
  id: "t2-q36",
  question: "Which default GitHub environment variable indicates the name of the person or app that initiated a workflow?",
  options: [
    { key: "A", text: "GITHUB_ACTOR" },
    { key: "B", text: "GITHUB USER" },
    { key: "C", text: "ENV_ACTOR" },
    { key: "D", text: "GITHUB_WORKFLOW_ACTOR" }
  ],
  answer: "A"
},
    {
  id: "t2-q37",
  question: "As a developer, you are configuring GitHub Actions to deploy VMs to production. A member of the VMOps team must provide approval before the deployment occurs. Which of the following steps should you take? (Each correct answer presents part of the solution. Choose two.)",
  options: [
    { key: "A", text: "Navigate to the organization settings and create a Production environment with the VMOps team as a required reviewer." },
    { key: "B", text: "Specify the environment named Production in the workflow jobs that deploy to the VMs." },
    { key: "C", text: "Navigate to the repository settings and create a Production environment with the VMOps team as a required reviewer." },
    { key: "D", text: "Add the VMs to the environment." },
    { key: "E", text: "Specify the VMOps team as the owner of the environment." }
  ],
  answer: ["B", "C"]
},
    {
  id: "t2-q38",
  question: "Which of the following is the lowest repository permission you need to have for downloading workflow artifacts?",
  options: [
    { key: "A", text: "Triage" },
    { key: "B", text: "Admin" },
    { key: "C", text: "Maintain" },
    { key: "D", text: "Write" },
    { key: "E", text: "Read" }
  ],
  answer: "E"
},
    {
  id: "t2-q39",
  question: "Which statement is true regarding the ability to delete a workflow run?",
  options: [
    { key: "A", text: "Admin access is required to delete a workflow run." },
    { key: "B", text: "Pending workflow runs may be deleted." },
    { key: "C", text: "Completed workflow runs may be deleted." },
    { key: "D", text: "Workflow runs must be older than 30 days to be deleted." }
  ],
  answer: "C"
},

const TOPIC_1 ={
  topicId: "topic-4",
  topicName: "Prompt Crafting and Prompt Engineering",
  questions: [
    {
  id: "t2-q40",
  question: "As a developer, how should you enable step debug logging for a workflow?",
  options: [
    { key: "A", text: "Include the following code block in your workflow:\nenv:\n  ACTIONS_STEP_DEBUG: true" },
    { key: "B", text: "Use the --actions-step-debug flag when calling the workflow." },
    { key: "C", text: "Include the following code block in your workflow:\ndefaults:\n  ACTIONS_STEP_DEBUG: true" },
    { key: "D", text: "Set the ACTIONS_STEP_DEBUG secret or variable at the repository level to true." }
  ],
  answer: "D"
},
    {
  id: "t2-q42",
  question: "As a DevOps engineer, you need to execute a deployment to different environments like development and testing based on the labels added to a pull request. The deployment should use the releases branch and trigger only when there is a change in the files under ‘apps’ folder. Which code block should be used to define the deployment workflow trigger?",
  options: [
    { key: "A", text: "on:\n  pull_request_label:\n    branches:\n      - 'releases'\n    paths:\n      - 'apps/**'" },
    { key: "B", text: "on:\n  pull_request:\n    types: [labeled]\n    branches:\n      - 'releases/**'\n    paths:\n      - 'apps'" },
    { key: "C", text: "on:\n  pull_request:\n    types: [labeled]\n    branches:\n      - 'releases'\n    paths:\n      - 'apps/**'" },
    { key: "D", text: "on:\n  pull_request_review:\n    types: [labeled]\n    branches:\n      - 'releases'\n    paths:\n      - 'apps/**'" }
  ],
  answer: "C"
},
   {
  id: "t2-q43",
  question: "Disabling a workflow allows you to stop a workflow from being triggered without having to delete the file from the repo. In which scenarios would temporarily disabling a workflow be most useful? (Each correct answer presents a complete solution. Choose two.)",
  options: [
    { key: "A", text: "A runner needs to have diagnostic logging enabled." },
    { key: "B", text: "A workflow error produces too many, or wrong, requests, impacting external services negatively." },
    { key: "C", text: "A workflow is configured to run on self-hosted runners." },
    { key: "D", text: "A workflow sends requests to a service that is down." },
    { key: "E", text: "A workflow needs to be changed from running on a schedule to a manual trigger." }
  ],
  answer: ["B", "D"]
},
    {
      id: "t4-q5",
      question: "What is few-shot prompting?",
      options: [
        { key: "A", text: "Telling GitHub Copilot to try multiple times to answer the prompt" },
        { key: "B", text: "Telling GitHub Copilot to iterate several times on the answer before returning it to you" },
        { key: "C", text: "Telling GitHub Copilot from which sources it should base the response on" },
        { key: "D", text: "Telling GitHub Copilot about the mechanism you want it to use and how to incorporate that into the response" }
      ],
      answer: "D"
    }
  ]
};
const TOPIC_1 ={
  topicId: "topic-5",
  topicName: "Developer Use Cases for AI",
  questions: [
    {
  id: "t2-q44",
  question: "Which of the following is a valid reusable workflow reference?",
  options: [
    { key: "A", text: "uses: octo-org/another-repo/workflow.yml@v1" },
    { key: "B", text: "uses: octo-org/another-repo/.github/workflows/workflow.yml@v1" },
    { key: "C", text: "uses: another-repo/.github/workflows/workflow.yml@v1" },
    { key: "D", text: "uses: another-repo/workflow.yml@v1" }
  ],
  answer: "B"
},
   {
  id: "t2-q45",
  question: "What are the two ways to pass data between jobs? (Each correct answer presents part of the solution. Choose two.)",
  options: [
    { key: "A", text: "Use data storage." },
    { key: "B", text: "Use the copy action with cache parameter to cache the data." },
    { key: "C", text: "Use the copy action with restore parameter to restore the data from the cache." },
    { key: "D", text: "Use artifact storage." },
    { key: "E", text: "Use job outputs." },
    { key: "F", text: "Use the copy action to save the data that should be passed in the artifacts folder." }
  ],
  answer: ["D", "E"]
},
   {
  id: "t2-q46",
  question: "As a developer, you are optimizing a GitHub workflow that uses and produces many different files. You need to determine when to use caching versus workflow artifacts. Which two statements are true? (Each correct answer presents part of the solution. Choose two.)",
  options: [
    { key: "A", text: "Use artifacts to access the GitHub Package Registry and download a package for a workflow." },
    { key: "B", text: "Use caching when reusing files that change rarely between jobs or workflow runs." },
    { key: "C", text: "Use caching to store cache entries for up to 30 days between accesses." },
    { key: "D", text: "Use artifacts when referencing files produced by a job after a workflow has ended." }
  ],
  answer: ["B", "D"]
},
   {
  id: "t2-q47",
  question: "Which syntax correctly accesses a job output (output1) of an upstream job (job1) from a dependent job within a workflow?",
  options: [
    { key: "A", text: "${{needs.job1.outputs.output1}}" },
    { key: "B", text: "${{needs.job1.output1}}" },
    { key: "C", text: "${{depends.job1.output1}}" },
    { key: "D", text: "${{job1.outputs.output1}}" }
  ],
  answer: ["A"]
},
    {
  id: "t2-q48",
  question: "What is the right method to ensure users approve a workflow before the next step proceeds?",
  options: [
    { key: "A", text: "creating a branch protection rule and only allow certain users access" },
    { key: "B", text: "granting users workflow approval permissions" },
    { key: "C", text: "adding users as required reviewers for an environment" },
    { key: "D", text: "granting users repository approval permission" }
  ],
  answer: ["C"]
},
    {
  id: "t2-q49",
  question: "As a developer, you need to integrate a GitHub Actions workflow with a third-party code quality provider that uses the Checks API. How should you trigger a follow-up workflow?",
  options: [
    { key: "A", text: "Add the workflow_run webhook event as a trigger for the workflow for the code quality integration name" },
    { key: "B", text: "Add the check_run webhook event as a trigger for the workflow when the code quality integration is completed" },
    { key: "C", text: "Add the pull_request webhook event as a trigger for the workflow when the code quality integration is synchronized" },
    { key: "D", text: "Add the deployment webhook event as a trigger for the workflow when the code quality integration is completed" }
  ],
  answer: ["B"]
},
    {
  id: "t2-q50",
  question: "What is the simplest action type to run a shell script?",
  options: [
    { key: "A", text: "Bash script action" },
    { key: "B", text: "Composite action" },
    { key: "C", text: "JavaScript action" },
    { key: "D", text: "Docker container action" }
  ],
  answer: ["B"]
},
    {
  id: "t2-q51",
  question: "What is the most suitable action type for a custom action written in TypeScript?",
  options: [
    { key: "A", text: "Docker container action" },
    { key: "B", text: "Bash script action" },
    { key: "C", text: "composite run step" },
    { key: "D", text: "JavaScript action" }
  ],
  answer: ["D"]
},
    {
  id: "t2-q52",
  question: "You are a DevOps engineer working on custom Actions development. You need to handle the errors or exceptions as part of the JavaScript based action code. What should be added to the following code block to handle errors?\n\nconst core = require('@actions/core');\ntry {\n  // action code\n} catch (error) {\n  << insert snippet here >>\n}",
  options: [
    { key: "A", text: "core.setException(error.message);" },
    { key: "B", text: "action.setError(error.message);" },
    { key: "C", text: "core.setFailed(error.message);" },
    { key: "D", text: "core.action.setException(error.message);" }
  ],
  answer: ["C"]
},
   {
  id: "t2-q53",
  question: "Which workflow commands send information from the runner? (Each correct answer presents a complete solution. Choose two.)",
  options: [
    { key: "A", text: "reading from environment variables" },
    { key: "B", text: "setting a debug message" },
    { key: "C", text: "populating variables in a Dockerfile" },
    { key: "D", text: "setting output parameters" }
  ],
  answer: ["B", "D"]
},

const TOPIC_1 = {
    // Topic 6 - Testing with GitHub Copilot
  topicId: "topic-6",
  topicName: "Testing with GitHub Copilot",
  questions: [
    {
  id: "t2-q54",
  question: "Which of the following is the most common way to target a specific major release version?",
  options: [
    { key: "A", text: "steps:\n  - uses: actions/checkout@v3" },
    { key: "B", text: "steps:\n  - uses: actions/checkout" },
    { key: "C", text: "steps:\n  - uses: actions/checkout@U1673995124" },
    { key: "D", text: "steps:\n  - uses: actions/checkout@ac593985615ec2ede58e132d2e21d2b1cbd6127c" }
  ],
  answer: ["A"]
},
  {
  id: "t2-q56",
  question: "You are a DevOps engineer working on a custom action. You want to conditionally run a script at the start of the action, before the main entrypoint. Which code block should be used to define the metadata file for your custom action?",
  options: [
    { key: "A", text: "runs:\n  using: 'nodel6'\n  pre-if: github.event_name == 'push' then 'start.js'\n  main: 'index.js'" },
    { key: "B", text: "runs:\n  using: 'nodel6'\n  pre: 'start.js'\n  pre-if: github.event_name == 'push'\n  main: 'index.js'" },
    { key: "C", text: "runs:\n  using: 'nodel6'\n  start: 'start.js'\n  start-if: github.event_name == 'push'\n  main: 'index.js'" },
    { key: "D", text: "runs:\n  using: 'nodel6'\n  before: 'start.js'\n  before-if: github.event_name == 'push'\n  main: 'index.js’" }
  ],
  answer: ["B"]
},
    {
      id: "t6-q3",
      question: "When using GitHub Copilot to identify missing tests in your codebase, which of the following is the most important factor to consider?",
      options: [
        { key: "A", text: "Having a high test coverage percentage in the codebase." },
        { key: "B", text: "Using well-known coding practices in your repository." },
        { key: "C", text: "Ensuring that the correct context is available to GitHub Copilot." },
        { key: "D", text: "Close all the tabs in your IDE that do not have tests in them." }
      ],
      answer: "C"
    },
    {
  id: "t2-q57",
  question: "As a developer, how can you identify a JavaScript action on GitHub?",
  options: [
    { key: "A", text: "The action’s repository includes a js.yml file in the .github/workflows directory." },
    { key: "B", text: "The action’s repository name includes the keyword “JavaScript.”" },
    { key: "C", text: "The action.yml metadata file has the runs.using value set to node16." },
    { key: "D", text: "The action.yml metadata file references a package.json file." }
  ],
  answer: ["C"]
},
    {
  id: "t2-q58",
  question: "As a developer, your Actions workflow often reuses the same outputs or downloaded dependencies from one run to another. To cache dependencies for a job, you are using the GitHub cache action. Which input parameters are required for this action? (Each correct answer presents part of the solution. Choose two.)",
  options: [
    { key: "A", text: "path: the file path on the runner to cache or restore" },
    { key: "B", text: "dependency: the name and version of a package to cache or restore" },
    { key: "C", text: "key: the key created when saving a cache and the key used to search for a cache" },
    { key: "D", text: "restore-keys: the copy action key used with cache parameter to cache the data" },
    { key: "E", text: "cache-hit: the copy action key used with restore parameter to restore the data from the cache" },
    { key: "F", text: "ref: the ref name of the branch to access and restore a cache created" }
  ],
  answer: ["A", "C"]
},

const TOPIC_7 = {

// Topic 7 - Privacy fundamentals and content exclusions
  topicId: "topic-7",
  topicName: "Privacy Fundamentals and Context Exclusions",
  questions: [
    {
  id: "t2-q59",
  question: "As a developer, how can you identify a composite action on GitHub?",
  options: [
    { key: "A", text: "The action’s repository name includes the keyword “composite.”" },
    { key: "B", text: "The action’s repository includes an init.sh file in the root directory." },
    { key: "C", text: "The action’s repository includes Dockerfile and package.json files." },
    { key: "D", text: "The action.yml metadata file has the runs.using value set to composite." }
  ],
  answer: ["D"]
},
    {
  id: "t2-q60",
  question: "What can be used to set a failed status of an action from its code?",
  options: [
    { key: "A", text: "JavaScript dist/ folder" },
    { key: "B", text: "composite run step" },
    { key: "C", text: "output variable" },
    { key: "D", text: "a non-zero exit code" },
    { key: "E", text: "Dockerfile CMD" },
    { key: "F", text: "@actions/github toolkit" }
  ],
  answer: ["D"]
},
    {
  id: "t2-q61",
  question: "As a developer, you need to use GitHub Actions to deploy a microservice that requires runtime access to a secure token. This token is used by a variety of other microservices managed by different teams in different repos. To minimize management overhead and ensure the token is secure, which mechanisms should you use to store and access the token? (Each correct answer presents a complete solution. Choose two.)",
  options: [
    { key: "A", text: "Store the token as a GitHub encrypted secret in the same repo as the code. During deployment, use GitHub Actions to store the secret in an environment variable that can be accessed at runtime." },
    { key: "B", text: "Use a corporate non-GitHub secret store (e.g., HashiCorp Vault) to store the token. During deployment, use GitHub Actions to store the secret in an environment variable that can be accessed at runtime." },
    { key: "C", text: "Store the token as an organizational-level encrypted secret in GitHub. During deployment, use GitHub Actions to store the secret in an environment variable that can be accessed at runtime." },
    { key: "D", text: "Store the token as a GitHub encrypted secret in the same repo as the code. Create a reusable custom GitHub Action to access the token by the microservice at runtime." },
    { key: "E", text: "Store the token in a configuration file in a private repository. Use GitHub Actions to deploy the configuration file to the runtime environment." }
  ],
  answer: ["B", "C"]
},
    {
  id: "t2-q62",
  question: "Which of the following statements are true regarding the use of GitHub Actions on a GitHub Enterprise Server instance? (Each correct answer presents a complete solution. Choose three.)",
  options: [
    { key: "A", text: "Actions created by GitHub are automatically available and cannot be disabled." },
    { key: "B", text: "Third-party actions can be used on GitHub Enterprise Server by configuring GitHub Connect." },
    { key: "C", text: "Most GitHub-authored actions are automatically bundled for use on GitHub Enterprise Server." },
    { key: "D", text: "Use of GitHub Actions on GitHub Enterprise Server requires a persistent internet connection." },
    { key: "E", text: "Actions must be defined in the .github repository." },
    { key: "F", text: "Third-party actions can be manually synchronized for use on GitHub Enterprise Server." }
  ],
  answer: ["B", "C", "F"]
},
    {
  id: "t2-q63",
  question: "In the following workflow file, line 5 interprets lines 3 and 4 as Python. Which of the following is a valid option to complete line 5?\n1 steps:\n2 - run: |\n3 import os\n4 print(os.environ['PATH'])\n5",
  options: [
    { key: "A", text: "shell: python" },
    { key: "B", text: "working-directory: .github/python" },
    { key: "C", text: "shell: bash" },
    { key: "D", text: "with: python" }
  ],
  answer: ["A"]
},
    {
  id: "t2-q64",
  question: "As a developer, you need to make sure that only actions from trusted sources are available for use in your GitHub Enterprise Cloud organization. Which of the following statements are true? (Each correct answer presents a complete solution. Choose three.)",
  options: [
    { key: "A", text: "Actions can be published to an internal marketplace." },
    { key: "B", text: "GitHub-verified actions can be collectively enabled for use in the enterprise." },
    { key: "C", text: "Specific actions can individually be enabled for the organization, including version information." },
    { key: "D", text: "Actions can be restricted to only those available in the enterprise." },
    { key: "E", text: "Individual third-party actions enabled with a specific tag will prevent updated versions of the action from introducing vulnerabilities." },
    { key: "F", text: "Actions created by GitHub are automatically enabled and cannot be disabled." }
  ],
  answer: ["A", "B", "C"]
},
    {
  id: "t2-q66",
  question: "When reviewing an action for use, what file defines its available inputs and outputs?",
  options: [
    { key: "A", text: "inputs.yml" },
    { key: "B", text: "defaults.json" },
    { key: "C", text: "workflow.yml" },
    { key: "D", text: "config.json" },
    { key: "E", text: "action.yml" }
  ],
  answer: ["E"]
},
{
  id: "t2-q67",
  question: "As a developer, you have configured an IP allow list on a GitHub organization. Which effects does the IP allow list have on GitHub Actions? (Each answer presents a complete solution. Choose two.)",
  options: [
    { key: "A", text: "You can use standard GitHub-hosted runners since their IP addresses are automatically allowed." },
    { key: "B", text: "You can use self-hosted runners with known IP addresses." },
    { key: "C", text: "You must allow GitHub Actions’s IP address ranges in order to use marketplace actions." },
    { key: "D", text: "You can use GitHub-hosted larger runners since they can be configured with static IP addresses." }
  ],
  answer: ["A", "B"]
},
{
  id: "t2-q68",
  question: "You have exactly one Windows x64 self-hosted runner, and it is configured with custom tools. Which syntax could you use in the workflow to target that runner?",
  options: [
    { key: "A", text: "runs-on: [self-hosted, windows, x64]" },
    { key: "B", text: "self-hosted: [windows-x64]" },
    { key: "C", text: "runs-on: windows-latest" },
    { key: "D", text: "self-hosted: [windows, x64]" }
  ],
  answer: ["A"]
},
{
  id: "t2-q69",
  question: "As a developer, which workflow steps should you perform to publish an image to the GitHub Container Registry? (Each correct answer represents part of the solution. Choose three).",
  options: [
    { key: "A", text: "Push the image to the GitHub Container Registry." },
    { key: "B", text: "Authenticate to the GitHub Container Registry." },
    { key: "C", text: "Use the actions/setup-docker action." },
    { key: "D", text: "Pull the image from the GitHub Container Registry." },
    { key: "E", text: "Build the container image." }
  ],
  answer: ["A", "B", "E"]
},
{
  id: "t2-q70",
  question: "While writing a custom action, some behavior within the runner must be changed. Which workflow commands would set an error message in the runner’s output? (Each correct answer presents a complete solution. Choose two.)",
  options: [
    { key: "A", text: "echo \"::error file=main.py,line=10,col=15::There was an error\"" },
    { key: "B", text: "echo \"::error=There was an error::\"" },
    { key: "C", text: "echo \"::error::There was an error\"" },
    { key: "D", text: "echo \"::error message=There was an error::\"" }
  ],
  answer: ["A", "C"]
},
{
  id: "t2-q71",
  question: "Which action type should be used to bundle a series of run steps into a reusable custom action?",
  options: [
    { key: "A", text: "Composite action" },
    { key: "B", text: "Bash script action" },
    { key: "C", text: "Docker container action" },
    { key: "D", text: "JavaScript action" }
  ],
  answer: ["A"]
},
{
  id: "t2-q72",
  question: "Which choices represent best practices for publishing actions so that they can be consumed reliably? (Each correct answer presents a complete solution. Choose two.)",
  options: [
    { key: "A", text: "default branch" },
    { key: "B", text: "commit SHA" },
    { key: "C", text: "repo name" },
    { key: "D", text: "tag" },
    { key: "E", text: "organization name" }
  ],
  answer: ["B", "D"]
},
{
  id: "t2-q73",
  question: "What is a valid scenario regarding environment secrets?",
  options: [
    { key: "A", text: "configuring environment secrets for connecting to GitHub Enterprise Server" },
    { key: "B", text: "configuring environment secrets to automatically pull from Azure Key Vault" },
    { key: "C", text: "ensuring a job cannot access environment secrets until approval is obtained from a required reviewer" },
    { key: "D", text: "ensuring only a specific step can access an environment secret" }
  ],
  answer: ["C"]
},
{
  id: "t2-q74",
  question: "What are two reasons to keep an action in its own repository instead of bundling it with other application code? (Each correct answer presents a complete solution. Choose two.)",
  options: [
    { key: "A", text: "It makes the action.yml file optional." },
    { key: "B", text: "It makes it easier for the GitHub community to discover the action." },
    { key: "C", text: "It widens the scope of the code base for developers fixing issues and extending the action." },
    { key: "D", text: "It decouples the action’s versioning from the versioning of other application code." },
    { key: "E", text: "It allows sharing workflow secrets with other users." }
  ],
  answer: ["B", "D"]
},
{
  id: "t2-q75",
  question: "As a developer, you are authoring a workflow that will deploy to both DevCloud and TestCloud resources. Each cloud resource is accessed with a different deployment key. Which approach best allows you to use the same reusable workflow in separate jobs to target the different cloud resources?",
  options: [
    { key: "A", text: "Populate a DEPLOY_KEY repository secret with a JSON object containing DevCloud and TestCloud properties. Then specify DEPLOY_KEY.DevCloud in the secrets sections of the reusable workflow." },
    { key: "B", text: "Use a marketplace action to conditionally parse the DEPLOY_KEY repository secret based on the cloud resource name." },
    { key: "C", text: "Store the different keys in a DEPLOY_KEY environment secret in the DevCloud and TestCloud environments. Specify DEPLOY_KEY in the secrets section of the reusable workflow." },
    { key: "D", text: "Create repository secrets named DevCloud.DEPLOY_KEY and TestCloud.DEPLOY_KEY so that the reusable workflow parses the secrets by resource name." }
  ],
  answer: ["C"]
},
{
  id: "t2-q76",
  question: "GitHub-hosted runners support which capabilities? (Each correct answer presents a complete solution. Choose two.)",
  options: [
    { key: "A", text: "support for Linux, Windows, and macOS" },
    { key: "B", text: "support for a variety of Linux variations including CentOS, Fedora, and Debian" },
    { key: "C", text: "requiring a payment mechanism (e.g., credit card) to use for private repositories" },
    { key: "D", text: "automatic file-system caching between workflow runs" },
    { key: "E", text: "automatic patching of both the runner and the underlying OS" }
  ],
  answer: ["A", "E"]
},
{
  id: "t2-q77",
  question: "An organization’s policies specify only local actions are allowed. How should actions be distributed for this organization?",
  options: [
    { key: "A", text: "via a repository owned by a third party" },
    { key: "B", text: "via repositories owned by the organization" },
    { key: "C", text: "via the GitHub Marketplace" },
    { key: "D", text: "via the .github repository owned by the organization" }
  ],
  answer: ["B"]
},
{
  id: "t2-q78",
  question: "A single secret must be accessed by workflows in specific repositories. What is the best way to create the secret?",
  options: [
    { key: "A", text: "Create an environment secret at the organization level and leverage that environment in each of the specified repositories." },
    { key: "B", text: "Create an organization secret, specify Selected repositories as the Repository access, and select the required repositories." },
    { key: "C", text: "Create the secret in one of the repositories, check the Share secret option, and select the required repositories." },
    { key: "D", text: "Store the secret in a supported external key vault. Configure OpenID Connect (OIDC) to allow access to the external vault and link the secret from the external key vault in each of the specific repositories." }
  ],
  answer: ["B"]
},
{
  id: "t2-q79",
  question: "What are the most significant advantages of adding documentation while distributing custom actions? (Each answer presents a complete solution. Choose two.)",
  options: [
    { key: "A", text: "It generates auto completion when using the action in a workflow." },
    { key: "B", text: "It shares the description of the action to the users." },
    { key: "C", text: "It provides an example of the action." },
    { key: "D", text: "It creates a readme.md for the consuming workflow." }
  ],
  answer: ["B", "C"]
},
{
  id: "t2-q80",
  question: "A workflow that had been working now stalls in a waiting state until failing. The workflow file process-ml.yaml has not changed and contains jobs specifying runs-on: [gpu ]. Which of the following steps would troubleshoot the issue? (Each answer presents a complete solution. Choose two.)",
  options: [
    { key: "A", text: "Review the contents of the Runner_*.log files in the _diag folder." },
    { key: "B", text: "Increase the usage limits for the GitHub-hosted runners." },
    { key: "C", text: "Check the “Set up job” step for the logs of the last successful run to determine the runner." },
    { key: "D", text: "Update the org settings to enable GPU-based GitHub-hosted runners." },
    { key: "E", text: "Rotate the GITHUB_TOKEN secret for the appropriate runners." }
  ],
  answer: ["A", "C"]
},
{
  id: "t2-q81",
  question: "Your organization needs to simplify reusing and maintaining automation in your GitHub Enterprise Cloud. Which components can be directly reused across all repositories in an organization? (Each correct answer presents a complete solution. Choose three.)",
  options: [
    { key: "A", text: "actions stored in an organizational partition in the GitHub Marketplace" },
    { key: "B", text: "custom Docker actions stored in GitHub Container Registry" },
    { key: "C", text: "self-hosted runners" },
    { key: "D", text: "encrypted secrets" },
    { key: "E", text: "workflow templates" },
    { key: "F", text: "actions stored in private repositories in the organization" }
  ],
  answer: ["C", "E", "F"]
},
{
  id: "t2-q82",
  question: "Which of the following is the best way for an enterprise to prevent certain marketplace actions from running?",
  options: [
    { key: "A", text: "Create a list of the actions that are restricted from being used as an enterprise policy. Every other action can be run." },
    { key: "B", text: "It is not possible; if an action is in the marketplace, its use cannot be restricted." },
    { key: "C", text: "Create a list that is maintained as a .yml file in a .github repository specified in the enterprise. Only these actions can be run." },
    { key: "D", text: "Create a list of the actions that are allowed to run as an enterprise policy. Only these actions can be run." }
  ],
  answer: ["D"]
},
{
  id: "t2-q83",
  question: "When creating and managing custom actions in an enterprise setting, which of the following is considered a best practice?",
  options: [
    { key: "A", text: "creating a separate repository for each action so that the version can be managed independently" },
    { key: "B", text: "creating a separate branch in application repositories that only contains the actions" },
    { key: "C", text: "creating a single repository for all custom actions so that the versions for each action are all the same" },
    { key: "D", text: "including custom actions that other teams need to reference in the same repository as application code" }
  ],
  answer: ["A"]
},
{
  id: "t2-q65",
  question: "As a developer, you created a JavaScript action. What is the best way to test your JavaScript action?",
  options: [
    { key: "A", text: "Create a workflow that only executes your specific JavaScript action." },
    { key: "B", text: "Package your JavaScript action inside a docker container image and run it." },
    { key: "C", text: "Use a tool called @vercel/ncc to compile your code." },
    { key: "D", text: "Create a workflow that includes the actions/debug-javascript action." }
  ],
  answer: ["A"]
};


const QUESTIONS = [TOPIC_1, TOPIC_2, TOPIC_3, TOPIC_1, TOPIC_1, TOPIC_1, TOPIC_1];

// ---------------- Helpers ----------------
function flattenQuestions(topics) {
  const arr = [];
  for (const t of topics) {
    for (const q of t.questions) {
      arr.push({
        ...q,
        topicId: t.topicId,
        topicName: t.topicName,
        // normalize fields expected by the UI
        text: q.question,
        choices: q.options
      });
    }
  }
  return arr;
}

export default function App() {
  const flat = useMemo(() => flattenQuestions(QUESTIONS), []);

  // Settings & state
  const [examStarted, setExamStarted] = useState(false);
  const [duration, setDuration] = useState(EXAM_DEFAULT_DURATION); // seconds
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem("ghas_exam_time");
    return saved ? parseInt(saved, 10) : EXAM_DEFAULT_DURATION;
  });

  // Quiz state
  const [order, setOrder] = useState(() => shuffle(flat));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // single => "A", multi => ["A","C"]
  const [finished, setFinished] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);

  const current = order[currentIndex];

  // Load saved state on mount (if any)
  useEffect(() => {
    const saved = localStorage.getItem("github copilot_exam_state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) {
          setAnswers(parsed.answers || {});
          setOrder(parsed.order || shuffle(flat));
          setCurrentIndex(parsed.currentIndex || 0);
          setFinished(parsed.finished || false);
          setShowCorrect(parsed.showCorrect || false);
          setExamStarted(parsed.started || false);
          if (parsed.duration) setDuration(parsed.duration);
        }
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
    const savedTime = localStorage.getItem("github copilot_exam_time");
    if (savedTime) setTimeLeft(parseInt(savedTime, 10));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flat]);

  // Persist state whenever it changes
  useEffect(() => {
    const data = {
      answers,
      order,
      currentIndex,
      finished,
      showCorrect,
      started: examStarted,
      duration
    };
    try {
      localStorage.setItem("ghas_exam_state", JSON.stringify(data));
      localStorage.setItem("ghas_exam_time", timeLeft.toString());
    } catch (e) {
      console.error("Failed to save state", e);
    }
  }, [answers, order, currentIndex, finished, showCorrect, examStarted, timeLeft, duration]);

  // Timer countdown
  useEffect(() => {
    if (!examStarted || finished) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [examStarted, finished]);

  // Helper: determine if question expects multiple answers
  function isMultiAnswer(q) {
    if (!q || !q.answer) return false;
    return q.answer.length > 1;
  }

  // Toggle choice selection
  function toggleChoice(qId, key, multi) {
    setAnswers((s) => {
      const prev = s[qId];
      if (multi) {
        const arr = Array.isArray(prev) ? [...prev] : [];
        if (arr.includes(key)) return { ...s, [qId]: arr.filter((x) => x !== key) };
        return { ...s, [qId]: [...arr, key] };
      } else {
        return { ...s, [qId]: key };
      }
    });
  }

  // Navigation
  function goNext() {
    if (currentIndex < order.length - 1) setCurrentIndex((i) => i + 1);
    else setFinished(true);
  }
  function goPrev() {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }

  // Start exam from settings
  function startExam() {
    setTimeLeft(duration);
    setExamStarted(true);
    setAnswers({});
    setOrder(shuffle(flat));
    setCurrentIndex(0);
    setFinished(false);
    setShowCorrect(false);
    // clear saved state/time
    localStorage.removeItem("github copilot_exam_state");
    localStorage.removeItem("github copilot_exam_time");
  }

  // Restart to settings (clears progress)
  function restart() {
    setExamStarted(false);
    setAnswers({});
    setOrder(shuffle(flat));
    setCurrentIndex(0);
    setFinished(false);
    setShowCorrect(false);
    setTimeLeft(EXAM_DEFAULT_DURATION);
    localStorage.removeItem("github copilot_exam_state");
    localStorage.removeItem("github copilot_exam_time");
  }

  // Format time mm:ss
  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  // Results calculation (per-topic)
  const results = useMemo(() => {
    const perTopic = {};
    for (const t of QUESTIONS) {
      perTopic[t.topicId] = { name: t.topicName, total: t.questions.length, correct: 0 };
    }
    let correctCount = 0;
    for (const q of flat) {
      const given = answers[q.id];
      const correct = q.answer;
      const normalize = (s) => {
        if (!s) return "";
        if (Array.isArray(s)) return s.slice().sort().join("");
        return s.toString().split("").sort().join("");
      };
      if (normalize(given) === normalize(correct)) {
        correctCount++;
        perTopic[q.topicId].correct++;
      }
    }
    const total = flat.length;
    const percent = total ? Math.round((correctCount / total) * 10000) / 100 : 0;
    const perTopicPercent = Object.entries(perTopic).map(([id, v]) => ({
      topicId: id,
      topicName: v.name,
      percent: Math.round((v.correct / v.total) * 10000) / 100,
      correct: v.correct,
      total: v.total
    }));
    return { total, correctCount, percent, perTopicPercent };
  }, [answers, flat]);

  const pass = results.percent >= 75;

  // Show settings screen if exam not started (and no saved started state)
  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow rounded-xl p-6">
          <h1 className="text-2xl font-semibold mb-4">GITHUB COPILOT Practice Exam — Settings</h1>
          <p className="mb-4 text-sm text-gray-600">Choose exam duration and start. Your progress will be saved automatically.</p>
          <label className="block mb-2 text-sm font-medium">Select duration</label>
          <select
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value, 10))}
            className="w-full p-2 border rounded mb-4"
          >
            <option value={30 * 60}>30 minutes</option>
            <option value={60 * 60}>60 minutes</option>
            <option value={90 * 60}>90 minutes</option>
          </select>

          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Total Questions</div>
              <div className="font-medium">{flat.length}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Pass Mark</div>
              <div className="font-medium">75%</div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button onClick={startExam} className="px-4 py-2 bg-sky-600 text-white rounded">Start Exam</button>
          </div>
        </div>
      </div>
    );
  }

  // Main exam UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white p-6 flex items-center justify-center">
      <div className="max-w-5xl w-full bg-white shadow-2xl rounded-2xl p-6">
        <header className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold">GITHUB COPILOT Practice Exam</h1>
            <div className="text-sm text-gray-500">Pass mark: <strong>75%</strong></div>
          </div>
          <div className="text-sm text-gray-600">
            <div>⏱ {formatTime(timeLeft)}</div>
          </div>
        </header>

        {!finished ? (
          <div>
            <div className="mb-4">
              <div className="text-sm text-gray-500">Topic</div>
              <div className="text-lg font-medium">{current?.topicName}</div>
            </div>

            <div className="p-4 border rounded-lg mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-gray-500">Question {currentIndex + 1} of {order.length}</div>
                  <div className="mt-2 text-lg font-semibold">{current?.text}</div>
                </div>
                <div className="text-right text-sm text-gray-400">Topic: {current?.topicId}</div>
              </div>

              <div className="mt-4 grid gap-3">
                {current?.choices.map((c) => {
                  const multi = isMultiAnswer(current);
                  const selected = answers[current.id];
                  const checked = multi ? (Array.isArray(selected) && selected.includes(c.key)) : (selected === c.key);
                  return (
                    <label key={c.key} className={`w-full flex items-center gap-3 p-3 rounded-lg border ${checked ? "border-sky-500 bg-sky-50" : "border-gray-100 hover:border-gray-200"} cursor-pointer`}>
                      <input
                        type={multi ? "checkbox" : "radio"}
                        name={current.id}
                        value={c.key}
                        checked={checked}
                        onChange={() => toggleChoice(current.id, c.key, multi)}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{c.key}. {c.text}</div>
                      </div>
                    </label>
                  );
                })}
              </div>

            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button onClick={goPrev} disabled={currentIndex === 0} className="px-4 py-2 rounded-lg border disabled:opacity-40">Previous</button>
                <button onClick={goNext} className="px-4 py-2 rounded-lg bg-sky-600 text-white">{currentIndex === order.length - 1 ? 'Finish' : 'Next'}</button>
              </div>

              <div className="text-sm text-gray-600">Answered: <strong>{Object.keys(answers).length}</strong> / {order.length}</div>
            </div>

            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500" style={{ width: `${(Object.keys(answers).length / order.length) * 100}%` }} />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className={`p-6 rounded-xl ${pass ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-lg font-semibold ${pass ? 'text-green-800' : 'text-red-800'}`}>{pass ? 'Congratulations — You Passed!' : 'Result — You Did Not Pass'}</div>
                  <div className="text-sm text-gray-600 mt-1">Total score: <strong>{results.percent}%</strong> — {results.correctCount} of {results.total} correct</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Pass mark</div>
                  <div className="text-2xl font-bold">75%</div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-500">Score by topic</div>
                  <div>
                    <button onClick={() => setShowCorrect((v) => !v)} className="px-3 py-1 border rounded text-sm">{showCorrect ? "Hide Correct Answers" : "Show Correct Answers"}</button>
                  </div>
                </div>
                <div className="grid gap-3">
                  {results.perTopicPercent.map((t) => (
                    <div key={t.topicId} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{t.topicName}</div>
                        <div className="text-sm text-gray-500">{t.correct} / {t.total} correct</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">{t.percent}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <div className="text-sm text-gray-500 mb-2">Detailed results</div>
                <div className="space-y-3 max-h-96 overflow-y-auto p-2">
                  {flat.map((q, idx) => {
                    const given = answers[q.id];
                    const correct = q.answer;
                    const normalize = (s) => {
                      if (!s) return "";
                      if (Array.isArray(s)) return s.slice().sort().join("");
                      return s.toString().split("").sort().join("");
                    };
                    const correctFlag = normalize(given) === normalize(correct);
                    const givenDisplay = Array.isArray(given) ? (given.length ? given.slice().sort().join(", ") : "—") : (given ?? "—");
                    return (
                      <div key={q.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-sm text-gray-500">Q{idx + 1} — {q.topicName}</div>
                            <div className="font-medium">{q.text}</div>
                            <div className="mt-2 text-sm">Your answer: <strong>{givenDisplay}</strong> {correctFlag ? <span className="ml-2 text-sm text-green-600">(Correct)</span> : (given ? <span className="ml-2 text-sm text-red-600">(Wrong)</span> : <span className="ml-2 text-sm text-gray-500">(Unanswered)</span>)}</div>
                            {showCorrect && <div className="text-sm mt-1">Correct answer: <strong>{Array.isArray(correct) ? correct.join(", ") : correct.split("").join(", ")}</strong></div>}
                          </div>
                          <div className="text-sm text-gray-500">{correctFlag ? <span className="text-green-600 font-semibold">✓</span> : <span className="text-red-600 font-semibold">✕</span>}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button onClick={restart} className="px-4 py-2 rounded-lg border">Restart (Settings)</button>
                <button onClick={() => { setFinished(false); setCurrentIndex(0); }} className="px-4 py-2 rounded-lg bg-sky-600 text-white">Review Answers</button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
