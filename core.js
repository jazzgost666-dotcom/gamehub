(function() {
    // 1. IMPORTAÇÃO DO FIREBASE E TAILWIND
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
        setTimeout(() => { window.loadGames(); }, 500);
    `;
    document.head.appendChild(firebaseScript);

    // 2. CSS CUSTOMIZADO
    const style = document.createElement('style');
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;700&display=swap');
        * { box-sizing: border-box; user-select: none; outline: none; }
        body { font-family: 'Rajdhani', sans-serif; background: #0b0915; color: white; margin: 0; overflow-x: hidden; }
        .glass { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(15px); border: 1px solid rgba(139, 92, 246, 0.2); }
        .btn-neon { background: #8b5cf6; color: white; font-weight: 900; transition: 0.3s; cursor: pointer; border: none; box-shadow: 0 0 15px rgba(139, 92, 246, 0.3); }
        .btn-neon:hover { box-shadow: 0 0 25px #8b5cf6; transform: translateY(-2px); }
        .section-title { font-family: 'Orbitron'; font-weight: 900; font-size: 14px; letter-spacing: 2px; color: #8b5cf6; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .section-title::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, rgba(139, 92, 246, 0.3), transparent); }
        .shield-active { position: absolute; inset: 0; z-index: 50; background: transparent; cursor: pointer; }
        @keyframes moveUp { 0% { transform: translateY(100%); opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { transform: translateY(-150%); opacity: 0; } }
    `;
    document.head.appendChild(style);

    // 3. HTML COMPLETO
    document.body.innerHTML = `
        <div id="intro-screen" style="position:fixed; inset:0; background:#000; z-index:9999; display:flex; flex-direction:column; align-items:center; justify-content:center;">
            <div style="font-family:'Orbitron'; font-size:150px; font-weight:900; color:#8b5cf6; text-shadow:0 0 20px #8b5cf6;">G</div>
            <div style="height:150px; overflow:hidden; margin-top:20px; position:relative; width:300px;">
                <div style="position: absolute; width: 100%; animation: moveUp 7s linear 2s forwards; text-align: center;">
                    <p style="color:#a78bfa; font-size:12px; font-weight:bold; font-style:italic;">DEVELOPERS</p>
                    <p style="font-size:20px; font-weight:900; margin-bottom:16px;">BYTEZT & JHOSSMINE2</p>
                    <p style="color:#a78bfa; font-size:12px; font-weight:bold; font-style:italic;">PRODUCERS</p>
                    <p style="font-size:20px; font-weight:900;">EXILED OWNER & CHAD</p>
                </div>
            </div>
        </div>

        <div id="main-hub" style="display:none">
            <header class="p-5 flex justify-between items-center glass sticky top-0 z-50">
                <h1 class="font-orbitron text-xl font-black text-purple-500 italic">GAMEDEV SPACE</h1>
                <div class="flex items-center gap-5">
                    <button onclick="document.getElementById('modal-upload').classList.remove('hidden')" class="btn-neon px-6 py-2 rounded-full text-[11px] font-black uppercase italic">🚀 PUBLICAR</button>
                    <div id="nav-avatar" class="w-10 h-10 rounded-full border-2 border-purple-500 bg-cover bg-center"></div>
                </div>
            </header>

            <main class="container mx-auto p-8">
                <div id="display-banner" class="w-full h-[240px] rounded-[40px] bg-[#1a1625] relative border border-white/5 bg-cover bg-center mb-16 shadow-2xl">
                    <div id="display-avatar" class="w-[130px] h-[130px] rounded-full border-4 border-purple-500 absolute bottom-[-65px] left-[50px] bg-cover bg-center bg-[#0b0915]"></div>
                </div>

                <div class="mt-20 space-y-16">
                    <section><h2 class="section-title">🏆 DESTAQUES</h2><div id="grid-highlights" class="grid grid-cols-1 md:grid-cols-4 gap-8"></div></section>
                    <section><h2 class="section-title">✨ RECENTES</h2><div id="grid-recent" class="grid grid-cols-1 md:grid-cols-4 gap-8"></div></section>
                    <section><h2 class="section-title">🎮 TODOS OS JOGOS</h2><div id="grid-all" class="grid grid-cols-1 md:grid-cols-4 gap-8"></div></section>
                </div>
            </main>
        </div>

        <div id="game-viewer" style="display:none" class="fixed inset-0 z-[1000] bg-black overflow-y-auto">
            <div class="flex flex-col lg:flex-row min-h-screen">
                <div class="flex-1 p-4 lg:p-8 space-y-4">
                    <div class="flex justify-between items-center glass p-4 rounded-2xl">
                        <button onclick="location.reload()" class="bg-red-600 px-6 py-2 rounded-lg font-black text-[10px]">SAIR</button>
                        <button onclick="document.getElementById('shield-layer').style.display='none'" class="bg-yellow-600 px-6 py-2 rounded-lg font-black text-[10px]">🔓 LIBERAR JOGO</button>
                    </div>
                    <div class="aspect-video w-full bg-black rounded-3xl overflow-hidden relative border border-white/10 shadow-2xl">
                        <div id="shield-layer" class="shield-active"></div>
                        <iframe id="main-frame" class="w-full h-full border-none bg-white" allow="autoplay; fullscreen; pointer-lock"></iframe>
                    </div>
                    <div class="glass p-6 rounded-3xl">
                        <h3 id="v-title" class="font-orbitron text-2xl font-black text-purple-500 uppercase">---</h3>
                        <p class="text-[11px] font-bold text-white/50 mt-1 uppercase italic">Dono: <span id="v-author" class="text-purple-400">---</span></p>
                        <div id="v-desc" class="mt-4 text-sm opacity-80 italic">---</div>
                    </div>
                </div>
                <div class="w-full lg:w-[400px] glass p-6 flex flex-col gap-6">
                    <button id="btn-like" class="bg-white/5 p-4 rounded-2xl text-center"><p class="text-[9px] opacity-40 uppercase font-black">Likes</p><p id="v-likes" class="text-xl font-black text-red-500">0</p></button>
                    <div id="comments-box" class="flex-1 overflow-y-auto space-y-4 pr-2"></div>
                    <div class="flex gap-2">
                        <input type="text" id="comm-input" placeholder="Comentar..." class="flex-1 bg-white/5 p-3 rounded-xl text-xs outline-none">
                        <button id="btn-comment" class="bg-purple-600 px-5 rounded-xl font-bold">➔</button>
                    </div>
                </div>
            </div>
        </div>

        <div id="modal-upload" class="hidden fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4">
            <div class="glass p-8 rounded-[35px] w-full max-w-xl">
                <h3 class="font-orbitron text-xl text-purple-500 font-black mb-6 italic uppercase">🚀 PUBLICAR JOGO</h3>
                <input type="text" id="up-name" placeholder="Nome do Jogo" class="w-full bg-white/5 p-4 rounded-2xl border border-white/10 text-white mb-4">
                <input type="text" id="up-capa" placeholder="URL da Capa" class="w-full bg-white/5 p-4 rounded-2xl border border-white/10 text-white mb-4">
                <textarea id="up-desc" placeholder="Descrição..." class="w-full bg-white/5 p-4 rounded-2xl border border-white/10 h-20 text-white text-xs mb-4"></textarea>
                <select id="up-type" class="w-full bg-black p-4 rounded-2xl border border-white/10 text-purple-400 font-bold mb-4">
                    <option value="url">Link Externo</option>
                    <option value="code">Código HTML</option>
                    <option value="file">Arquivo .html</option>
                </select>
                <div id="up-area"><textarea id="up-content" placeholder="Link ou Código..." class="w-full bg-white/5 p-4 rounded-2xl border border-white/10 h-24 text-white text-xs mb-4"></textarea></div>
                <button id="btn-final-post" class="w-full btn-neon py-4 rounded-2xl font-black uppercase">POSTAR AGORA</button>
                <button onclick="document.getElementById('modal-upload').classList.add('hidden')" class="w-full text-[10px] opacity-20 mt-2 uppercase">CANCELAR</button>
            </div>
        </div>
    `;

    // 4. LÓGICA DO SISTEMA (Firebase integration)
    let currentUser = JSON.parse(localStorage.getItem('gs_user')) || { id: 'u'+Date.now(), name: 'Dev User', avatar: '' };
    let track = JSON.parse(localStorage.getItem('gs_track')) || { l: [] };
    let activeId = null;

    window.loadGames = () => {
        window.fbLib.onValue(window.fbLib.ref(window.fbDB, 'games'), snap => {
            const data = snap.val(); if(!data) return;
            let games = Object.keys(data).map(id => ({ id, ...data[id] }));
            renderGrid('grid-highlights', [...games].sort((a,b) => (b.likes||0)-(a.likes||0)).slice(0,4));
            renderGrid('grid-recent', [...games].sort((a,b) => b.timestamp-a.timestamp).slice(0,4));
            renderGrid('grid-all', games);
        });
    };

    function renderGrid(gridId, list) {
        const grid = document.getElementById(gridId); if(!grid) return;
        grid.innerHTML = "";
        list.forEach(g => {
            const img = g.capa ? `<img src="${g.capa}" class="w-full h-40 object-cover rounded-2xl mb-4">` : `<div class="w-full h-40 rounded-2xl mb-4 bg-purple-900/20"></div>`;
            const div = document.createElement('div');
            div.className = "p-4 glass rounded-[25px] cursor-pointer hover:scale-105 transition-all";
            div.innerHTML = `${img}<div class="flex justify-between items-center"><h4 class="font-black truncate text-sm uppercase">${g.name}</h4><span class="text-purple-500 font-bold">🔥 ${g.likes||0}</span></div>`;
            div.onclick = () => openViewer(g.id, g);
            grid.appendChild(div);
        });
    }

    function openViewer(id, g) {
        activeId = id;
        document.getElementById('game-viewer').style.display = 'block';
        document.getElementById('v-title').innerText = g.name;
        document.getElementById('v-author').innerText = g.author;
        document.getElementById('v-desc').innerText = g.desc || "Sem descrição.";
        document.getElementById('v-likes').innerText = g.likes || 0;
        
        const decoded = atob(g.content);
        const frame = document.getElementById('main-frame');
        if(g.type === 'url' || g.type === 'file') frame.src = decoded;
        else frame.srcdoc = decoded;

        loadComments(id);
    }

    // Inicialização final
    setTimeout(() => {
        document.getElementById('intro-screen').style.display = 'none';
        document.getElementById('main-hub').style.display = 'block';
        const avatar = currentUser.avatar || 'https://api.dicebear.com/7.x/identicon/svg?seed='+currentUser.id;
        document.getElementById('nav-avatar').style.backgroundImage = `url('${avatar}')`;
        document.getElementById('display-avatar').style.backgroundImage = `url('${avatar}')`;
    }, 9000);

    // Bloqueio de console
    setInterval(() => { if(window.outerWidth - window.innerWidth > 160) document.body.innerHTML = ""; }, 500);
})();
