// CONTEÚDO PARA O core.js
(function() {
    // 1. INJETAR CSS
    const style = document.createElement('style');
    style.textContent = `
        * { box-sizing: border-box; user-select: none; outline: none; -webkit-user-drag: none; }
        body { font-family: 'Rajdhani', sans-serif; background: #0b0915; color: white; margin: 0; overflow-x: hidden; }
        .glass { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(15px); border: 1px solid rgba(139, 92, 246, 0.2); }
        .btn-neon { background: #8b5cf6; color: white; font-weight: 900; transition: 0.3s; cursor: pointer; border: none; box-shadow: 0 0 15px rgba(139, 92, 246, 0.3); }
        .intro-g { font-family: 'Orbitron'; font-size: 150px; font-weight: 900; color: #8b5cf6; text-shadow: 0 0 20px #8b5cf6; }
        .shield-active { position: absolute; inset: 0; z-index: 50; background: transparent; }
        .section-title { font-family: 'Orbitron'; font-weight: 900; font-size: 14px; color: #8b5cf6; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
    `;
    document.head.appendChild(style);

    // 2. INJETAR HTML DO SITE
    document.body.innerHTML = `
        <div id="intro-screen" style="position:fixed; inset:0; background:#000; z-index:9999; display:flex; align-items:center; justify-content:center;">
            <div class="intro-g">G</div>
        </div>

        <div id="main-hub" class="hidden">
            <header class="p-5 flex justify-between items-center glass sticky top-0 z-50">
                <h1 class="font-orbitron text-xl font-black text-purple-500 italic">GAMEDEV SPACE</h1>
                <div class="flex items-center gap-5">
                    <button onclick="document.getElementById('modal-upload').classList.remove('hidden')" class="btn-neon px-6 py-2 rounded-full text-[11px] font-black uppercase">🚀 PUBLICAR</button>
                    <div id="nav-avatar" class="w-10 h-10 rounded-full border-2 border-purple-500 bg-cover bg-center cursor-pointer"></div>
                </div>
            </header>
            <main class="container mx-auto p-8">
                <div id="display-banner" class="w-full h-[240px] rounded-[40px] bg-[#1a1625] mb-16 bg-cover bg-center border border-white/5"></div>
                <section><h2 class="section-title">🏆 DESTAQUES</h2><div id="grid-highlights" class="grid grid-cols-1 md:grid-cols-4 gap-8"></div></section>
                <section class="mt-16"><h2 class="section-title">✨ RECENTES</h2><div id="grid-recent" class="grid grid-cols-1 md:grid-cols-4 gap-8"></div></section>
                <section class="mt-16"><h2 class="section-title">🎮 TODOS</h2><div id="grid-all" class="grid grid-cols-1 md:grid-cols-4 gap-8"></div></section>
            </main>
        </div>

        <div id="game-viewer" class="hidden fixed inset-0 z-[1000] bg-black overflow-y-auto">
            <div class="flex flex-col lg:flex-row min-h-screen">
                <div class="flex-1 p-4 lg:p-8 space-y-4">
                    <div class="flex justify-between items-center glass p-4 rounded-2xl">
                        <button onclick="location.reload()" class="bg-red-600 px-6 py-2 rounded-lg font-black text-[10px]">VOLTAR</button>
                        <button onclick="document.getElementById('shield-layer').style.display='none'" class="bg-yellow-600 px-6 py-2 rounded-lg font-black text-[10px]">🔓 LIBERAR JOGO</button>
                    </div>
                    <div class="aspect-video w-full bg-black rounded-3xl overflow-hidden relative border border-white/10">
                        <div id="shield-layer" class="shield-active"></div>
                        <iframe id="main-frame" class="w-full h-full border-none bg-white"></iframe>
                    </div>
                </div>
            </div>
        </div>

        <div id="modal-upload" class="hidden fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4">
            <div class="glass p-8 rounded-[35px] w-full max-w-xl">
                <h3 class="font-orbitron text-xl text-purple-500 font-black mb-6 italic">🚀 PUBLICAR</h3>
                <input type="text" id="up-name" placeholder="Nome" class="w-full bg-white/5 p-4 rounded-2xl border border-white/10 text-white mb-4">
                <select id="up-type" class="w-full bg-black p-4 rounded-2xl text-purple-400 font-bold mb-4">
                    <option value="url">Link Externo</option>
                    <option value="code">Código HTML</option>
                    <option value="file">Arquivo .html</option>
                </select>
                <textarea id="up-content" placeholder="Link ou Código..." class="w-full bg-white/5 p-4 rounded-2xl border border-white/10 h-24 mb-4 text-white"></textarea>
                <button id="btn-postar" class="w-full btn-neon py-4 rounded-2xl font-black uppercase">POSTAR AGORA</button>
            </div>
        </div>
    `;

    // 3. CARREGAR FIREBASE E LÓGICA (Executa em Background)
    const scriptTailwind = document.createElement('script');
    scriptTailwind.src = "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4";
    document.head.appendChild(scriptTailwind);

    // Esconder intro após 3 segundos
    setTimeout(() => {
        document.getElementById('intro-screen').style.display = 'none';
        document.getElementById('main-hub').classList.remove('hidden');
    }, 3000);

    // Bloqueio de console reforçado
    setInterval(() => {
        const start = Date.now();
        debugger;
        if (Date.now() - start > 100) {
            document.body.innerHTML = "ACESSO BLOQUEADO";
        }
    }, 500);

    console.log("Core System Loaded.");
})();
