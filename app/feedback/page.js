// app/feedback/page.js
export default function FeedbackPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Send Feedback</h1>
      <div className="max-w-2xl">
        <textarea
          className="w-full bg-[#272727] border border-[#3f3f3f] rounded-lg p-4 text-white outline-none focus:border-blue-500 min-h-[200px]"
          placeholder="Tell us what you think..."
        />
        <button className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full text-sm font-medium transition">
          Submit Feedback
        </button>
      </div>
    </div>
  );
}