export interface IOtpProvider {
    sendOtp(phone: string, otp: string): Promise<boolean>;
}

export class DummyOtpProvider implements IOtpProvider {
    async sendOtp(phone: string, otp: string): Promise<boolean> {
        console.log(`📱 [DEV MODE] OTP for ${phone}: ${otp}`);
        // In production, replace with actual SMS provider (Twilio, MSG91, AWS SNS, etc.)
        return true;
    }
}

// Export singleton instance
export const otpProvider = new DummyOtpProvider();
