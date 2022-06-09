const protoPath = __dirname + "/todo.proto";
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const todoProto = grpc.loadPackageDefinition(packageDefinition);

const tasks = [
    {
        id: 1,
        description: "Clean the house"
    },
    {
        id: 2,
        description: "Wash the dishes"
    },
    {
        id: 3,
        description: "Study about gRPC"
    }
];

function listAll(call, callback) {
    callback(null, {tasks});
}

function add(call, callback) {
    const newTask = call.request
    newTask.id = tasks[tasks.length - 1].id + 1
    tasks.push(newTask)
    callback(null, newTask)
}

function main() {
    const server = new grpc.Server();

    server.addService(todoProto.ToDo.service, {
        listAll,
        add
    });

    server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), () => {
        console.log("gRPC server running");
        server.start();
    })
}

main();