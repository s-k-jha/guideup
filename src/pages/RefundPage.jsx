export default function RefundPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">

      <h1 className="text-3xl font-bold mb-8">Refund Policy</h1>

      <p className="text-gray-600 mb-6">
        At GuideUp, we strive to provide valuable mock interview experiences.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Session Cancellation</h2>
      <p className="text-gray-600">
        If you cancel your session at least 24 hours before the scheduled time, you may request rescheduling.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Refund Eligibility</h2>
      <p className="text-gray-600">
        Refunds may be provided in cases where the session could not be conducted due to technical or operational issues from our side.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Non-Refundable Cases</h2>
      <p className="text-gray-600">
        Once a session has been completed, payments are non-refundable.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Contact for Refund Requests</h2>
      <p className="text-gray-600">
        For refund requests, please contact connect.azsolutions@gmail.com
      </p>

      <p className="text-gray-500 text-sm mt-10">
        Last updated: {new Date().getFullYear()}
      </p>

    </div>
  )
}