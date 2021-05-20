const request = require('request');



var test;
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
    return  result.auth_token
}
/** Request api holberton to get all tasks of a project and return promise of all tasks */
async function requestProject(){
    let authToken = await requestAuth();
    let idProject = 314;
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
            dictTasks[tasks[key].id] = dictTasksInfo
        }
    }
    console.log(dictTasks);

    return dictTasks;
}

async function askCorrection(taskId){
    let authToken = await requestAuth();
    let url = 'https://intranet.hbtn.io/tasks/' + taskId + '/start_correction.json?auth_token=' + authToken;
    let response = await fetch(url, {method: 'POST', headers: { 'Content-Type': 'application/json'}});
    let result = await response.json();
    console.log(result)
    return result.id
}

async function checkCorrection(idCorrection){
    let authToken = await requestAuth();
    let url = 'https://intranet.hbtn.io/correction_requests/' + await idCorrection + '.json?auth_token=' + authToken;
    let response = await fetch(url, {method: 'GET', headers: { 'Content-Type': 'application/json'}});
    let result = await response.json();
    return result;
}
parseTasks().then(async (dict) => { 

    var idCorrection = await askCorrection(1864);
    //var idCorrection = 5021192;
    //console.log(5021192)
    console.log(idCorrection);
    var result = await checkCorrection(idCorrection)
    console.log(result); 
    // if (result.status === 'Sent'){
    //     await new Promise(resolve => setTimeout(resolve, 5000));
    //     var r = await checkCorrection(idCorrection)
    //     console.log(r)
    // }else {
    //     console.log('oula');
    // };

});

