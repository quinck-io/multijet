import { execa } from 'execa';
import inquirer from 'inquirer';
import ora from 'ora';

const GIT_CLONE_URL = 'git@bitbucket.org:Quinck/multijet.git';

const modulesOptions = [
    'Unit Tests',
    'E2E Tests',
    'User authentication',
    'DynamoDB utilities',
    'Media storage',
    'Jenkins pipeline',
];

export function handleCreateProject() {
    inquirer
        .prompt([
            {
                name: 'projectName',
                message: 'How do you want to name the project?',
            },
            {
                name: 'modulesIncluded',
                message: 'What modules to you want to include?',
                choices: modulesOptions,
                type: 'checkbox',
            },
            {
                name: 'initializeGit',
                message: 'Initialize a Git repository?',
                type: 'confirm',
            },
        ])
        .then(async answers => {
            const { projectName } = answers;
            const spinner = ora('Scaffolding the project').start();

            await execa('git', ['clone', GIT_CLONE_URL, projectName]).catch(
                () => {
                    spinner.fail('Falied to clone the repository');
                    process.exit(1);
                },
            );
            spinner.succeed('Project initialized');

            spinner.start('Applying modules');
        });
}
