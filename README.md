# holberton_checker_CI
### ⭐ What is about 
* Check all tasks of a specific project automatically with one command.

### ⭐ Context
* At holberton there is a checker which check our code for each task of a project but this process has to be done manually and separately in the intranet. 
* In order to reduce this process, i created this script which check all tasks of a project specified with only one command to enter, no need to do it manually.
* ATTENTION ! The number of requests is limited (30/hours) so make sure to use this script at the end of a project to make sure all tasks of a project is valid. 

### ⭐ Install
#### Install NodeJS
* Check if NodeJS is already installed <br>
``` node -v ```
* If not then,
  * Ubuntu <br>
   ``` sudo apt install nodejs ```
  * Mac os <br>
  ``` brew install node ```
  * Or [nodeJs](https://nodejs.org/en/download/)


#### Install dependencies 
* At the root of the project <br>
``` npm install ```



### ⭐ Config
#### Install NodeJS
* In app.js <br>
  * Set variables by your personnal informations from the intranet of holberton<br>
      ```const apiKey = 'your_api_key'``` <br>
      ```const email = 'your_holberton_email'``` <br>
      ```const password = "your_holberton_password" ``` <br>

### ⭐ Usage
* The basic usage is <br>
  ``` node app.js <project_id> ```
* The project_id is specified for each project in the intranet

### ❤️ Participations
* If you want to report a bug or add a new feature or fix some bugs <b> Create a pull request </b>
