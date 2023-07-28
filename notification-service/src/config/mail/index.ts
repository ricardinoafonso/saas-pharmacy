export default {
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    secure: true,
    auth:{
        username: process.env.MAILER_USERNAME,
        pass: process.env.PASS_MAILER
    }
}