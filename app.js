


const urlAuth = 'url'
const apiKey = 'apiKey'
const email = 'email'
const password = "password"
var fetch = require('node-fetch');

/** Request api holberton to get the api key and return promise of the response**/
async function requestAuth(){
    let response = await fetch(urlAuth, 
        {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"api_key": apiKey, "email": email, "password": password, "scope": "checker"})
        });
    let result = await response.json()
    if (result.error){
        console.log(result.error)
    }
    return  result.auth_token
}
/** Request api holberton to get all tasks of a project and return promise of all tasks */
async function requestProject(){
    let authToken = await requestAuth();
    let idProject = 269; //305
    let url = 'https://intranet.hbtn.io/projects/' + idProject + '.json?auth_token=' + authToken;
    let response = await fetch(url, {method: 'GET', headers: { 'Content-Type': 'application/json'}});
    let result = await response.json();
    let listTasks = result.tasks;
    return listTasks;
}
/** Parse list of tasks and return a dictionnary like :
 *  {
 *
 *      'id_task' : { 'github_file': 'file_name', 'checker_available': 'true or false', 'github_dir': 'nameRepo', 'github_repo': 'nameRepo'},
 *  }
 */
async function parseTasks(){
    let tasks = await requestProject();
    let dictTasks = {}
    
    for (let i of tasks){
        for (let key in tasks){
            let dictTasksInfo = {}
            dictTasksInfo['github_file'] = tasks[key].github_file
            dictTasksInfo['checker_available'] = tasks[key].checker_available
            dictTasksInfo['github_dir'] = tasks[key].github_dir
            dictTasksInfo['github_repo'] = tasks[key].github_repo
            dictTasksInfo['position'] = tasks[key].position
            dictTasks[tasks[key].id] = dictTasksInfo
        }
    }
    
    return dictTasks;
}

async function askCorrection(taskId){
    let authToken = await requestAuth();
    let url = 'https://intranet.hbtn.io/tasks/' + taskId + '/start_correction.json?auth_token=' + authToken;
    let response = await fetch(url, {method: 'POST', headers: { 'Content-Type': 'application/json'}});
    let result = await response.json();
    if (result.error){
        console.log(result.error)
        return result
    }
    return result.id
}

async function checkCorrection(idCorrection){
    let authToken = await requestAuth();
    let url = 'https://intranet.hbtn.io/correction_requests/' + await idCorrection + '.json?auth_token=' + authToken;
    let response = await fetch(url, {method: 'GET', headers: { 'Content-Type': 'application/json'}});
    let result = await response.json();
    if (result.error){
        console.log(result.error)
    }
    return result;
}

async function ProjectCorrection(){
    var dictTasks = await parseTasks()

    /** Ask a correction for each task of the project */
    for (const [key, value] of Object.entries(dictTasks)){
        let idCorrection = await askCorrection(key);
        if (idCorrection.error){
            return;
        }
        let tmpDict = dictTasks[key]
        tmpDict['idCorrection'] = idCorrection
        dictTasks[key] = tmpDict
        console.log('🚀 Task (' + value['github_file'] + ') correction asked')
    }
    console.log('⏳ Keep waiting...')
    await new Promise(resolve => setTimeout(resolve, 20000));
    console.log('⌛️ Correction done')
    /** Check the status of the correction for each task of the project */
    for (const [key, value] of Object.entries(dictTasks)){
        const result = await checkCorrection(value['idCorrection']);
        if (result.error){
            console.log(result.error)
            return;
        }
        if (result.result_display.all_passed === false){
            console.log(' 🚨 One check or plus have failed on the task ' + value['position'] + ' (' + value['github_file'] + ').')
            return;
        }
    }
    console.log(Object.keys(dictTasks).length + '/' + Object.keys(dictTasks).length + ' checked! ✅')
};
xd();
