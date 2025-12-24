(function() {
    // 1. IMPORTAÇÃO DO FIREBASE (MODULAR)
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
        const db = getDatabase(app);
        window.fbDB = db;
        window.fbLib = { ref, set, push, onValue, update, increment, remove };
        
        // Dispara o carregamento dos jogos após o Firebase iniciar
        setTimeout(() => { if(window.loadGames) window.loadGames(); }, 500);
    `;
    document.head.appendChild(firebaseScript);

    // 2. CSS DO SITE
    const style = document.createElement('style');
    style.textContent = `
        * { box-sizing: border-box; user-select: none; outline: none; -webkit-user-drag: none; }
        body { font-family: 'Rajdhani', sans-serif; background: #0b0915; color: white; margin: 0; overflow-x: hidden; }
        .glass { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(15px); border: 1px solid rgba(139, 92, 246, 0.2); }
        .btn-neon { background: #8b5cf6; color: white; font-weight: 900; cursor: pointer; border: none; box-shadow: 0 0 15px rgba(139, 92, 246, 0.3); }
        .section-title { font-family: 'Orbitron'; font-weight: 900; font-size: 14px; color: #8b5cf6; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .shield-active { position: absolute; inset: 0; z-index: 50; background: transparent; cursor: pointer; }
        .hidden { display: none; }
    `;
    document.head.appendChild(style);

    // 3. HTML ESTRUTURAL
    document.body.innerHTML = `
        <div id="intro-screen" style="position:fixed; inset:0; background:#000; z-index:9999; display:flex; align-items:center; justify-content:center;">
            <div style="font-family:'Orbitron'; font-size:100px; color:#8b5cf6; text-shadow:0 0 20px #8b5cf6;">G</div>
        </div>

        <div id="main-hub" class="hidden">
            <header class="p-5 flex justify-between items-center glass sticky top-0 z-50">
                <h1 style="font-family:'Orbitron'" class="text-xl font-black text-purple-500 italic">GAMEDEV SPACE</h1>
                <div class="flex items-center gap-5">
                    <button onclick="document.getElementById('modal-upload').classList.remove('hidden')" class="btn-neon px-6 py-2 rounded-full text-[10px] font-black uppercase">🚀 PUBLICAR</button>
                    <div id="nav-avatar" class="w-10 h-10 rounded-full border-2 border-purple-500 bg-cover bg-center"></div>
                </div>
            </header>
            <main class="container mx-auto p-8">
                <div id="display-banner" class="w-full h-[200px] rounded-[30px] bg-[#1a1625] mb-12 bg-cover bg-center border border-white/5"></div>
                <section><h2 class="section-title">🏆 DESTAQUES</h2><div id="grid-highlights" class="grid grid-cols-1 md:grid-cols-4 gap-6"></div></section>
                <section class="mt-12"><h2 class="section-title">✨ RECENTES</h2><div id="grid-recent" class="grid grid-cols-1 md:grid-cols-4 gap-6"></div></section>
                <section class="mt-12"><h2 class="section-title">🎮 TODOS</h2><div id="grid-all" class="grid grid-cols-1 md:grid-cols-4 gap-6"></div></section>
            </main>
        </div>

        <div id="game-viewer" class="hidden fixed inset-0 z-[1000] bg-black overflow-y-auto">
             <div class="flex flex-col lg:flex-row min-h-screen">
                <div class="flex-1 p-4 lg:p-8 space-y-4">
                    <div class="flex justify-between items-center glass p-4 rounded-2xl">
                        <button onclick="location.reload()" class="bg-red-600 px-6 py-2 rounded-lg font-black text-[10px]">SAIR</button>
                        <button onclick="document.getElementById('shield-layer').style.display='none'" class="bg-yellow-600 px-6 py-2 rounded-lg font-black text-[10px]">🔓 LIBERAR JOGO</button>
                    </div>
                    <div class="aspect-video w-full bg-black rounded-3xl overflow-hidden relative border border-white/10 shadow-2xl">
                        <div id="shield-layer" class="shield-active"></div>
                        <iframe id="main-frame" class="w-full h-full border-none bg-white"></iframe>
                    </div>
                </div>
            </div>
        </div>

        <div id="modal-upload" class="hidden fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4">
            <div class="glass p-8 rounded-[30px] w-full max-w-lg">
                <h3 class="font-orbitron text-purple-500 font-black mb-4">🚀 POSTAR NOVO JOGO</h3>
                <input type="text" id="up-name" placeholder="Nome" class="w-full bg-white/5 p-3 rounded-xl mb-3 text-white border border-white/10">
                <select id="up-type" class="w-full bg-black p-3 rounded-xl mb-3 text-purple-400 font-bold border border-white/10">
                    <option value="url">Link Externo</option>
                    <option value="code">Código HTML</option>
                </select>
                <textarea id="up-content" placeholder="Link ou Código..." class="w-full bg-white/5 p-3 rounded-xl h-24 mb-3 text-white border border-white/10"></textarea>
                <button onclick="window.enviar()" class="w-full btn-neon py-3 rounded-xl font-black">POSTAR</button>
                <button onclick="document.getElementById('modal-upload').classList.add('hidden')" class="w-full text-[10px] mt-2 opacity-50">FECHAR</button>
            </div>
        </div>
    `;

    // 4. LÓGICA DO SISTEMA
    let currentUser = { id: 'u'+Date.now(), name: 'Dev User' };

    window.enviar = async () => {
        const n = document.getElementById('up-name').value;
        const t = document.getElementById('up-type').value;
        const c = btoa(document.getElementById('up-content').value); // BLINDAGEM BASE64
        if(!n || !c) return alert("Erro!");
        const { ref, push, set } = window.fbLib;
        set(push(ref(window.fbDB, 'games')), { 
            name: n, type: t, content: c, author: currentUser.name, likes: 0, timestamp: Date.now() 
        }).then(() => location.reload());
    };

    window.loadGames = () => {
        window.fbLib.onValue(window.fbLib.ref(window.fbDB, 'games'), snap => {
            const data = snap.val(); if(!data) return;
            const grid = document.getElementById('grid-all');
            grid.innerHTML = "";
            Object.keys(data).forEach(id => {
                const g = data[id];
                const card = document.createElement('div');
                card.className = "p-4 glass rounded-[20px] cursor-pointer hover:scale-105 transition-all";
                card.innerHTML = `<div class="w-full h-32 bg-purple-900/20 rounded-xl mb-3"></div><h4 class="font-bold text-xs uppercase">${g.name}</h4>`;
                card.onclick = () => window.openViewer(id, g);
                grid.appendChild(card);
            });
        });
    };

    window.openViewer = (id, g) => {
        const frame = document.getElementById('main-frame');
        const content = atob(g.content); // DECODIFICA
        document.getElementById('game-viewer').classList.remove('hidden');
        setTimeout(() => {
            if(g.type === 'url') frame.src = content;
            else frame.srcdoc = content;
        }, 300);
    };

    // Segurança final e Inicialização
    setTimeout(() => {
        document.getElementById('intro-screen').style.display = 'none';
        document.getElementById('main-hub').classList.remove('hidden');
    }, 3000);

    // Bloqueio de console
    setInterval(() => { if(window.outerWidth - window.innerWidth > 160) document.body.innerHTML = "BLOQUEADO"; }, 500);
})();
