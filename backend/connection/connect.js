const mongoose=require('mongoose');
require('dotenv').config();

exports.mongoDBConnection = (db_name) => {
    const url = `mongodb+srv://deep242jashan:root@jashandeep.ezr14.mongodb.net/${db_name}?retryWrites=true&w=majority&appName=Jashandeep`;
    
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000,
        ssl: true,
        tls: true,
        tlsAllowInvalidCertificates: true,
        serverApi: {
            version: '1',
            strict: true,
            deprecationErrors: true
        }
    }).then(() => {
        console.log("Connected to MongoDB successfully");
        mongoose.connection.db.admin().ping()
            .then(() => console.log("MongoDB connection is responsive"))
            .catch(err => console.error("MongoDB ping failed:", err));
    }).catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

    // Handle connection events
    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
        setTimeout(() => {
            mongoose.connect(url).catch(err => 
                console.error("Reconnection failed:", err)
            );
        }, 5000);
    });

    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected');
    });

    // Handle process termination
    process.on('SIGINT', async () => {
        await mongoose.connection.close();
        process.exit(0);
    });
};