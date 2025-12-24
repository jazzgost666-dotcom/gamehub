(function() {
    // 1. CARREGAR DEPENDÊNCIAS IMEDIATAMENTE
    const tw = document.createElement('script'); tw.src = "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"; document.head.appendChild(tw);
    const font = document.createElement('link'); font.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;700&display=swap"; font.rel = "stylesheet"; document.head.appendChild(font);

    // 2. FIREBASE
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

    // 3. SEU CSS (Com a correção do display)
    const style = document.createElement('style');
    style.textContent = `
        * { box-sizing: border-box; user-select: none; outline: none; }
        body { font-family: 'Rajdhani', sans-serif; background: #0b0915; color: white; margin: 0; overflow-x: hidden; }
        .glass { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(15px); border: 1px solid rgba(139, 92, 246, 0.2); }
        .btn-neon { background: #8b5cf6; color: white; font-weight: 900; transition: 0.3s; cursor: pointer; border: none; box-shadow: 0 0 15px rgba(139, 92, 246, 0.3); }
        #intro-screen { position: fixed; inset: 0; background: #000; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 1; transition: opacity 1s ease; }
        .intro-g { font-family: 'Orbitron'; font-size: 150px; font-weight: 900; color: #8b5cf6; text-shadow: 0 0 20px #8b5cf6; animation: fall 1.5s ease-out forwards; }
        @keyframes fall { 0% { transform: translateY(-200px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes moveUp { 0% { transform: translateY(100%); opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { transform: translateY(-150%); opacity: 0; } }
        .section-title { font-family: 'Orbitron'; font-weight: 900; font-size: 14px; letter-spacing: 2px; color: #8b5cf6; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .section-title::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, rgba(139, 92, 246, 0.3), transparent); }
        .hidden { display: none !important; }
    `;
    document.head.appendChild(style);

    // 4. HTML (Exatamente seu antigo)
    document.body.innerHTML = `
        <div id="intro-screen">
            <div class="intro-g">G</div>
            <div style="height:150px; overflow:hidden; margin-top:20px; position:relative; width:300px;">
                <div style="position: absolute; width: 100%; animation: moveUp 7s linear 2s forwards; text-align: center;">
                    <p class="text-purple-400 text-xs font-bold uppercase italic">Developers</p>
                    <p class="text-xl font-black mb-4">BYTEZT & JHOSSMINE2</p>
                    <p class="text-purple-400 text-xs font-bold uppercase italic">Producers</p>
                    <p class="text-xl font-black">EXILED OWNER & CHAD</p>
                </div>
            </div>
        </div>

        <div id="main-hub" class="hidden">
            <header class="p-5 flex justify-between items-center glass sticky top-0 z-50">
                <h1 class="font-orbitron text-xl font-black text-purple-500 italic">GAMEDEV SPACE</h1>
                <div class="flex items-center gap-5">
                    <button onclick="document.getElementById('modal-upload').classList.remove('hidden')" class="btn-neon px-6 py-2 rounded-full text-[11px] font-black uppercase italic">🚀 Publicar</button>
                    <div id="nav-avatar" class="w-10 h-10 rounded-full border-2 border-purple-500 bg-cover bg-center"></div>
                </div>
            </header>
            <main class="container mx-auto p-8">
                <div id="display-banner" class="w-full h-[240px] rounded-[40px] bg-[#1a1625] mb-16 border border-white/5 bg-cover bg-center shadow-2xl"></div>
                <section><h2 class="section-title">🏆 DESTAQUES</h2><div id="grid-highlights" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"></div></section>
                <section class="mt-16"><h2 class="section-title">✨ RECENTES</h2><div id="grid-recent" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"></div></section>
                <section class="mt-16"><h2 class="section-title">🎮 TODOS OS JOGOS</h2><div id="grid-all" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"></div></section>
            </main>
        </div>

        <div id="modal-upload" class="hidden fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4">
             <div class="glass p-8 rounded-[35px] w-full max-w-xl">
                <h3 class="font-orbitron text-xl font-black mb-6 text-purple-500 italic">🚀 POSTAR JOGO</h3>
                <input type="text" id="up-name" placeholder="Título" class="w-full bg-white/5 p-4 rounded-2xl border border-white/10 text-white mb-4">
                <input type="text" id="up-content" placeholder="Link do Jogo" class="w-full bg-white/5 p-4 rounded-2xl border border-white/10 text-white mb-4">
                <button onclick="window.enviarProjeto()" class="w-full btn-neon py-4 rounded-2xl font-black uppercase italic">Publicar</button>
                <button onclick="document.getElementById('modal-upload').classList.add('hidden')" class="w-full text-xs opacity-20 mt-4">CANCELAR</button>
             </div>
        </div>
    `;

    // 5. FUNÇÃO DE INICIALIZAÇÃO (Destrava aqui!)
    function startApp() {
        const intro = document.getElementById('intro-screen');
        const hub = document.getElementById('main-hub');

        // Garante que após 9 segundos a intro suma, mesmo se houver erro no carregamento
        setTimeout(() => {
            intro.style.opacity = '0';
            setTimeout(() => {
                intro.classList.add('hidden');
                hub.classList.remove('hidden');
                if(window.loadGames) window.loadGames();
            }, 1000);
        }, 9000); 
    }

    // LÓGICA DO FIREBASE
    window.loadGames = () => {
        if(!window.fbLib) return setTimeout(window.loadGames, 500);
        window.fbLib.onValue(window.fbLib.ref(window.fbDB, 'games'), snap => {
            const data = snap.val(); if(!data) return;
            const grid = document.getElementById('grid-all');
            grid.innerHTML = "";
            Object.keys(data).forEach(id => {
                const g = data[id];
                const card = document.createElement('div');
                card.className = "p-4 glass rounded-[25px] cursor-pointer hover:scale-105 transition-all";
                card.innerHTML = `<div class="w-full h-40 bg-purple-900/10 rounded-2xl mb-4"></div><h4 class="font-black text-sm uppercase">${g.name}</h4>`;
                grid.appendChild(card);
            });
        });
    };

    window.enviarProjeto = () => {
        const n = document.getElementById('up-name').value;
        const c = document.getElementById('up-content').value;
        window.fbLib.set(window.fbLib.push(window.fbLib.ref(window.fbDB, 'games')), {
            name: n, content: c, timestamp: Date.now()
        }).then(() => location.reload());
    };

    // EXECUTA A INICIALIZAÇÃO
    startApp();
})();
