#!/usr/bin/env node
const fs = require('fs');
const { json } = require('stream/consumers');

//create file if it doesn't exists
const exists = fs.existsSync("tasks.json");
if(!exists){
    fs.writeFileSync('tasks.json',JSON.stringify([]));
}

const jsonData = JSON.parse(fs.readFileSync('tasks.json'));
//function to get id
function getId(){
    if(jsonData.length === 0){
        return 1;
    }
    else{
        return jsonData[jsonData.length-1].id+1;
    }
}
//get index by id
function getIndex(id){
    return jsonData.findIndex((task)=>task.id===parseInt(id));

}
//function to update json file
function saveFile(){
    fs.writeFileSync('tasks.json',JSON.stringify(jsonData));
}
//function to update status
function updateStatus(status){
    index = jsonData.findIndex((task)=>task.id===parseInt(id));
    jsonData[index].status = status;
}
//function to filter data by status
function filterData(status){
    return jsonData.filter((data)=>data.status == status);

}
//reading comment line arguments
const [,,command,...input] = process.argv;
//switch case to handle different operations
switch(command){
    case "add":
        const task = {
            id:getId(),
            description:input[0],
            status:"todo",
        }
        jsonData.push(task);
        saveFile();
        console.log("Task added successfully (ID:"+`${task.id}`+")");
        break;
    
    case "update":
        var id = input[0];
        var index = getIndex(id);
        jsonData[index].description = input[1];
        saveFile();
        console.log("Tasks updated");
        break;
    case "delete":
        id = input[0];
        index = getIndex(id);
        jsonData.splice(index,1);
        saveFile();
        console.log("Tasks deleted");
        break;
    case "mark-in-progress":
        id = input[0];
        updateStatus("in-progress");
        saveFile();
        break;
    case "mark-done":
        id = input[0];
        updateStatus("in-progress");
        saveFile();
        break;
    case "list":
        if(input[0] === "done"){
            console.table(filterData("done"));
        }
        else if(input[0] === "todo"){
            console.table(filterData("todo"));
        }
        else if(input[0] === "in-progress"){
            console.table(filterData("in-progress"));
        }
        else{
            for(let todo of jsonData){
                console.table(todo);
            }
        }
        break;



}