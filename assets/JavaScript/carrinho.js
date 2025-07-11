function mostrarCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const carrinhoContainer = document.getElementById('carrinho-itens');
    carrinhoContainer.innerHTML = '';

    carrinho.forEach((item, index) => {
        const div = document.createElement('div');
        div.classList.add('pedido-item');
        div.style.border = '1px solid #ccc';
        div.style.padding = '10px';
        div.style.marginBottom = '10px';
        div.style.borderRadius = '5px';
    });
}

// Função para remover item do carrinho
function removerDoCarrinho(indice) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.splice(indice, 1); // remove o item pelo índice
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    mostrarCarrinho(); // atualiza a lista depois de remover
}

// Chamar para mostrar logo que carregar a página
document.addEventListener('DOMContentLoaded', mostrarCarrinho);
document.addEventListener('DOMContentLoaded', mostrarCarrinho);
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.navbar-nav .nav-link');
    const currentPage = window.location.pathname.split('/').pop();

    links.forEach(link => {
        const href = link.getAttribute('href');

        // Verifica se o href da âncora corresponde ao nome da página atual
        if (href === currentPage || (href === 'index.html' && (currentPage === '' || currentPage === '/'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active'); // remove caso não seja
        }
    });
});

let valorFrete = 0;

document.addEventListener("DOMContentLoaded", function () {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const container = document.getElementById("carrinho");
    const freteInfo = document.getElementById("frete-info");

    window.atualizarCarrinho = function () {
        if (carrinho.length === 0) {
            container.innerHTML = '<p class="text-center py-3">Seu carrinho está vazio.</p>';
            document.getElementById("total").innerHTML = "";
            freteInfo.innerHTML = "";
            return;
        }

        let subtotal = 0;
        let html = '';

        carrinho.forEach((item, index) => {
            const quantidade = item.quantidade || 1;
            const itemTotal = item.preco * quantidade;

            html += `
        <div class="card mb-3 p-3">
            <div class="row g-0 align-items-center">
                <div class="col-auto">
                    <img src="${item.img || 'assets/imgs/sem-imagem.jpg'}"
                        alt="${item.nome}"
                        class="img-fluid rounded"
                        style="width: 80px; height: 80px; object-fit: cover;">
                </div>
                <div class="col ms-3">
                    <h5 class="mb-1">${item.nome} <small class="text-muted">x${quantidade}</small></h5>
                    <p class="mb-1">R$ ${item.preco.toFixed(2)} cada</p>
                    <p class="mb-1"><strong>Total:</strong> R$ ${itemTotal.toFixed(2)}</p>
                    ${item.observacao ? `<p class="mb-1"><strong>Observação:</strong> ${item.observacao}</p>` : ''}
                    ${item.adicionais && item.adicionais.length > 0
                    ? `<p class="mb-1"><strong>Adicionais:</strong> ${item.adicionais.join(', ')}</p>`
                    : ''}
                </div>
                <div class="col-auto d-flex flex-column align-items-end">
                    <div class="d-flex align-items-center mb-2">
                        <button class="btn btn-outline-secondary btn-sm" onclick="alterarQuantidade(${index}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="mx-2 px-2 bg-light rounded">${quantidade}</span>
                        <button class="btn btn-outline-secondary btn-sm" onclick="alterarQuantidade(${index}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="btn btn-danger btn-sm" onclick="removerDoCarrinho(${index})">
                        <i class="fas fa-trash"></i> Remover
                    </button>
                </div>
            </div>
        </div>
    `;
        });

        container.innerHTML = html;
        atualizarTotal();
    }

    // DEMIAS FUNÇÕES PERMANECEM IGUAIS
    window.alterarQuantidade = function (index, delta) {
        if (!carrinho[index].quantidade) carrinho[index].quantidade = 1;
        carrinho[index].quantidade += delta;
        if (carrinho[index].quantidade < 1) carrinho[index].quantidade = 1;
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        atualizarCarrinho();
    };

    window.removerDoCarrinho = function (index) {
        if (confirm("Remover este item do carrinho?")) {
            carrinho.splice(index, 1);
            localStorage.setItem("carrinho", JSON.stringify(carrinho));
            atualizarCarrinho();
        }
    };

    function atualizarTotal() {
        const subtotal = carrinho.reduce((total, item) => total + (item.preco * (item.quantidade || 1)), 0);
        const total = subtotal + valorFrete;

        document.getElementById("total").innerHTML = `
  <div class="card p-3">
    <h5 class="mb-3">Resumo do Pedido</h5>

    <div class="d-flex justify-content-between mb-2">
      <span>Subtotal:</span>
      <span>R$ ${subtotal.toFixed(2)}</span>
    </div>
    <div class="d-flex justify-content-between mb-3">
      <span>Frete:</span>
      <span>${valorFrete > 0 ? 'R$ ' + valorFrete.toFixed(2) : 'Não calculado'}</span>
    </div>
    <hr>
    <div class="d-flex justify-content-between fw-bold mb-3">
      <span>Total:</span>
      <span>R$ ${total.toFixed(2)}</span>
    </div>

    <div class="mb-3">
      <label for="nomeCliente" class="form-label">Nome:</label>
      <input type="text" class="form-control" id="nomeCliente" placeholder="Digite seu nome">
    </div>

    <div class="mb-3">
      <label for="pagamento" class="form-label">Forma de Pagamento: (PAGAMENTO SOMENTE NA HORA!) </label>
      <select class="form-select" id="pagamento">
        <option value="">Selecione</option>
        <option value="Dinheiro">Dinheiro</option>
        <option value="PIX">PIX</option>
        <option value="Cartão">Cartão</option>
      </select>
    </div>
  </div>
`;
    }

    window.finalizarPedido = function () {
        if (carrinho.length === 0) {
            alert("Seu carrinho está vazio.");
            return;
        }

        const nome = document.getElementById("nomeCliente")?.value.trim();
        const formaPagamento = document.getElementById("pagamento")?.value;

        if (!nome || !formaPagamento) {
            alert("Por favor, preencha o nome e selecione a forma de pagamento.");
            return;
        }

        const endereco = document.getElementById("enderecoDestino")?.value || "Endereço não informado";

        const novoPedido = {
            id: Date.now(),
            cliente: nome,
            pagamento: formaPagamento,
            endereco: endereco,
            itens: carrinho,
            data: new Date().toLocaleString()
        };

        const pedidos = JSON.parse(localStorage.getItem("pedidosRecebidos")) || [];
        pedidos.push(novoPedido);
        localStorage.setItem("pedidosRecebidos", JSON.stringify(pedidos));

        alert("Pedido finalizado com sucesso!");
        localStorage.removeItem("carrinho");
        carrinho = [];
        valorFrete = 0;
        atualizarCarrinho();
        freteInfo.innerHTML = "";
        document.getElementById("cep").value = "";
    };

    atualizarCarrinho();
});

