import React, { useState } from 'react';

export default function SocialMediaGenerator() {
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generateContent = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic or niche');
      return;
    }

    setLoading(true);
    setError('');
    setContent(null);

    try {
      const prompt = `You are an expert social media content strategist specializing in Instagram. Generate comprehensive social media content for the following:

Topic/Product: ${topic}
${niche ? `Niche/Industry: ${niche}` : ''}

Please provide ONLY valid JSON output (no markdown, no code blocks) with this exact structure:
{
  "postIdeas": [
    {"id": 1, "idea": "...", "description": "..."},
    {"id": 2, "idea": "...", "description": "..."},
    {"id": 3, "idea": "...", "description": "..."}
  ],
  "captions": [
    {"caption": "..."},
    {"caption": "..."},
    {"caption": "..."}
  ],
  "hashtags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10"],
  "contentTypes": [
    {"type": "...", "description": "..."},
    {"type": "...", "description": "..."},
    {"type": "...", "description": "..."},
    {"type": "...", "description": "..."}
  ],
  "contentPlan": {
    "week1": {"theme": "...", "posts": ["...", "...", "..."]},
    "week2": {"theme": "...", "posts": ["...", "...", "..."]},
    "week3": {"theme": "...", "posts": ["...", "...", "..."]},
    "week4": {"theme": "...", "posts": ["...", "...", "..."]}
  }
}`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 2000,
          messages: [
            { role: 'user', content: prompt }
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      const responseText = data.content[0].text;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('Invalid response format');
      }

      const generatedContent = JSON.parse(jsonMatch[0]);
      setContent(generatedContent);
    } catch (err) {
      setError(err.message || 'Failed to generate content. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsJSON = () => {
    const dataStr = JSON.stringify(content, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `social-media-content-${Date.now()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8 px-4 shadow-2xl">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">✨</span>
            <h1 className="text-4xl font-bold">Social Media Content Generator</h1>
          </div>
          <p className="text-purple-100">Generate professional Instagram content ideas, captions, and content plans powered by AI</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Create Your Content Strategy</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Topic or Product <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Sustainable Fashion, Coffee Shop, Fitness App"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none transition text-slate-800"
                onKeyPress={(e) => e.key === 'Enter' && generateContent()}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Niche or Industry (Optional)
              </label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g., B2B SaaS, Beauty & Wellness, Tech"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none transition text-slate-800"
                onKeyPress={(e) => e.key === 'Enter' && generateContent()}
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={generateContent}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Generating Content...
                </>
              ) : (
                <>
                  <span>✨</span>
                  Generate Content Strategy
                </>
              )}
            </button>
          </div>
        </div>

        {content && (
          <div className="space-y-8">
            <div className="flex gap-3 justify-end">
              <button
                onClick={downloadAsJSON}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition"
              >
                📥 Download JSON
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">📸 Instagram Post Ideas</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {content.postIdeas.map((idea) => (
                  <div key={idea.id} className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-100 rounded-xl p-5 hover:shadow-lg transition">
                    <h3 className="font-bold text-slate-800 mb-2">{idea.idea}</h3>
                    <p className="text-slate-600 text-sm">{idea.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">✍️ Caption Ideas</h2>
              <div className="space-y-3">
                {content.captions.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4 hover:border-purple-300 transition group">
                    <p className="text-slate-700 text-sm leading-relaxed mb-3">{item.caption}</p>
                    <button
                      onClick={() => copyToClipboard(item.caption)}
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-700 text-xs font-semibold opacity-0 group-hover:opacity-100 transition"
                    >
                      📋 {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">#️⃣ Recommended Hashtags</h2>
              <div className="flex flex-wrap gap-3">
                {content.hashtags.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => copyToClipboard(`#${tag}`)}
                    className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold transition cursor-pointer"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">🎬 Content Types to Create</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.contentTypes.map((item, idx) => (
                  <div key={idx} className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
                    <h3 className="font-bold text-slate-800 mb-2">{item.type}</h3>
                    <p className="text-slate-600 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">📅 4-Week Content Plan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(content.contentPlan).map(([week, data]) => (
                  <div key={week} className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                    <h3 className="font-bold text-slate-800 mb-1 capitalize">{week}</h3>
                    <p className="text-sm text-slate-600 font-semibold mb-3">Theme: {data.theme}</p>
                    <ul className="space-y-2">
                      {data.posts.map((post, idx) => (
                        <li key={idx} className="text-sm text-slate-700 flex gap-2">
                          <span className="text-green-600">•</span>
                          <span>{post}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!content && !loading && (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
            <span className="text-6xl block mb-4">✨</span>
            <p className="text-slate-500 text-lg">Enter a topic above to generate your social media content strategy</p>
          </div>
        )}
      </div>

      <div className="bg-slate-800 text-slate-400 text-center py-6 mt-12 border-t border-slate-700">
        <p className="text-sm">Professional Social Media Content Generator • Powered by AI</p>
      </div>
    </div>
  );
}
