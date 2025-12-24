(function() {
    // 1. CARREGAR DEPENDÊNCIAS
    const tailwind = document.createElement('script');
    tailwind.src = "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4";
    document.head.appendChild(tailwind);

    const firebaseScript = document.createElement('script');
    firebaseScript.type = 'module';
    firebaseScript.textContent = `
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
        import { getDatabase, ref, set, push, onValue, update, increment, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

        const firebaseConfig = {
            apiKey: "AIzaSyAMHAKVot044psR421B_t-Ht5EmsueVS8A",
            authDomain: "game-dev-space.firebaseapp.com",
            databaseURL: "https://game-dev-space-default-rtdb.firebaseio.com",
            projectId: "game-dev-space",
            storageBucket: "game-dev-space.firebasestorage.app",
            messagingSenderId: "1073185335190",
            appId: "1:1073185335190:web:ae9ffd88cdf89f53cbdfb7"
        };

        const app = initializeApp(firebaseConfig);
        window.fbDB = getDatabase(app);
        window.fbLib = { ref, set, push, onValue, update, increment, remove };
        window.initApp();
    `;
    document.head.appendChild(firebaseScript);

    // 2. CSS COMPLETO
    const style = document.createElement('style');
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@900&family=Rajdhani:wght@500;700&display=swap');
        body { font-family: 'Rajdhani', sans-serif; background: #0b0915; color: white; margin: 0; overflow-x: hidden; user-select: none; }
        .glass { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(15px); border: 1px solid rgba(139, 92, 246, 0.2); }
        .btn-neon { background: #8b5cf6; color: white; font-weight: 900; cursor: pointer; box-shadow: 0 0 15px rgba(139, 92, 246, 0.3); border:none; }
        .section-title { font-family: 'Orbitron'; font-size: 14px; color: #8b5cf6; display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
        .section-title::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, rgba(139, 92, 246, 0.3), transparent); }
        @keyframes moveUp { 0% { transform: translateY(100%); opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { transform: translateY(-150%); opacity: 0; } }
        .hidden { display: none !important; }
    `;
    document.head.appendChild(style);

    // 3. ESTRUTURA HTML
    document.body.innerHTML = `
        <div id="intro-screen" style="position:fixed; inset:0; background:#000; z-index:9999; display:flex; flex-direction:column; align-items:center; justify-content:center;">
            <div style="font-family:'Orbitron'; font-size:120px; color:#8b5cf6; text-shadow:0 0 20px #8b5cf6;">G</div>
            <div style="height:100px; overflow:hidden; position:relative; width:300px; text-align:center;">
                <div style="animation: moveUp 6s linear infinite;">
                    <p style="color:#8b5cf6; font-size:10px; font-weight:bold;">DEVELOPERS: BYTEZT & JHOSSMINE2</p>
                    <p style="color:#fff; font-size:14px; font-weight:900;">PRODUCERS: EXILED OWNER & CHAD</p>
                </div>
            </div>
        </div>

        <div id="main-hub" class="hidden">
            <header class="p-5 flex justify-between items-center glass sticky top-0 z-50">
                <h1 style="font-family:'Orbitron'" class="text-xl text-purple-500 italic font-black">GAMEDEV SPACE</h1>
                <button id="open-upload" class="btn-neon px-6 py-2 rounded-full text-[10px] uppercase italic">🚀 Publicar</button>
            </header>
            <main class="container mx-auto p-8">
                <div id="banner" class="w-full h-[200px] rounded-[30px] bg-gradient-to-r from-purple-900/20 to-black mb-16 border border-white/5"></div>
                <section><h2 class="section-title">🏆 DESTAQUES</h2><div id="grid-highlights" class="grid grid-cols-1 md:grid-cols-4 gap-6"></div></section>
                <section class="mt-16"><h2 class="section-title">✨ RECENTES</h2><div id="grid-recent" class="grid grid-cols-1 md:grid-cols-4 gap-6"></div></section>
                <section class="mt-16"><h2 class="section-title">🎮 TODOS</h2><div id="grid-all" class="grid grid-cols-1 md:grid-cols-4 gap-6"></div></section>
            </main>
        </div>

        <div id="viewer" class="hidden fixed inset-0 z-[1000] bg-black flex flex-col">
            <div class="p-4 glass flex justify-between">
                <button onclick="location.reload()" class="bg-red-600 px-4 py-2 rounded text-[10px] font-black">VOLTAR</button>
                <button id="unlock-btn" class="bg-yellow-600 px-4 py-2 rounded text-[10px] font-black">🔓 LIBERAR JOGO</button>
            </div>
            <div class="flex-1 relative">
                <div id="shield" style="position:absolute; inset:0; z-index:10;"></div>
                <iframe id="frame" class="w-full h-full bg-white border-none"></iframe>
            </div>
        </div>

        <div id="upload-modal" class="hidden fixed inset-0 bg-black/90 z-[10000] flex items-center justify-center p-4">
            <div class="glass p-8 rounded-[30px] w-full max-w-lg">
                <h2 class="font-orbitron text-purple-500 mb-4">NOVO PROJETO</h2>
                <input id="up-name" placeholder="Nome" class="w-full bg-white/5 p-3 rounded-xl mb-3 border border-white/10 text-white">
                <select id="up-type" class="w-full bg-black p-3 rounded-xl mb-3 text-purple-400">
                    <option value="url">Link</option>
                    <option value="code">Código HTML</option>
                </select>
                <textarea id="up-content" placeholder="Conteúdo..." class="w-full bg-white/5 p-3 rounded-xl h-24 mb-4 text-white border border-white/10"></textarea>
                <button id="save-btn" class="w-full btn-neon py-3 rounded-xl font-black">POSTAR</button>
                <button onclick="document.getElementById('upload-modal').classList.add('hidden')" class="w-full text-[10px] mt-4 opacity-50">FECHAR</button>
            </div>
        </div>
    `;

    // 4. LÓGICA DE FUNCIONAMENTO
    window.initApp = () => {
        setTimeout(() => {
            document.getElementById('intro-screen').classList.add('hidden');
            document.getElementById('main-hub').classList.remove('hidden');
        }, 5000);

        // Bind de botões
        document.getElementById('open-upload').onclick = () => document.getElementById('upload-modal').classList.remove('hidden');
        document.getElementById('unlock-btn').onclick = () => {
            document.getElementById('shield').style.display = 'none';
            document.getElementById('unlock-btn').innerText = "🎮 JOGANDO";
        };
        document.getElementById('save-btn').onclick = window.enviarJogo;

        window.loadGames();
    };

    window.enviarJogo = () => {
        const name = document.getElementById('up-name').value;
        const type = document.getElementById('up-type').value;
        const content = btoa(document.getElementById('up-content').value);
        if(!name || !content) return;

        const { ref, push, set } = window.fbLib;
        set(push(ref(window.fbDB, 'games')), {
            name, type, content, likes: 0, timestamp: Date.now(), author: "Dev"
        }).then(() => location.reload());
    };

    window.loadGames = () => {
        window.fbLib.onValue(window.fbLib.ref(window.fbDB, 'games'), snap => {
            const data = snap.val(); if(!data) return;
            const games = Object.keys(data).map(id => ({id, ...data[id]}));
            
            const render = (containerId, list) => {
                const el = document.getElementById(containerId);
                el.innerHTML = "";
                list.forEach(g => {
                    const card = document.createElement('div');
                    card.className = "p-4 glass rounded-[20px] cursor-pointer hover:scale-105 transition-all";
                    card.innerHTML = `<div class="w-full h-32 bg-purple-900/20 rounded-xl mb-2"></div><div class="flex justify-between font-bold text-xs"><span>${g.name}</span><span class="text-purple-500">🔥 ${g.likes||0}</span></div>`;
                    card.onclick = () => {
                        document.getElementById('viewer').classList.remove('hidden');
                        const frame = document.getElementById('frame');
                        const code = atob(g.content);
                        if(g.type === 'url') frame.src = code; else frame.srcdoc = code;
                    };
                    el.appendChild(card);
                });
            };

            render('grid-highlights', [...games].sort((a,b) => b.likes - a.likes).slice(0,4));
            render('grid-recent', [...games].sort((a,b) => b.timestamp - a.timestamp).slice(0,4));
            render('grid-all', games);
        });
    };

    // Segurança contra F12
    document.onkeydown = e => { if(e.keyCode == 123) return false; };
})();
