require('dotenv').config()
const nodemailer = require('nodemailer')

let sendSimpleEmail = async dataSend => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    })
    const info = await transporter.sendMail({
        from: '"Quốc Vũ👻" <nguyenquocvu003.email>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: 'THÔNG TIN ĐẶT LỊCH KHÁM BỆNH ✔', // Subject line
        html: getBodyHTMLEmail(dataSend),
    })
}
let getBodyHTMLEmail = dataSend => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được Email này vì đã đặt lịch khám bệnh Online</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

        <p>Nếu các thông tin trên là đúng, vui lòng nhấn vào đường dẫn bên dưới để 
        xác nhận và hoàn tất thủ tục đặt lịch khám bệnh</p>
        <a href="${dataSend.redirectlink} target="_blank">Nhấn vào đây</a>

        <div>Xin chân thành cảm ơn!</div>
        `
    }
    if (dataSend.language === 'en') {
        result = `
        <h3>Hello ${dataSend.patientName}!</h3>
        <p>You are receiving this email because you have scheduled an online medical appointment.</p>
        <p>Appointment details:</p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>

        <p>If the above information is correct, please click on the link below to 
        confirm and complete the appointment booking procedure.</p>
        <a href="${dataSend.redirectlink}" target="_blank">Click here</a>

        <div>Thank you very much!</div>

        `
    }
    return result
}
let sendAttchment = dataSend => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    })
    const info = transporter.sendMail({
        from: '"Quốc Vũ👻" <nguyenquocvu003.email>', // sender address
        to: dataSend.email, // list of receivers
        subject: 'KẾT QUẢ KHÁM BỆNH ✔', // Subject line
        html: getEmailRemedy(dataSend),
        attachments: [
            {
                filename: `Remedy.png`,
                content: dataSend.imgBase64.split('base64')[1],
                encoding: 'base64',
            },
        ],
    })
}
let getEmailRemedy = dataSend => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName} !</h3>
        
        <p>Thông tin đơn thuốc :</p>
    
        <div>Xin chân thành cảm ơn!</div>
        `
    }
    if (dataSend.language === 'en') {
        result = `
        <h3>Hello ${dataSend.patientName}!</h3>

        <p>Remedy details:</p>

        <div>Thank you very much!</div>

        `
    }
    return result
}
export default { sendSimpleEmail, sendAttchment }
