import React, { useState, useRef } from 'react';
import { Copy, AlertTriangle, Wand2, X, CheckCircle2, Sparkles, User, MapPin } from 'lucide-react';

export default function App() {
  // 状態管理
  const [selectedWords, setSelectedWords] = useState({
    how: '', // どんな
    who: '', // だれが
    where: '' // どこで
  });
  const [freeText, setFreeText] = useState('');
  const [copied, setCopied] = useState(false);

  // 用意する単語リスト（先生側で事前準備する想定ですが、今回は固定）
  const wordLists = {
    how: ['にじいろの', 'キラキラした', 'かっこいい', 'かわいい', 'おおきな', 'サイボーグの'],
    who: ['ねこ', 'きょうりゅう', 'ロボット', 'うさぎ', 'くるま', 'お城'],
    where: ['うちゅうで', 'うみの なかで', 'もりの なかで', 'おばけやしきで', 'そらの うえで']
  };

  // 単語を選択する関数
  const handleSelect = (category, word) => {
    setSelectedWords(prev => ({ ...prev, [category]: word }));
  };

  // 選択を解除する関数
  const handleRemove = (category) => {
    setSelectedWords(prev => ({ ...prev, [category]: '' }));
  };

  // 完成したプロンプトを生成する関数
  const generatePrompt = () => {
    const parts = [];
    if (selectedWords.how) parts.push(selectedWords.how);
    if (selectedWords.who) parts.push(selectedWords.who);
    if (selectedWords.where) parts.push(selectedWords.where);
    if (freeText) parts.push(freeText);

    return parts.join(' ');
  };

  // コピー機能
  const handleCopy = async () => {
    const textToCopy = generatePrompt();
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      // iframe環境などのフォールバック
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (e) {
        console.error('コピーに失敗しました', e);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4 md:p-8 font-sans text-gray-800">

      {/* ヘッダーとお約束 */}
      <header className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Wand2 className="w-10 h-10 text-purple-600" />
          <h1 className="text-3xl font-bold text-purple-800">まほうの ちゅうもんしょ</h1>
        </div>

        <div className="bg-red-100 border-l-8 border-red-500 p-4 rounded-r-lg flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
          <div>
            <h2 className="font-bold text-red-800 text-lg">【ぜったいのおやくそく】</h2>
            <p className="text-red-700 font-medium">
              じぶんの「なまえ」「じゅうしょ」や、おともだちの「ひみつ」は ぜったいに かかないでね！
            </p>
          </div>
        </div>
      </header>

      {/* メインコンテンツ：2カラムレイアウト（Chromebook向け） */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 左側：入力エリア */}
        <div className="space-y-6">

          {/* 選択エリア */}
          <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-blue-100">
            <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <span className="bg-blue-200 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center">1</span>
              ことばを えらぼう（ポチッと おす）
            </h2>

            <div className="space-y-6">
              {/* どんな */}
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <h3 className="text-md font-bold text-yellow-800 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-600" />
                  どんな（ようす）
                </h3>
                <div className="flex flex-wrap gap-2">
                  {wordLists.how.map(word => (
                    <button
                      key={word}
                      onClick={() => handleSelect('how', word)}
                      className={`px-4 py-2 rounded-full font-bold border-2 transition-all ${selectedWords.how === word
                          ? 'bg-yellow-400 border-yellow-500 text-yellow-900 scale-105 shadow-md'
                          : 'bg-white border-yellow-200 text-yellow-800 hover:bg-yellow-100 hover:border-yellow-300 shadow-sm'
                        }`}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>

              {/* だれが */}
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <h3 className="text-md font-bold text-green-800 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-green-600" />
                  だれが（なにが）
                </h3>
                <div className="flex flex-wrap gap-2">
                  {wordLists.who.map(word => (
                    <button
                      key={word}
                      onClick={() => handleSelect('who', word)}
                      className={`px-4 py-2 rounded-full font-bold border-2 transition-all ${selectedWords.who === word
                          ? 'bg-green-400 border-green-500 text-green-900 scale-105 shadow-md'
                          : 'bg-white border-green-200 text-green-800 hover:bg-green-100 hover:border-green-300 shadow-sm'
                        }`}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>

              {/* どこで */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <h3 className="text-md font-bold text-blue-800 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  どこで（ばしょ）
                </h3>
                <div className="flex flex-wrap gap-2">
                  {wordLists.where.map(word => (
                    <button
                      key={word}
                      onClick={() => handleSelect('where', word)}
                      className={`px-4 py-2 rounded-full font-bold border-2 transition-all ${selectedWords.where === word
                          ? 'bg-blue-400 border-blue-500 text-blue-900 scale-105 shadow-md'
                          : 'bg-white border-blue-200 text-blue-800 hover:bg-blue-100 hover:border-blue-300 shadow-sm'
                        }`}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 自由入力エリア */}
          <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-orange-100">
            <h2 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
              <span className="bg-orange-200 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center">2</span>
              じぶんで かこう（キーボードで うつ）
            </h2>
            <p className="text-sm text-gray-600 mb-2">「なにをしているところ」かを かいてみよう！</p>
            <input
              type="text"
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder="例：そらを とんで、わらっている"
              className="w-full text-lg p-4 border-4 border-orange-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
            />
          </div>

        </div>

        {/* 右側：プレビューとコピーエリア */}
        <div className="space-y-6">
          <div className="bg-purple-50 p-6 md:p-8 rounded-3xl shadow-lg border-4 border-purple-200 sticky top-6">
            <h2 className="text-2xl font-bold text-purple-800 mb-6 flex items-center gap-2">
              <span className="bg-purple-200 text-purple-800 w-10 h-10 rounded-full flex items-center justify-center text-xl">3</span>
              できあがった「じゅもん」
            </h2>

            {/* パズルブロックのプレビュー */}
            <div className="flex flex-wrap gap-2 mb-6 min-h-[60px] p-4 bg-white rounded-xl border-2 border-dashed border-purple-300 items-center">
              {selectedWords.how && (
                <span className="px-3 py-1 bg-yellow-300 text-yellow-900 rounded-lg font-bold flex items-center gap-1 shadow-sm">
                  {selectedWords.how}
                  <button onClick={() => handleRemove('how')} className="hover:bg-yellow-400 rounded-full p-1"><X size={14} /></button>
                </span>
              )}
              {selectedWords.who && (
                <span className="px-3 py-1 bg-green-300 text-green-900 rounded-lg font-bold flex items-center gap-1 shadow-sm">
                  {selectedWords.who}
                  <button onClick={() => handleRemove('who')} className="hover:bg-green-400 rounded-full p-1"><X size={14} /></button>
                </span>
              )}
              {selectedWords.where && (
                <span className="px-3 py-1 bg-blue-300 text-blue-900 rounded-lg font-bold flex items-center gap-1 shadow-sm">
                  {selectedWords.where}
                  <button onClick={() => handleRemove('where')} className="hover:bg-blue-400 rounded-full p-1"><X size={14} /></button>
                </span>
              )}
              {freeText && (
                <span className="px-3 py-1 bg-orange-300 text-orange-900 rounded-lg font-bold flex items-center gap-1 shadow-sm">
                  {freeText}
                  <button onClick={() => setFreeText('')} className="hover:bg-orange-400 rounded-full p-1"><X size={14} /></button>
                </span>
              )}

              {!selectedWords.how && !selectedWords.who && !selectedWords.where && !freeText && (
                <span className="text-gray-400 font-bold">ここに えらんだ ことばが ならぶよ</span>
              )}
            </div>

            {/* コピー用テキストボックス（読み取り専用・視覚的確認用） */}
            <div className="mb-6">
              <label className="text-sm font-bold text-gray-500 mb-2 block">これを Canva に はりつけるよ</label>
              <textarea
                readOnly
                value={generatePrompt()}
                className="w-full h-24 p-4 text-xl font-bold bg-white border-2 border-purple-300 rounded-xl focus:outline-none resize-none"
                placeholder="まだ じゅもんが ないよ"
              />
            </div>

            {/* コピーボタン */}
            <button
              onClick={handleCopy}
              disabled={!generatePrompt()}
              className={`w-full py-4 rounded-2xl font-bold text-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 ${!generatePrompt()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : copied
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-purple-600 text-white hover:bg-purple-500 hover:shadow-xl shadow-md'
                }`}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-8 h-8" />
                  コピーできたよ！
                </>
              ) : (
                <>
                  <Copy className="w-8 h-8" />
                  まほうの じゅもん を コピーする
                </>
              )}
            </button>
            <p className="text-center text-sm font-bold text-purple-600 mt-4">
              コピーしたら、Canvaの「Magic Media」に はりつけてね！
            </p>

          </div>
        </div>
      </main>
    </div>
  );
}
