const envs = {
    cloudinary: {
        url: process.env.CLOUDINARY_URL,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET
    }, 
    
    admin: {
        loginKey: process.env.ADMIN_LOGIN_TOKEN,
        email: process.env.ADMIN_EMAIL
    }
}

export default envs;