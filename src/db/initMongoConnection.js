import mongoose from "mongoose";

export default async function initMongoConnection() {
    try {
    const user = process.env.MONGODB_USER;
    const password = process.env.MONGODB_PASSWORD;
    const url = process.env.MONGODB_URL;
    const dataBase = process.env.MONGODB_DB;

    await mongoose.connect(
     `mongodb+srv://${user}:${password}@${url}/${dataBase}?retryWrites=true&w=majority&appName=Cluster0`,
    );
    console.log('Mongo connection successfully established!');
    } catch (error) {
        console.log('Cannot establish connection', error);
        throw error;   
    }
}
