/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const inquirer = require('inquirer');
const ora = require('ora');
const lodash = require('lodash');
const rimraf = require('rimraf');
const childProcess = require('child_process');

async function init() {
  const characters = [
    'Alquimista',
    'Anão',
    'Anti-Paladino',
    'Assassino',
    'Bárbaro',
    'Bardo',
    'Cavaleiro',
    'Clérigo',
    'Druida',
    'Elfo',
    'Guerreiro',
    'Halfling',
    'Humano',
    'Ladino',
    'Lobisomem',
    'Mago',
    'Meio-elfo',
    'Monge',
    'Ranger',
    'Paladino',
    'Vampiro',
    'Xamã',
    'Feiticeiro'
  ];

  const attributes = [
    'Força',
    'Constituição',
    'Destreza',
    'Agilidade',
    'Inteligência',
    'Força de vontade',
    'Percepção',
    'Carisma'
  ];

  await awaitWarning();
  await checkYarn();

  const params = await askParams();
  console.log('\n');

  let promise = cleanup(params);
  ora.promise(promise, '🌎 Criando a aventura...');
  await promise;

  const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  promise = removePackages(params);
  ora().succeed('👤 Preenchendo ficha de personagem...');
  ora.promise(
    promise,
    `🗡  Adicionando ${getRndInteger(-3, 20)} de \
${attributes[getRndInteger(0, attributes.length)]} \
ao ${characters[getRndInteger(0, characters.length)]}...`
  );
  await promise;

  promise = selfDestruction(params);
  ora.promise(promise, `🎲 Rolando o D20... ${getRndInteger(1, 20)}.`);
  await promise;

  promise = resetGit(params);
  ora.promise(promise, '⚔️  Raidando o final boss...');
  await promise;

  ora().succeed('✨ Level up! Projeto criado com sucesso!');
}

async function awaitWarning() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('\n 💥 ULTIMATE MEGA BLASTER PROJECT API GENERATOR 💥\n');
      console.log('🔹 NestJS\n🔹 TypeScript\n🔹 Knex\n🔹 Docker && docker-compose\n🔹 Husky\n');
      resolve();
    });
  });
}

async function checkYarn() {
  await execCommand('yarn -v').catch(() => {
    throw new Error('Yarn is required');
  });
}

async function askParams(
  answers = {
    project: 'project',
    repository: 'https://github.com/user/repository',
    description: 'yare yare daze...'
  }
) {
  const params = await inquirer.prompt([
    {
      name: 'project',
      default: answers.project,
      message: 'Nome do projeto:',
      validate: i => (i.length >= 3 ? true : 'Pelo menos 3 letras')
    },
    {
      name: 'description',
      default: answers.description,
      message: 'Descrição:'
    },
    {
      name: 'repository',
      default: answers.repository,
      message: 'Repositório (URL):'
    },
    {
      name: 'confirmed',
      type: 'confirm',
      message: 'Confirma as configurações?:'
    }
  ]);

  if (!params.confirmed) {
    console.log('---- Responda novamente:');
    return askParams(params);
  }

  return {
    ...params,
    slug: lodash.kebabCase(params.project.endsWith('-api') ? params.project : `${params.project}-api`).toLowerCase()
  };
}

async function cleanup(params) {
  await replaceContent('./package.json', [
    {
      from: 'project-base',
      to: params.slug
    },
    {
      from: 'project-repository',
      to: params.repository
    }
  ]);

  await replaceContent('./docker-compose.yml', [
    {
      from: 'project-api',
      to: params.slug
    },
    {
      from: 'project-database',
      to: params.slug.replace('-api', '-database')
    },
    {
      from: 'POSTGRES_DB=project',
      to: `POSTGRES_DB=${lodash.camelCase(params.slug.replace('-api', ''))}`
    },
    {
      from: 'DATABASE_DB=project',
      to: `DATABASE_DB=${lodash.camelCase(params.slug.replace('-api', ''))}`
    }
  ]);

  await replaceContent('./src/index.ts', [
    {
      from: 'project-api',
      to: params.project
    },
    {
      from: 'project-description',
      to: params.description
    }
  ]);

  fs.copyFileSync('./.env.example', './.env');
}

async function replaceContent(file, replacers) {
  let content = await new Promise((resolve, reject) =>
    fs.readFile(file, 'utf8', (err, data) => (err ? reject(err) : resolve(data)))
  );

  for (let replacer of replacers) {
    content = content.replace(replacer.from, replacer.to);
  }

  await new Promise((resolve, reject) =>
    fs.writeFile(file, content, (err, data) => (err ? reject(err) : resolve(data)))
  );
}

async function removePackages() {
  await execCommand('yarn remove inquirer ora rimraf');
}

async function resetGit(params) {
  // const originalRepo = await execCommand('git remote get-url origin');
  await execCommand('git remote remove origin');
  // await execCommand(`git remote add seed ${originalRepo}`);

  if (params.repository) {
    await execCommand(`git remote add origin ${params.repository}`);
  }

  await execCommand('git add . && git commit -am "initial commit"');
}

async function selfDestruction() {
  await new Promise((resolve, reject) => rimraf('./init.js', err => (err ? reject(err) : resolve())));
}

async function execCommand(command) {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, (err, std) => (err ? reject(err) : resolve(std)));
  });
}

init()
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(-1);
  });
