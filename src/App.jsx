import React, { useState, useEffect } from 'react';
import { Copy, AlertTriangle, Wand2, X, CheckCircle2, Sparkles, User, MapPin, Settings, Lock, Save, LogOut } from 'lucide-react';

const DEFAULT_WORD_LISTS = {
  how: ['にじいろの', 'キラキラした', 'かっこいい', 'かわいい', 'おおきな', 'サイボーグの'],
  who: ['ねこ', 'きょうりゅう', 'ロボット', 'うさぎ', 'くるま', 'お城'],
  where: ['うちゅうで', 'うみの なかで', 'もりの なかで', 'おばけやしきで', 'そらの うえで']
};

export default function App() {
  // 状態管理
  const [wordLists, setWordLists] = useState(() => {
    const saved = localStorage.getItem('gazouseisei_word_lists');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_WORD_LISTS;
      }
    }
    return DEFAULT_WORD_LISTS;
  });

  const [selectedWords, setSelectedWords] = useState({
    how: '', // どんな
    who: '', // だれが
    where: '' // どこで
  });
  const [freeText, setFreeText] = useState('');
  const [copied, setCopied] = useState(false);

  // 管理者モードの状態
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // 編集用の状態
  const [editingWords, setEditingWords] = useState({
    how: '',
    who: '',
    where: ''
  });

  // 単語リストが更新されたらlocalStorageに保存
  useEffect(() => {
    localStorage.setItem('gazouseisei_word_lists', JSON.stringify(wordLists));
  }, [wordLists]);

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

  // 管理者ログイン処理
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (passwordInput === '0807') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setPasswordInput('');
      setLoginError('');
      // 編集用の状態を初期化
      setEditingWords({
        how: wordLists.how.join('\n'),
        who: wordLists.who.join('\n'),
        where: wordLists.where.join('\n')
      });
    } else {
      setLoginError('パスワードが違います');
    }
  };

  // 管理者ログアウト
  const handleAdminLogout = () => {
    setIsAdmin(false);
  };

  // 設定を保存
  const handleSaveSettings = () => {
    const parseWords = (text) => text.split('\n').map(w => w.trim()).filter(w => w !== '');

    setWordLists({
      how: parseWords(editingWords.how),
      who: parseWords(editingWords.who),
      where: parseWords(editingWords.where)
    });

    // 選択状態をリセット
    setSelectedWords({ how: '', who: '', where: '' });

    alert('設定を保存しました');
  };

  // 管理者ログイン画面のレンダリング
  if (showAdminLogin) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full relative">
          <button
            onClick={() => {
              setShowAdminLogin(false);
              setPasswordInput('');
              setLoginError('');
            }}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>

          <div className="flex flex-col items-center mb-6">
            <div className="bg-purple-100 p-3 rounded-full mb-4">
              <Lock className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">管理者ログイン</h2>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="パスワードを入力"
                autoFocus
              />
              {loginError && <p className="text-red-500 text-sm mt-1">{loginError}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              ログイン
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 管理者設定画面のレンダリング
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-800">管理者設定：単語リスト編集</h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAdminLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                <LogOut size={18} />
                一般画面に戻る
              </button>
              <button
                onClick={handleSaveSettings}
                className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-bold shadow-md"
              >
                <Save size={18} />
                保存する
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
            <p className="text-yellow-800 text-sm">
              各項目に表示する単語を編集できます。<strong>1行に1つの単語</strong>を入力してください。
              変更後は右上の「保存する」ボタンを押してください。（保存すると、現在トップ画面で選択中の単語はリセットされます）
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* どんな */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-yellow-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-600" />
                どんな（ようす）
              </h3>
              <textarea
                value={editingWords.how}
                onChange={(e) => setEditingWords({ ...editingWords, how: e.target.value })}
                className="w-full h-80 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none resize-y"
                placeholder="例：&#13;&#10;にじいろの&#13;&#10;キラキラした"
              />
            </div>

            {/* だれが */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                だれが（なにが）
              </h3>
              <textarea
                value={editingWords.who}
                onChange={(e) => setEditingWords({ ...editingWords, who: e.target.value })}
                className="w-full h-80 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none resize-y"
                placeholder="例：&#13;&#10;ねこ&#13;&#10;きょうりゅう"
              />
            </div>

            {/* どこで */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                どこで（ばしょ）
              </h3>
              <textarea
                value={editingWords.where}
                onChange={(e) => setEditingWords({ ...editingWords, where: e.target.value })}
                className="w-full h-80 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y"
                placeholder="例：&#13;&#10;うちゅうで&#13;&#10;うみの なかで"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 一般画面のレンダリング
  return (
    <div className="min-h-screen bg-blue-50 p-4 md:p-8 font-sans text-gray-800 relative">

      {/* 管理者設定ボタン（右上に配置） */}
      <button
        onClick={() => setShowAdminLogin(true)}
        className="absolute top-4 right-4 md:top-8 md:right-8 text-gray-400 hover:text-purple-600 transition-colors p-2 rounded-full hover:bg-purple-100"
        title="管理者設定"
      >
        <Settings size={24} />
      </button>

      {/* ヘッダーとお約束 */}
      <header className="max-w-6xl mx-auto mb-6 pt-8 md:pt-0">
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
                  {wordLists.how.map((word, idx) => (
                    <button
                      key={`how-${idx}`}
                      onClick={() => handleSelect('how', word)}
                      className={`px-4 py-2 rounded-full font-bold border-2 transition-all ${selectedWords.how === word
                        ? 'bg-yellow-400 border-yellow-500 text-yellow-900 scale-105 shadow-md'
                        : 'bg-white border-yellow-200 text-yellow-800 hover:bg-yellow-100 hover:border-yellow-300 shadow-sm'
                        }`}
                    >
                      {word}
                    </button>
                  ))}
                  {wordLists.how.length === 0 && <span className="text-sm text-gray-500">単語がありません</span>}
                </div>
              </div>

              {/* だれが */}
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <h3 className="text-md font-bold text-green-800 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-green-600" />
                  だれが（なにが）
                </h3>
                <div className="flex flex-wrap gap-2">
                  {wordLists.who.map((word, idx) => (
                    <button
                      key={`who-${idx}`}
                      onClick={() => handleSelect('who', word)}
                      className={`px-4 py-2 rounded-full font-bold border-2 transition-all ${selectedWords.who === word
                        ? 'bg-green-400 border-green-500 text-green-900 scale-105 shadow-md'
                        : 'bg-white border-green-200 text-green-800 hover:bg-green-100 hover:border-green-300 shadow-sm'
                        }`}
                    >
                      {word}
                    </button>
                  ))}
                  {wordLists.who.length === 0 && <span className="text-sm text-gray-500">単語がありません</span>}
                </div>
              </div>

              {/* どこで */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <h3 className="text-md font-bold text-blue-800 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  どこで（ばしょ）
                </h3>
                <div className="flex flex-wrap gap-2">
                  {wordLists.where.map((word, idx) => (
                    <button
                      key={`where-${idx}`}
                      onClick={() => handleSelect('where', word)}
                      className={`px-4 py-2 rounded-full font-bold border-2 transition-all ${selectedWords.where === word
                        ? 'bg-blue-400 border-blue-500 text-blue-900 scale-105 shadow-md'
                        : 'bg-white border-blue-200 text-blue-800 hover:bg-blue-100 hover:border-blue-300 shadow-sm'
                        }`}
                    >
                      {word}
                    </button>
                  ))}
                  {wordLists.where.length === 0 && <span className="text-sm text-gray-500">単語がありません</span>}
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
