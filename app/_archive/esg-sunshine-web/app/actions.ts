'use server';

import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : ['service@esgsunshine.com'];

export type ActionResponse = {
    success: boolean;
    message?: string;
    error?: unknown;
};

export async function subscribeNewsletter(email: string): Promise<ActionResponse> {
    try {
        // 1. Insert into Supabase
        // Table: esg_sunshine_newsletter_subscribers
        const { error } = await supabase
            .from('esg_sunshine_newsletter_subscribers')
            .insert([{ email, source: 'homepage_bar' }]);

        if (error) {
            if (error.code === '23505') { // Unique violation
                return { success: true, message: 'Already subscribed' };
            }
            console.error('Supabase newsletter insert error:', error);
            throw new Error(error.message);
        }

        // 2. Send Emails
        try {
            // To Admin
            await resend.emails.send({
                from: 'ESG Sunshine Website <noreply@esgsunshine.com>',
                to: adminEmails,
                subject: 'New Newsletter Subscription',
                html: `
                    <h1>New Newsletter Subscription</h1>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Source:</strong> Homepage Bar</p>
                `,
            });

            // To Subscriber
            await resend.emails.send({
                from: 'ESG Sunshine Team <noreply@esgsunshine.com>',
                to: [email],
                subject: '訂閱成功 / Subscription Confirmed',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #059669;">訂閱成功 / Subscription Confirmed</h2>
                        <p>感謝您訂閱 ESG Sunshine 電子報！</p>
                        <p>我們將不定期發送最新的 ESG 趨勢與課程資訊給您。</p>
                        <hr style="border: 1px solid #eee; margin: 20px 0;" />
                        <p>Thank you for subscribing to ESG Sunshine Newsletter!</p>
                        <p>We will keep you updated with the latest ESG trends and course information.</p>
                    </div>
                `,
            });
        } catch (emailError) {
            console.error('Newsletter email sending failed:', emailError);
            // Non-critical if email fails but DB succeeds
        }

        return { success: true };
    } catch (error) {
        console.error('Newsletter Error:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Subscription failed"
        };
    }
}

export type ContactFormData = {
    name: string;
    job_title?: string;
    email: string;
    phone?: string;
    company_name?: string;
    subject: string;
    message: string;
};

export async function submitContactMessage(data: ContactFormData): Promise<ActionResponse> {
    try {
        // 1. Insert into Supabase
        // Table: esg_sunshine_contact_messages
        const dbData = {
            name: data.name,
            job_title: data.job_title,
            email: data.email,
            phone: data.phone,
            company_name: data.company_name,
            subject: data.subject,
            message: data.message,
            status: 'new'
        };

        const { error } = await supabase
            .from('esg_sunshine_contact_messages')
            .insert([dbData]);

        if (error) {
            console.error('Supabase contact insert error:', error);
            throw new Error(error.message);
        }

        // 2. Send Emails
        try {
            // To Admin
            await resend.emails.send({
                from: 'ESG Sunshine Website <noreply@esgsunshine.com>',
                to: adminEmails,
                subject: `New Contact Message: ${data.subject}`,
                html: `
                    <h1>New Contact Message</h1>
                    <p><strong>Name:</strong> ${data.name}</p>
                    <p><strong>subject:</strong> ${data.subject}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                    <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
                    <p><strong>Company:</strong> ${data.company_name || 'N/A'}</p>
                    <p><strong>Job Title:</strong> ${data.job_title || 'N/A'}</p>
                    <hr />
                    <h3>Message:</h3>
                    <p style="white-space: pre-wrap;">${data.message}</p>
                `,
            });

            // To Sender
            await resend.emails.send({
                from: 'ESG Sunshine Team <noreply@esgsunshine.com>',
                to: [data.email],
                subject: '我們已收到您的訊息 / We have received your message',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #059669;">訊息確認 / Message Received</h2>
                        <p>親愛的 ${data.name} 您好：</p>
                        <p>感謝您的來信。我們已收到您的訊息，將儘快安排專人回覆您。</p>
                        <hr style="border: 1px solid #eee; margin: 20px 0;" />
                        <p>Dear ${data.name},</p>
                        <p>Thank you for contacting us. We have received your message and will get back to you shortly.</p>
                        
                         <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 20px;">
                            <p style="margin: 0; color: #666; font-size: 14px;"><strong>Your Message:</strong></p>
                            <p style="margin-top: 5px; font-style: italic;">${data.message}</p>
                        </div>
                    </div>
                `,
            });
        } catch (emailError) {
            console.error('Contact email sending failed:', emailError);
        }

        return { success: true };
    } catch (error) {
        console.error('Contact Action Error:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Submission failed"
        };
    }
}
