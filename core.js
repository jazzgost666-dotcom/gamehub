(function() {
    // 1. INJETAR DEPENDÊNCIAS (TAILWIND E FONTS)
    const tw = document.createElement('script'); tw.src = "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"; document.head.appendChild(tw);
    const font = document.createElement('link'); font.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;700&display=swap"; font.rel = "stylesheet"; document.head.appendChild(font);

    // 2. INJETAR FIREBASE (IDÊNTICO AO SEU)
    const fb = document.createElement('script'); fb.type = 'module';
    fb.textContent = `
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
    `;
    document.head.appendChild(fb);

    // 3. SEU CSS ORIGINAL
    const style = document.createElement('style');
    style.textContent = `
        * { box-sizing: border-box; user-select: none; outline: none; }
        body { font-family: 'Rajdhani', sans-serif; background: #0b0915; color: white; margin: 0; overflow-x: hidden; }
        .glass { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(15px); border: 1px solid rgba(139, 92, 246, 0.2); }
        .btn-neon { background: #8b5cf6; color: white; font-weight: 900; transition: 0.3s; cursor: pointer; border: none; box-shadow: 0 0 15px rgba(139, 92, 246, 0.3); }
        .btn-neon:hover { box-shadow: 0 0 25px #8b5cf6; transform: translateY(-2px); }
        #intro-screen { position: fixed; inset: 0; background: #000; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .intro-g { font-family: 'Orbitron'; font-size: 150px; font-weight: 900; color: #8b5cf6; text-shadow: 0 0 20px #8b5cf6; animation: fall 1.5s ease-out forwards; }
        @keyframes fall { 0% { transform: translateY(-200px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes moveUp { 0% { transform: translateY(100%); opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { transform: translateY(-150%); opacity: 0; } }
        .no-capa { background: linear-gradient(135deg, #1a1625 0%, #2d1b4e 100%); display: flex; align-items: center; justify-content: center; }
        .no-capa::after { content: '🎮'; font-size: 40px; animation: float 3s ease-in-out infinite; }
        .section-title { font-family: 'Orbitron'; font-weight: 900; font-size: 14px; letter-spacing: 2px; color: #8b5cf6; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .section-title::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, rgba(139, 92, 246, 0.3), transparent); }
        .hidden { display: none !important; }
    `;
    document.head.appendChild(style);

    // 4. SEU HTML ORIGINAL (Injetado)
    document.body.innerHTML = `
        <div id="intro-screen">
            <div class="intro-g">G</div>
            <div style="height:150px; overflow:hidden; margin-top:20px; position:relative; width:300px;">
                <div style="position: absolute; width: 100%; animation: moveUp 7s linear 2s forwards; transform: translateY(100%); opacity: 0; text-align: center;">
                    <p class="text-purple-400 text-xs font-bold uppercase italic">Developers</p>
                    <p class="text-xl font-black mb-4">BYTEZT & JHOSSMINE2</p>
                    <p class="text-purple-400 text-xs font-bold uppercase italic">Producers</p>
                    <p class="text-xl font-black">EXILED OWNER & CHAD</p>
                </div>
            </div>
        </div>

        <div id="sys-manager" class="hidden fixed inset-0 z-[10000] p-10 bg-[#05040a] overflow-y-auto">
            <div class="flex justify-between items-center mb-10 border-b border-purple-500/20 pb-4">
                <h2 class="font-orbitron text-2xl font-black text-purple-500 italic">SYSTEM TERMINAL</h2>
                <button id="close-adm" class="bg-red-600 px-6 py-2 rounded-full font-bold text-xs uppercase">Fechar</button>
            </div>
            <div id="manager-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
        </div>

        <div id="main-hub" class="hidden">
            <header class="p-5 flex justify-between items-center glass sticky top-0 z-50">
                <div class="flex items-center gap-6">
                    <h1 class="font-orbitron text-xl font-black text-purple-500 italic">GAMEDEV SPACE</h1>
                    <input type="text" id="search-input" placeholder="Pesquisar..." class="bg-white/5 border border-white/10 rounded-full px-5 py-2 text-[11px] font-bold w-64 outline-none focus:border-purple-500">
                </div>
                <div class="flex items-center gap-5">
                    <button id="btn-up-open" class="btn-neon px-6 py-2 rounded-full text-[11px] font-black uppercase italic">🚀 Publicar</button>
                    <div id="profile-trigger" class="cursor-pointer flex items-center gap-3">
                        <span id="nav-username" class="text-[10px] font-black uppercase opacity-60">User</span>
                        <div id="nav-avatar" class="w-10 h-10 rounded-full border-2 border-purple-500 bg-cover bg-center"></div>
                    </div>
                </div>
            </header>

            <main class="container mx-auto p-8">
                <div id="display-banner" class="w-full h-[240px] rounded-[40px] bg-[#1a1625] relative border border-white/5 bg-cover bg-center mb-16 shadow-2xl">
                    <div id="display-avatar" class="w-[130px] h-[130px] rounded-full border-4 border-purple-500 absolute bottom-[-65px] left-[50px] bg-cover bg-center bg-[#0b0915]"></div>
                </div>
                <div class="mt-20 space-y-16">
                    <section><h2 class="section-title">🏆 DESTAQUES</h2><div id="grid-highlights" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"></div></section>
                    <section><h2 class="section-title">✨ RECENTES</h2><div id="grid-recent" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"></div></section>
                    <section><h2 class="section-title">🎮 TODOS OS JOGOS</h2><div id="grid-all" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"></div></section>
                </div>
            </main>
        </div>

        <div id="game-viewer" class="hidden fixed inset-0 z-[1000] bg-black overflow-y-auto">
            <div class="flex flex-col min-h-screen lg:flex-row">
                <div class="flex-1 flex flex-col p-4 lg:p-8 space-y-4">
                    <div class="flex justify-between items-center glass p-4 rounded-2xl">
                        <button id="close-v" class="bg-red-600 px-6 py-2 rounded-lg font-black text-[10px] uppercase">Sair</button>
                        <button id="fs-v" class="bg-purple-600 px-6 py-2 rounded-lg font-black text-[10px]">TELA CHEIA</button>
                    </div>
                    <div class="aspect-video w-full bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                        <iframe id="main-frame" class="w-full h-full border-none" allow="autoplay; fullscreen; pointer-lock"></iframe>
                    </div>
                    <div class="glass p-6 rounded-3xl space-y-4">
                        <h3 id="v-title" class="font-orbitron text-2xl font-black text-purple-500 uppercase">---</h3>
                        <p id="v-desc" class="text-sm opacity-80 italic">---</p>
                    </div>
                </div>
                <div class="w-full lg:w-[400px] glass p-6 flex flex-col gap-6 bg-[#0d0b1a]">
                    <div id="comments-box" class="flex-1 overflow-y-auto space-y-4 pr-2"></div>
                    <div class="flex gap-2">
                        <input type="text" id="comm-input" placeholder="Diga algo..." class="flex-1 bg-black/40 border border-white/10 p-3 rounded-xl text-xs text-white outline-none">
                        <button id="btn-comm-send" class="bg-purple-600 px-5 rounded-xl font-bold">➔</button>
                    </div>
                </div>
            </div>
        </div>

        <div id="modal-upload" class="hidden fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4">
             <div class="glass p-8 rounded-[35px] w-full max-w-xl">
                <h3 class="font-orbitron text-xl font-black mb-6 text-purple-500 italic">🚀 POSTAR JOGO</h3>
                <input type="text" id="up-name" placeholder="Título" class="w-full bg-white/5 p-4 rounded-2xl border border-white/10 text-white mb-4">
                <input type="text" id="up-capa" placeholder="Capa URL" class="w-full bg-white/5 p-4 rounded-2xl border border-white/10 text-white mb-4">
                <textarea id="up-desc" placeholder="Descrição..." class="w-full bg-white/5 p-4 rounded-2xl border border-white/10 h-20 text-white text-xs mb-4"></textarea>
                <button id="btn-final-enviar" class="w-full btn-neon py-4 rounded-2xl font-black uppercase italic">Publicar Agora</button>
             </div>
        </div>
    `;

    // 5. SUA LÓGICA DE JAVASCRIPT (Original Consertada)
    window.onload = () => {
        // Bloqueio F12 (Seu original)
        window.addEventListener('keydown', e => {
            if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && [73, 74, 67, 68].includes(e.keyCode))) e.preventDefault();
        }, true);

        // Timer da Intro
        setTimeout(() => {
            document.getElementById('intro-screen').style.display='none';
            document.getElementById('main-hub').classList.remove('hidden');
            window.loadGames();
        }, 10000);

        // Binds das suas funções
        document.getElementById('btn-up-open').onclick = () => document.getElementById('modal-upload').classList.remove('hidden');
        document.getElementById('close-v').onclick = () => document.getElementById('game-viewer').classList.add('hidden');
        document.getElementById('btn-final-enviar').onclick = window.enviarProjeto;
        
        // PAINEL ADM (Shift Direito + ADM)
        let entry = "";
        document.addEventListener('keydown', e => {
            if (e.location === 2 && e.key === "Shift") entry = "S_";
            if (entry.startsWith("S_")) {
                const k = e.key.toLowerCase();
                if (["a", "d", "m"].includes(k) && !entry.includes(k)) entry += k;
            }
            if (entry === "S_adm") {
                const access = prompt("SENHA ADM:");
                if(access === "ExiledEChadLindoAdm89892014") {
                    document.getElementById('sys-manager').classList.remove('hidden');
                }
                entry = "";
            }
        });
    };

    window.loadGames = () => {
        window.fbLib.onValue(window.fbLib.ref(window.fbDB, 'games'), snap => {
            const data = snap.val(); if(!data) return;
            const grid = document.getElementById('grid-all'); grid.innerHTML = "";
            Object.keys(data).forEach(id => {
                const g = data[id];
                const div = document.createElement('div');
                div.className = "p-4 glass rounded-[25px] cursor-pointer hover:scale-105 transition-all";
                div.innerHTML = `<img src="${g.capa}" class="w-full h-40 object-cover rounded-2xl mb-4"><h4 class="font-black truncate text-sm uppercase">${g.name}</h4>`;
                div.onclick = () => {
                    document.getElementById('game-viewer').classList.remove('hidden');
                    document.getElementById('main-frame').src = g.content;
                };
                grid.appendChild(div);
            });
        });
    };

    window.enviarProjeto = () => {
        const n = document.getElementById('up-name').value;
        const c = document.getElementById('up-content')?.value || document.getElementById('up-capa').value;
        window.fbLib.set(window.fbLib.push(window.fbLib.ref(window.fbDB, 'games')), {
            name: n, content: c, capa: document.getElementById('up-capa').value, timestamp: Date.now()
        }).then(() => location.reload());
    };

})();
