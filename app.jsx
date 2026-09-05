const { useState } = React;

function SocialMediaGenerator() {
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const generateContent = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic or product.");
      return;
    }

    setLoading(true);
    setError("");
    setContent(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          niche,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setContent(data);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);

      setTimeout(() => {
        setCopied("");
      }, 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const downloadAsJSON = () => {
    if (!content) return;

    const dataStr = JSON.stringify(content, null, 2);
    const blob = new Blob([dataStr], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "social-media-content.json";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Social Media Content Generator
              </h1>

              <p className="text-gray-500 text-sm">
                AI-powered content ideas, captions, hashtags & strategy
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* Input Section */}
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-10">
          
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Generate Your Content
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic / Product
              </label>

              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Coffee shop, AI course, Fitness app"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>

            {/* Niche */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niche / Industry
              </label>

              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. Food, Technology, Fitness"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>

          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              {error}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={generateContent}
            disabled={loading}
            className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 rounded-xl hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Generating Content..." : "✨ Generate AI Content"}
          </button>

        </section>

        {/* Results */}
        {content && (
          <div className="space-y-8">

            {/* Post Ideas */}
            <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">

              <h2 className="text-xl font-bold text-gray-900 mb-6">
                💡 Post Ideas
              </h2>

              <div className="grid md:grid-cols-3 gap-5">

                {content.postIdeas?.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
                  >
                    <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center font-bold mb-4">
                      {index + 1}
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2">
                      {item.idea}
                    </h3>

                    <p className="text-gray-600 text-sm">
                      {item.description}
                    </p>
                  </div>
                ))}

              </div>
            </section>

            {/* Captions */}
            <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  ✍️ Captions
                </h2>
              </div>

              <div className="space-y-4">

                {content.captions?.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-5"
                  >

                    <div className="flex justify-between gap-4">

                      <p className="text-gray-700 leading-relaxed">
                        {item.caption}
                      </p>

                      <button
                        onClick={() =>
                          copyToClipboard(
                            item.caption,
                            `caption-${index}`
                          )
                        }
                        className="shrink-0 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-100"
                      >
                        {copied === `caption-${index}`
                          ? "Copied!"
                          : "Copy"}
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            </section>

            {/* Hashtags */}
            <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">

              <h2 className="text-xl font-bold text-gray-900 mb-6">
                #️⃣ Hashtags
              </h2>

              <div className="flex flex-wrap gap-3">

                {content.hashtags?.map((tag, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      copyToClipboard(tag, `tag-${index}`)
                    }
                    className="px-4 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-sm hover:bg-purple-100"
                  >
                    {copied === `tag-${index}`
                      ? "Copied!"
                      : `#${tag.replace(/^#/, "")}`}
                  </button>
                ))}

              </div>
            </section>

            {/* Content Types */}
            <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">

              <h2 className="text-xl font-bold text-gray-900 mb-6">
                📱 Content Types
              </h2>

              <div className="grid md:grid-cols-2 gap-5">

                {content.contentTypes?.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-5"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {item.type}
                    </h3>

                    <p className="text-gray-600 text-sm">
                      {item.description}
                    </p>
                  </div>
                ))}

              </div>
            </section>

            {/* Content Plan */}
            <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">

              <h2 className="text-xl font-bold text-gray-900 mb-6">
                📅 4-Week Content Plan
              </h2>

              <div className="grid md:grid-cols-2 gap-6">

                {Object.entries(content.contentPlan || {}).map(
                  ([week, plan]) => (
                    <div
                      key={week}
                      className="border border-gray-200 rounded-xl p-6"
                    >

                      <h3 className="text-lg font-bold text-purple-700 capitalize mb-2">
                        {week.replace("week", "Week ")}
                      </h3>

                      <p className="font-medium text-gray-900 mb-4">
                        Theme: {plan.theme}
                      </p>

                      <ul className="space-y-2">
                        {plan.posts?.map((post, index) => (
                          <li
                            key={index}
                            className="flex gap-2 text-sm text-gray-600"
                          >
                            <span className="text-purple-600 font-bold">
                              •
                            </span>

                            <span>{post}</span>
                          </li>
                        ))}
                      </ul>

                    </div>
                  )
                )}

              </div>
            </section>

            {/* Download */}
            <section className="flex justify-center">

              <button
                onClick={downloadAsJSON}
                className="px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition"
              >
                ⬇️ Download Content as JSON
              </button>

            </section>

          </div>
        )}

        {/* Empty State */}
        {!content && !loading && (
          <section className="text-center py-16">

            <div className="text-6xl mb-5">
              🚀
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Ready to Create Amazing Content?
            </h2>

            <p className="text-gray-500 max-w-xl mx-auto">
              Enter your topic and niche above to generate AI-powered
              social media content in seconds.
            </p>

          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center">
          <p className="text-sm text-gray-500">
            Built with React, Node.js, Express & Claude AI
          </p>
        </div>
      </footer>

    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <SocialMediaGenerator />
);
