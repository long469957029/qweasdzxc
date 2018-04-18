const execSync = require('child_process').execSync;
const fs = require('fs');
const path = require('path');
const _ = require('lodash');


const cmdStr = 'git rev-parse HEAD';

const fileName = '.gitsharc';

const releaseSha = execSync(cmdStr);

// fs.existsSync(path.resolve(__dirname, fileName))
fs.writeFileSync(path.resolve(__dirname, fileName), JSON.stringify({releaseSha: _.trim(releaseSha)}), {flag: 'w'})



let commits = execSync('git --no-pager log --no-merges --no-color --pretty=%H 7079c7565590d446dff852f82938ce39c87f8751..HEAD')

commits = _.map(commits.toString().split('\n'), (id) => {
  return {
    id,
    repository: 'Global/wx-forehead-pc'
  }
})

const data = {
  commits: commits,
  version: 'abcdefgf',
  projects: ['wx-pc'],
}

const cmd = `curl http://sentry.5x5x.com/api/hooks/release/builtin/3/774f0b2c7a8570315a2c2292ef9c17994d9f3d142002d5438d046c1577c376cc/ \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '${JSON.stringify(data)}'`
console.log(cmd)
execSync(cmd);
