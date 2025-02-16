import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to database");
        return;
    }

    // Ensure that the MONGODB_URI is defined
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error("MONGODB_URI environment variable is not defined");
        process.exit(1);
    }

    try {
        const db = await mongoose.connect(mongoUri, {});
        connection.isConnected = db.connections[0].readyState;
        console.log("DB Connected Successfully");
        console.log(mongoUri);
    } catch (error) {
        console.log("Database Connection Failed", error);
        process.exit(1);
    }
}

export default dbConnect;
