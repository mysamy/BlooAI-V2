// utiliser nodemailer et mes identifiants mails pour menvoyer un mail a moi meme en le fesant sous la forme d'un fonction node.js
// lidee etant est de taper la barre de saisie dans le terminal node nomdufichier


import nodemailer from "nodemailer"
import 'dotenv/config'


const envoyer = nodemailer.createTransport({
	host: "smtp.office365.com",
	port: 587,
	secure:false,
	auth: {
		user: "benhamidasamy@hotmail.fr",
		pass: process.env.MOTDEPASSE,
	},
});


	try {
		const info = await envoyer.sendMail({
		from: '"samy ben hamida" <benhamidasamy@hotmail.fr>',
		to: "benhamidasamy@hotmail.fr", 
		subject: "bonjour",
		text:"test email",
		html:"<b>testtt</b>",
	})
	console.log("message enovyer", info.messageId);
	}
	catch (err) {
		   console.error("Erreur :", err);
		   console.log('erreur');
		   
	    }
	



