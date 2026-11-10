/** Run from the Northstar Academy repository root: node northstar-tawk-update/apply-update.mjs */
import {spawnSync} from 'node:child_process';
import {readFileSync,existsSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const repo=process.cwd();
const patch=join(dirname(fileURLToPath(import.meta.url)),'northstar-academy-tawk-replacement.patch');
const packageFile=join(repo,'package.json');
if(!existsSync(join(repo,'.git'))||!existsSync(packageFile)){
 console.error('Run from the Northstar Academy Git project root, not inside the update folder.');
 process.exit(1);
}
let project;
try{project=JSON.parse(readFileSync(packageFile,'utf8'));}catch{console.error('Could not read project package.json');process.exit(1);}
if(project.name!=='northstar-academy'){
 console.error('This update is only for the northstar-academy repository.');process.exit(1);
}
const alreadyApplied=spawnSync('git',['apply','--reverse','--check',patch],{cwd:repo,encoding:'utf8'});
if(!alreadyApplied.error&&alreadyApplied.status===0){
 console.log('tawk.to patch is already applied. No files were changed.');
 process.exit(0);
}
const verify=spawnSync('git',['apply','--check',patch],{cwd:repo,encoding:'utf8'});
if(verify.error||verify.status!==0){
 console.error('Patch cannot be applied cleanly. No files were changed.');
 console.error(verify.stderr||verify.error?.message||'Check your Git working tree and the repo version.');
 process.exit(1);
}
const apply=spawnSync('git',['apply',patch],{cwd:repo,encoding:'utf8'});
if(apply.error||apply.status!==0){
 console.error('Patch application failed. Review Git status and restore your backup if needed.');
 console.error(apply.stderr||apply.error?.message||'');
 process.exit(1);
}
console.log('tawk.to patch applied. The old custom B4 code is removed; B1–B3 and Biology Watch are preserved.');
console.log('Next: configure tawk.to IDs and Secure Mode key, enable Mail Notifications in its dashboard, then run npm test and npm run build.');
console.log('See northstar-tawk-update/README_TAWK_REPLACEMENT.md for details.');