async function calcularFretePorRaio() {
    const cep = document.getElementById('cep-cliente').value.replace(/\D/g, '');
    const resultado = document.getElementById('resultado-frete');
    resultado.innerHTML = "Calculando...";

    if (cep.length !== 8) {
        resultado.innerHTML = '<span class="text-danger">CEP inválido.</span>';
        return;
    }

    try {
        // 1. Buscar coordenadas do CEP (cliente)
        const viaCepResponse = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const viaCepData = await viaCepResponse.json();

        if (viaCepData.erro) {
            resultado.innerHTML = '<span class="text-danger">CEP não encontrado.</span>';
            return;
        }

        const enderecoCompleto = `${viaCepData.logradouro}, ${viaCepData.bairro}, ${viaCepData.localidade}, ${viaCepData.uf}`;
        const clienteCoords = await obterCoordenadas(enderecoCompleto);

        // 2. Coordenadas fixas da hamburgueria
        const hamburgueriaCoords = await obterCoordenadas("Rua Manaus, 37 - Jardim Marsola, Campo Limpo Paulista - SP");

        // 3. Calcular distância entre os dois pontos
        const distanciaKm = await calcularDistanciaKm(hamburgueriaCoords, clienteCoords);

        // 4. Definir valor do frete com base na distância
        let valor = distanciaKm;

        if (distanciaKm > 10) {
            resultado.innerHTML = `<span class="text-danger">Distância de ${distanciaKm.toFixed(1)} km fora da área de entrega.</span>`;
            return;
        }

        // 5. Atualizar valor do frete
        valorFrete = valor;
        resultado.innerHTML = `<span class="text-success">Distância: ${distanciaKm.toFixed(2)} km | Frete: R$ ${valor.toFixed(2)}</span>`;
        atualizarCarrinho(); // para atualizar total com frete
    } catch (err) {
        console.error(err);
        resultado.innerHTML = '<span class="text-danger">Erro ao calcular frete. Tente novamente.</span>';
    }
}

