using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using Music.Core.IServices;
using Recipes.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;


namespace Music.Service.services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task<bool> SendEmailAsync(EmailRequest request)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress("singsong", _configuration["SMTP:GOOGLE_USER_EMAIL"]));
            foreach (var recipient in request.To)
            {
                emailMessage.To.Add(new MailboxAddress(recipient, recipient));
            }
            emailMessage.Subject = request.Subject;

            var bodyBuilder = new BodyBuilder();
            bodyBuilder.HtmlBody = request.Body;
            emailMessage.Body = bodyBuilder.ToMessageBody();
            //var bodyBuilder = new BodyBuilder { TextBody = request.Body };
            //emailMessage.Body = bodyBuilder.ToMessageBody();

            using (var client = new SmtpClient())
            {
                try
                {
                    client.ServerCertificateValidationCallback = (s, c, h, e) => true;
                    Console.WriteLine("Connecting to SMTP server...");
                    await client.ConnectAsync(_configuration["SMTP:SMTP_SERVER"], int.Parse(_configuration["SMTP:PORT"]), SecureSocketOptions.SslOnConnect);
                    //await client.ConnectAsync(configuration["SMTP:SMTP_SERVER"], int.Parse(configuration["SMTP:PORT"]), MailKit.Security.SecureSocketOptions.StartTls);
                    Console.WriteLine("Authenticating...");
                    await client.AuthenticateAsync(_configuration["SMTP:GOOGLE_USER_EMAIL"], _configuration["SMTP:PASSWORD"]);
                    Console.WriteLine("Sending email...");
                    await client.SendAsync(emailMessage);
                    Console.WriteLine("Email sent successfully.");
                    await client.DisconnectAsync(true);
                    return true;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                    return false;
                }
            }

        }

    }
}
