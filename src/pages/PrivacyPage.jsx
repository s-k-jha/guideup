export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">

      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

      <p className="text-gray-600 mb-6">
        GuideUp respects your privacy and is committed to protecting your personal information.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Information We Collect</h2>
      <p className="text-gray-600">
        We may collect your name, email address, and other information necessary for booking interview sessions.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">How We Use Information</h2>
      <p className="text-gray-600">
        Your information is used to manage bookings, send confirmation emails, and improve our services.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Payment Information</h2>
      <p className="text-gray-600">
        Payments are processed securely via Razorpay. GuideUp does not store your payment card details.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Data Protection</h2>
      <p className="text-gray-600">
        We take reasonable measures to protect your information from unauthorized access.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Contact</h2>
      <p className="text-gray-600">
        If you have questions about this privacy policy, please contact us at connect.azsolutions@gmail.com
      </p>

      <p className="text-gray-500 text-sm mt-10">
        Last updated: {new Date().getFullYear()}
      </p>

    </div>
  )
}