// Função para obter coordenadas a partir de endereço (Geocoding)
async function obterCoordenadas(endereco) {
    const apiKey = '5b3ce3597851110001cf62484ce6b20f9c1e40628582da0b3bf2aff1'; // Substitua pela sua chave do OpenRouteService
    const encodedEndereco = encodeURIComponent(endereco);
    const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodedEndereco}&size=1`;

    const resposta = await fetch(url);
    const dados = await resposta.json();

    if (dados.features && dados.features.length > 0) {
        return dados.features[0].geometry.coordinates; // [lng, lat]
    } else {
        throw new Error('Endereço não encontrado no ORS');
    }
}

// Função para calcular distância entre dois pontos (Routing)
async function calcularDistanciaKm(origem, destino) {
    const apiKey = '5b3ce3597851110001cf62484ce6b20f9c1e40628582da0b3bf2aff1';
    const url = `https://api.openrouteservice.org/v2/directions/driving-car`;

    const resposta = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': apiKey,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            coordinates: [origem, destino],
        }),
    });

    if (!resposta.ok) {
        const erroTexto = await resposta.text();
        console.error("Erro na API de rotas:", erroTexto);
        throw new Error("Erro ao consultar a API de rotas.");
    }

    const dados = await resposta.json();

    if (dados.routes && dados.routes.length > 0) {
        return dados.routes[0].summary.distance / 1000; // distância em km
    } else {
        throw new Error('Não foi possível calcular a rota.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.navbar-nav .nav-link');
    const currentPage = window.location.pathname.split('/').pop();

    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (href === 'index.html' && (currentPage === '' || currentPage === '/'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// Mostrar controles
function mostrarControles(btn, nome, preco, img) {
    const container = btn.closest('.btn-container');
    btn.style.display = 'none';
    container.querySelector('.quantidade-controlador').style.display = 'flex';
    container.querySelector('.personalizacoes').style.display = 'block';
    container.querySelector('.btn-confirmar').style.display = 'inline-block';
    container.querySelector('.btn-voltar').style.display = 'inline-block';
    container.querySelector('.feedback-message').textContent = '';
}

// Alterar quantidade
function alterarQuantidade(btn, delta) {
    const container = btn.closest('.quantidade-controlador');
    const span = container.querySelector('.quantidade-value');
    let quantidade = parseInt(span.textContent);
    quantidade = Math.max(1, quantidade + delta);
    span.textContent = quantidade;
}

// Confirmar adição ao carrinho
function confirmarAdicao(btn, nome, preco, img) {
    const container = btn.closest('.btn-container');
    const quantidade = parseInt(container.querySelector('.quantidade-value').textContent);
    const observacao = container.querySelector('input[type="text"]').value.trim();

    // Nova forma de pegar ingredientes (inputs number)
    const inputs = container.querySelectorAll('input[type="number"]');
    const ingredientes = [];

    inputs.forEach(input => {
        const qtd = parseInt(input.value);
        if (qtd > 0) {
            const nomeAdicional = input.name.split('-')[1];
            ingredientes.push(`${qtd}x ${nomeAdicional}`);
        }
    });
    const pedido = { nome, preco, quantidade, observacao, adicionais: ingredientes, img };


    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    // Verifica se já existe item igual
    let igual = carrinho.find(item =>
        item.nome === pedido.nome &&
        JSON.stringify(item.adicionais) === JSON.stringify(pedido.adicionais) &&
        item.observacao === pedido.observacao
    );

    if (igual) {
        igual.quantidade += quantidade;
    } else {
        carrinho.push(pedido);
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    container.querySelector('.feedback-message').textContent = `Adicionado ${quantidade}x ${nome} ao carrinho.`;
    resetarControles(container);

    alert(`Pedido "${nome}" adicionado ao carrinho!`);
}

// Voltar ao menu
function voltarMenu(btn) {
    const container = btn.closest('.btn-container');
    resetarControles(container);
}

// Resetar controles
function resetarControles(container) {
    container.querySelector('.btn-adicionar').style.display = 'inline-block';
    container.querySelector('.quantidade-controlador').style.display = 'none';
    container.querySelector('.quantidade-value').textContent = '1';
    container.querySelector('.personalizacoes').style.display = 'none';
    container.querySelector('.btn-confirmar').style.display = 'none';
    container.querySelector('.btn-voltar').style.display = 'none';
    container.querySelector('input[type="text"]').value = '';
    container.querySelectorAll('input[type="checkbox"]').forEach(chk => chk.checked = false);
    container.querySelector('.feedback-message').textContent = '';
}

