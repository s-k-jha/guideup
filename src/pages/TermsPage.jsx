export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">

      <h1 className="text-3xl font-bold mb-8">Terms & Conditions</h1>

      <p className="text-gray-600 mb-6">
        Welcome to GuideUp. By accessing or using our platform, you agree to the following terms.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">1. Service</h2>
      <p className="text-gray-600">
        GuideUp provides mock interview sessions conducted by experienced professionals to help students prepare for technical interviews.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">2. Booking</h2>
      <p className="text-gray-600">
        Users can book interview sessions through our website. Once a session is confirmed, the booking details will be sent via email.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">3. Payments</h2>
      <p className="text-gray-600">
        Payments for sessions are processed securely through Razorpay. GuideUp does not store your payment details.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">4. User Responsibility</h2>
      <p className="text-gray-600">
        Users must provide accurate information while booking sessions and attend the session at the scheduled time.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">5. Changes to Terms</h2>
      <p className="text-gray-600">
        GuideUp reserves the right to update these terms at any time.
      </p>

      <p className="text-gray-500 text-sm mt-10">
        Last updated: {new Date().getFullYear()}
      </p>

    </div>
  )
}