/**
 * Ask a correction for each task of a project 
 */

var fetch = require('node-fetch');

/** config */
const urlAuth = 'https://intranet.hbtn.io/users/auth_token.json'
const apiKey = 'your_api_key'
const email = 'your_holberton_email'
const password = "your_holberton_password"

if (process.argv.length === 3) {
    const projectId = process.argv[2]
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
        return  result.auth_token;
    }
    /** Request api holberton to get all tasks of a project and return promise of all tasks **/
    async function requestProject(){
        let authToken = await requestAuth();
        let idProject = projectId; //305
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
     **/
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
                dictTasksInfo['title'] = tasks[key].title
                dictTasks[tasks[key].id] = dictTasksInfo

            }
        }
        
        return dictTasks;
    }
    /**
     * Request a correction for a specific task
     * @params taskId : The id of the task
     * @returns : Return the correction id 
     **/
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
    /**
     * Request the status of the correction
     * @params idCorrection : The id of the correction for a specific task
     * @returns : Return informations about the correction
     **/
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
    /**
     * Call askCorrection && checkCorrection to create a correction
     * for each task and check the status of this one
     **/
    async function ProjectCorrection() {
        var dictTasks = await parseTasks()
        var tasksCorrected = 0
        /** Ask a correction for each task of the project */
        for (const [key, value] of Object.entries(dictTasks)){
            let dictKeyValue = dictTasks[key]
            if (value['checker_available'] === true){
                let idCorrection = await askCorrection(key);
                if (idCorrection.error){
                    return;
                }
                dictKeyValue['idCorrection'] = idCorrection
                tasksCorrected++;
                console.log('🚀 Task (' + value['title'] + ') correction asked')
            } else {
                dictKeyValue['idCorrection'] = undefined
                console.log('🚀 Task (' + value['title'] + ') skipped no checker available')
            }
            dictTasks[key] = dictKeyValue
        }

        console.log('⏳ Keep waiting...')
        await new Promise(resolve => setTimeout(resolve, 20000));
        console.log('⌛️ Correction done')

        /** Check the status of the correction for each task of the project */
        for (const [key, value] of Object.entries(dictTasks)){
            if (value['idCorrection'] != undefined){
                const result = await checkCorrection(value['idCorrection']);
                if (result.error){
                    console.log(result.error)
                    return;
                }
                if (result.result_display.all_passed === false){
                    console.log(' 🚨 One check or plus have failed on the task ' + value['position'] + ' (' + value['title'] + ').')
                    return;
                }
            }
        }
        if (tasksCorrected === 0){
            console.log(tasksCorrected + ' checked! ✅')
        } else {
            console.log(tasksCorrected+ '/' + Object.keys(dictTasks).length + ' checked! ✅')
        }
    };
    ProjectCorrection();

} else {
    console.log('🚨 Usage: node app.py <project_id>')
}