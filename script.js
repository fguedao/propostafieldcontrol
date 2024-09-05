document.getElementById('proposalForm').addEventListener('submit', function (e) {
    e.preventDefault();
    generateProposal();
});

function generateProposal() {
    const companyName = document.getElementById('companyName').value;
    const clientName = document.getElementById('clientName').value;
    const dueDate = document.getElementById('dueDate').value;
    const teams = parseInt(document.getElementById('teams').value) || 1;
    const discount = parseFloat(document.getElementById('discount').value) || 0;

    const selectedProducts = [];
    const productElements = document.querySelectorAll('input[type="checkbox"]:checked');
    let totalPrice = 0;

    productElements.forEach(function (product) {
        const price = parseFloat(product.dataset.price);
        let annualPrice;

        if (product.id === 'product2') { // Implantação - valor fixo de R$299,00
            annualPrice = 299; // Valor fixo para implantação
        } else if (product.id === 'product3') { // Licença - Aplicativo do Colaborador
            annualPrice = price * teams * 12; // Multiplica pelo número de equipes e 12 meses
        } else if (product.id === 'product1') { // Painel de gestão
            annualPrice = price * 12; // Multiplica por 12
        } else {
            annualPrice = price * 12; // Multiplica por 12 para os outros módulos
        }

        totalPrice += annualPrice;
        selectedProducts.push(`${product.dataset.name} - ${formatCurrency(annualPrice)}`);
    });

    const discountedPrice = totalPrice - (totalPrice * (discount / 100));

    let proposalText = `
        <h2>Proposta Comercial</h2>
        <p><strong>Nome da Empresa:</strong> ${companyName}</p>
        <p><strong>Nome do Cliente:</strong> ${clientName}</p>
        <p><strong>Quantidade de Equipes de Campo:</strong> ${teams}</p>
        <p><strong>Total Anual:</strong> ${formatCurrency(totalPrice)}</p>
    `;

    if (discount > 0) {
        proposalText += `
            <p><strong>Desconto:</strong> ${discount}%</p>
            <p><strong>Total com Desconto:</strong> ${formatCurrency(discountedPrice)}</p>
        `;
    }

    proposalText += `
        <h3>Plano</h3>
        <ul>
    `;

    selectedProducts.forEach(function (product) {
        proposalText += `<li>${product}</li>`;
    });

    proposalText += `</ul>`;

    document.getElementById('proposalOutput').innerHTML = proposalText;
    displayPaymentOptions(discountedPrice, discount);
}

function displayPaymentOptions(totalAmount, discount) {
    const maxBoletos = 12;

    let cardInstallments = '';
    let boletoOptions = '';

    // Opção 1: Cartão de Crédito
    cardInstallments = `
        <div class="payment-option card">
            <p><strong>Opção 1:</strong> Parcelamento no Cartão de Crédito</p>
            <p><strong>Total Anual:</strong> ${formatCurrency(totalAmount)}</p>
            <label for="cardInstallments">Escolha o número de parcelas:</label>
            <select id="cardInstallments" name="cardInstallments">
    `;

    for (let i = 1; i <= 12; i++) {
        cardInstallments += `<option value="${i}">${i}x</option>`;
    }

    cardInstallments += `
            </select>
            <p id="cardInstallmentsAmount"></p>
        </div>
    `;

    // Opção 2: Boleto Bancário
    boletoOptions = `
        <div class="payment-option boleto">
            <p><strong>Opção 2:</strong> Parcelamento em Boletos</p>
            <p><strong>Total Anual:</strong> ${formatCurrency(totalAmount)}</p>
            <label for="boletoInstallments">Escolha o número de boletos:</label>
            <select id="boletoInstallments" name="boletoInstallments">
    `;

    for (let i = 1; i <= maxBoletos; i++) {
        boletoOptions += `<option value="${i}">${i}x</option>`;
    }

    boletoOptions += `
            </select>
            <p id="boletoInstallmentsAmount"></p>
        </div>
    `;

    let attentionMessage = '';
    if (discount > 15) {
        attentionMessage = `
            <div class="attention" style="color: red; font-weight: bold; margin-top: 20px;">
                <p><strong>Atenção:</strong> A proposta comercial corre o risco de não ser aprovada pela diretoria devido ao desconto elevado (${discount}%).</p>
            </div>
        `;
    }

    document.getElementById('paymentDetails').innerHTML = `${cardInstallments}${boletoOptions}${attentionMessage}`;
    
    // Atualizar valores das parcelas ao mudar seleção
    document.getElementById('cardInstallments').addEventListener('change', function () {
        const installments = parseInt(this.value);
        const amountPerInstallment = formatCurrency(totalAmount / installments);
        document.getElementById('cardInstallmentsAmount').innerText = `Valor de cada parcela: ${amountPerInstallment}`;
    });

    document.getElementById('boletoInstallments').addEventListener('change', function () {
        const installments = parseInt(this.value);
        const amountPerInstallment = formatCurrency(totalAmount / installments);
        document.getElementById('boletoInstallmentsAmount').innerText = `Valor de cada boleto: ${amountPerInstallment}`;
    });
}

function formatCurrency(value) {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function updateTotal() {
    const teams = parseInt(document.getElementById('teams').value) || 1;
    const productElements = document.querySelectorAll('input[type="checkbox"]:checked');
    let totalPrice = 0;

    productElements.forEach(function (product) {
        const price = parseFloat(product.dataset.price);
        let annualPrice;

        if (product.id === 'product2') { // Implantação
            annualPrice = 299; // Valor fixo para implantação
        } else if (product.id === 'product3') { // Licença - Aplicativo do Colaborador
            annualPrice = price * teams * 12; // Multiplicar pela quantidade de equipes e por 12 (mensal)
        } else if (product.id === 'product1') { // Painel de gestão
            annualPrice = price * 12; // Multiplicar por 12
        } else {
            annualPrice = price * 12; // Para os outros produtos, multiplicar por 12 (mensal)
        }

        totalPrice += annualPrice;
    });

    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const discountedPrice = totalPrice - (totalPrice * (discount / 100));

    document.getElementById('totalAmount').innerHTML = `
        <p><strong>Valor Total Anual:</strong> ${formatCurrency(discountedPrice)}</p>
    `;
}

document.querySelectorAll('input[type="checkbox"]').forEach(function (checkbox) {
    checkbox.addEventListener('change', updateTotal);
});

document.getElementById('teams').addEventListener('input', updateTotal);
document.getElementById('discount').addEventListener('input', updateTotal);
